import cv2
import numpy as np
import random
import os

def generate_traffic_video(output_path="traffic_sim.avi", duration_sec=15, fps=30):
    print(f"Membuat video lalu lintas simulasi di: {output_path}...")
    width, height = 640, 480
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    # Definisi kendaraan yang disimulasikan
    # Setiap kendaraan: [x, y, speed, type, color, size_w, size_h]
    vehicles = []
    vehicle_types = [
        {"type": "Car", "color": (0, 255, 136), "w": 40, "h": 20},       # Neon Green
        {"type": "Bus", "color": (0, 217, 255), "w": 70, "h": 26},       # Neon Cyan
        {"type": "Truck", "color": (139, 92, 246), "w": 80, "h": 28},     # Purple
        {"type": "Motorcycle", "color": (245, 158, 11), "w": 25, "h": 12}  # Orange
    ]

    total_frames = duration_sec * fps
    lanes = [120, 180, 240, 300, 360]  # Posisi Y untuk lajur jalan

    for frame_idx in range(total_frames):
        # Buat canvas latar belakang (aspal abu-abu tua)
        frame = np.ones((height, width, 3), dtype=np.uint8) * 30

        # Gambar jalan raya
        cv2.rectangle(frame, (0, 80), (width, 400), (45, 45, 45), -1)
        # Garis pembatas jalan (atas dan bawah)
        cv2.line(frame, (0, 80), (width, 80), (100, 100, 100), 2)
        cv2.line(frame, (0, 400), (width, 400), (100, 100, 100), 2)

        # Gambar marka jalan putus-putus
        for lane_y in lanes[1:-1]:
            for x in range(0, width, 40):
                if (x // 40) % 2 == 0:
                    cv2.line(frame, (x, lane_y), (x + 20, lane_y), (150, 150, 150), 1)

        # Tambahkan kendaraan baru secara acak
        if random.random() < 0.15 and len(vehicles) < 12:
            v_info = random.choice(vehicle_types)
            lane_y = random.choice(lanes[:-1]) + 10
            speed = random.uniform(3.0, 7.0)
            # x awal di kiri layar
            vehicles.append({
                "x": -100,
                "y": lane_y,
                "speed": speed,
                "type": v_info["type"],
                "color": v_info["color"],
                "w": v_info["w"],
                "h": v_info["h"]
            })

        # Gambar dan update posisi kendaraan
        remaining_vehicles = []
        for v in vehicles:
            v["x"] += v["speed"]
            # Hanya simpan kendaraan yang masih ada di dalam layar
            if v["x"] < width + 100:
                # Gambar badan kendaraan
                x1, y1 = int(v["x"]), int(v["y"])
                x2, y2 = x1 + v["w"], y1 + v["h"]
                cv2.rectangle(frame, (x1, y1), (x2, y2), v["color"], -1)
                
                # Gambar kaca depan (simulasi arah gerak ke kanan)
                windshield_x = x2 - int(v["w"] * 0.2)
                cv2.rectangle(frame, (windshield_x, y1 + 2), (x2 - 2, y2 - 2), (255, 255, 255), -1)

                remaining_vehicles.append(v)
        
        vehicles = remaining_vehicles

        # Tambahkan label petunjuk simulasi
        cv2.putText(frame, "SIMULATOR LAJU JALAN RAYA JAKARTA", (20, 40), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, f"Frame: {frame_idx}/{total_frames} | FPS: {fps}", (20, 440), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (150, 150, 150), 1)

        out.write(frame)

    out.release()
    print(f"Simulasi video sukses dibuat: {output_path} ({duration_sec} detik)")

if __name__ == "__main__":
    generate_traffic_video()
