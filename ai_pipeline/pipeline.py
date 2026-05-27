import cv2
import numpy as np
import time
import json
import os
from video_generator import generate_traffic_video

# Konfigurasi standar emisi (kg CO2 per km)
EMISSION_FACTORS = {
    "Car": 0.12,
    "Bus": 0.68,
    "Truck": 0.85,
    "Motorcycle": 0.05
}

def init_analytics_file(output_path):
    # Pastikan direktori tujuan ada
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    initial_data = {
        "status": "active",
        "timestamp": time.time(),
        "totals": {
            "Car": 0,
            "Bus": 0,
            "Truck": 0,
            "Motorcycle": 0,
            "Total": 0
        },
        "carbon_emissions_kg": 0.0,
        "congestion_index": "Low",
        "active_vehicles_count": 0,
        "fps": 30.0
    }
    with open(output_path, 'w') as f:
        json.dump(initial_data, f, indent=2)

def run_cv_pipeline(video_path="traffic_sim.avi", data_output="../public/cv_analytics.json"):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    abs_video_path = os.path.abspath(os.path.join(script_dir, video_path))
    abs_data_output = os.path.abspath(os.path.join(script_dir, data_output))

    # Cek video simulasi, jika tidak ada buat otomatis
    if not os.path.exists(abs_video_path):
        # We need to run it inside the script dir so it writes files there
        generate_traffic_video(abs_video_path)

    print(f"Menyiapkan output analitik di: {abs_data_output}")
    init_analytics_file(abs_data_output)

    cap = cv2.VideoCapture(abs_video_path)
    if not cap.isOpened():
        print(f"Error: Gagal membuka video stream {video_path}")
        return

    # Inisialisasi Background Subtractor klasik untuk Deteksi Gerak (Computer Vision)
    back_sub = cv2.createBackgroundSubtractorMOG2(history=500, varThreshold=25, detectShadows=True)

    # Statistik Pelacakan
    vehicle_counts = {"Car": 0, "Bus": 0, "Truck": 0, "Motorcycle": 0}
    total_co2 = 0.0
    tracked_ids = set()

    print("\n" + "="*50)
    print(" MENJALANKAN PIPELINE COMPUTER VISION (EMIORA AI)")
    print(" Tekan 'q' pada jendela visualisasi untuk berhenti.")
    print("="*50 + "\n")

    # Garis Pemicu Penghitungan (Trigger Line) di tengah layar (X = 320)
    trigger_line_x = 320

    while True:
        ret, frame = cap.read()
        if not ret:
            # Loop video jika habis
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        start_time = time.time()

        # 1. Image Pre-processing (Gray & Blur)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # 2. Penerapan Background Subtraction
        fg_mask = back_sub.apply(blurred)

        # 3. Morphological Operations (Membersihkan Noise)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        dilated = cv2.dilate(fg_mask, kernel, iterations=2)
        closing = cv2.morphologyEx(dilated, cv2.MORPH_CLOSE, kernel)

        # 4. Deteksi Kontur / Objek Bergerak
        contours, _ = cv2.findContours(closing, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        active_vehicles = 0
        current_frame_vehicles = []

        # Batas minimal area untuk kontur agar tidak mendeteksi debu/noise
        min_contour_area = 300

        for contour in contours:
            area = cv2.contourArea(contour)
            if area < min_contour_area:
                continue

            # Mendapatkan Bounding Box
            x, y, w, h = cv2.boundingRect(contour)

            # Batasi deteksi hanya pada area jalan raya saja (Y antara 80 dan 400)
            if y < 80 or y + h > 400:
                continue

            active_vehicles += 1

            # 5. Klasifikasi Kendaraan berdasarkan Dimensi Area dan Aspect Ratio
            v_type = "Car"
            if w > 65 and h > 20:
                v_type = "Truck" if w > 75 else "Bus"
            elif w < 30 and h < 15:
                v_type = "Motorcycle"

            # 6. Logika Pelacakan (Tracking) & Penghitungan saat melewati Garis Pemicu (Trigger Line)
            # Jika kendaraan mendekati garis pemicu X
            center_x = x + w // 2
            
            # Buat ID unik berdasarkan posisi Y lajur untuk simulasi pelacakan
            track_id = f"{v_type}_{y // 40}"

            # Jika melewati garis tengah dan belum terhitung
            if center_x > trigger_line_x and center_x < trigger_line_x + 15:
                if track_id not in tracked_ids:
                    tracked_ids.add(track_id)
                    vehicle_counts[v_type] += 1
                    # Estimasi emisi: Anggap berkendara sepanjang 1 km untuk setiap kendaraan yang lewat
                    total_co2 += EMISSION_FACTORS[v_type]
                    print(f"[CV DETECT] {v_type} terdeteksi! Emisi CO2 bertambah +{EMISSION_FACTORS[v_type]} kg")

            # Simpan data deteksi aktif untuk rendering visualisasi
            current_frame_vehicles.append((x, y, w, h, v_type))

        # 7. Render Visualisasi Overlay Bounding Box (Aesthetic Dark Neon Style)
        # Gambar Bounding Box di Frame Asli
        for (x, y, w, h, v_type) in current_frame_vehicles:
            # Warna neon sesuai tipe
            color = (0, 255, 136) # Car = Green
            if v_type == "Bus": color = (0, 217, 255) # Cyan
            elif v_type == "Truck": color = (246, 92, 139) # Pink
            elif v_type == "Motorcycle": color = (11, 158, 245) # Orange

            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            cv2.putText(frame, f"{v_type}", (x, y - 5), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, color, 1)

        # Gambar Garis Pemicu (Trigger Line)
        cv2.line(frame, (trigger_line_x, 80), (trigger_line_x, 400), (255, 255, 255), 2)
        cv2.putText(frame, "AI TRIGGER LINE", (trigger_line_x - 50, 70), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

        # Hitung Indeks Kemacetan
        congestion = "Low"
        if active_vehicles > 8:
            congestion = "High"
        elif active_vehicles > 4:
            congestion = "Medium"

        # Tampilkan Statistik pada Layar Preview
        cv2.rectangle(frame, (10, 10), (240, 160), (0, 0, 0), -1)
        cv2.rectangle(frame, (10, 10), (240, 160), (0, 255, 136), 1)
        
        cv2.putText(frame, "EMIORA AI PIPELINE", (20, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 136), 1)
        cv2.putText(frame, f"Total Vehicles: {sum(vehicle_counts.values())}", (20, 60), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)
        cv2.putText(frame, f"  - Cars: {vehicle_counts['Car']}", (20, 80), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (200, 200, 200), 1)
        cv2.putText(frame, f"  - Heavy (Truck/Bus): {vehicle_counts['Truck'] + vehicle_counts['Bus']}", (20, 100), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (200, 200, 200), 1)
        cv2.putText(frame, f"CO2 Carbon: {total_co2:.2f} kg", (20, 120), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 217, 255), 1)
        cv2.putText(frame, f"Congestion: {congestion}", (20, 140), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255) if congestion == "High" else (0, 255, 136), 1)

        # 8. Ekspor Analitik ke JSON secara Real-Time
        fps = 1.0 / (time.time() - start_time)
        analytics_data = {
            "status": "active",
            "timestamp": time.time(),
            "totals": {
                "Car": vehicle_counts["Car"],
                "Bus": vehicle_counts["Bus"],
                "Truck": vehicle_counts["Truck"],
                "Motorcycle": vehicle_counts["Motorcycle"],
                "Total": sum(vehicle_counts.values())
            },
            "carbon_emissions_kg": round(total_co2, 2),
            "congestion_index": congestion,
            "active_vehicles_count": active_vehicles,
            "fps": round(fps, 1)
        }
        
        try:
            with open(abs_data_output, 'w') as f:
                json.dump(analytics_data, f, indent=2)
        except Exception as e:
            print(f"[JSON Error] Gagal menulis data analitik: {e}")

        # Tampilkan video preview OpenCV
        cv2.imshow("Emiora AI - Real-time CV Pipeline", frame)

        # Keluar jika menekan tombol 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("\nPipeline dimatikan secara aman. Terimakasih!")

if __name__ == "__main__":
    run_cv_pipeline()
