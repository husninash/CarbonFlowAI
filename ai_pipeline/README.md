# Emiora AI: Computer Vision Traffic Pipeline

Pipeline ini memproses rekaman video lalu lintas secara real-time untuk mendeteksi kendaraan, mengklasifikasikan tipenya, dan mengkalkulasikan estimasi emisi CO2 berdasarkan standar Euro 6 / EPA.

## Struktur Pipeline

- **`video_generator.py`**: Menghasilkan video lalu lintas simulasi resolusi tinggi dengan jalan raya, mobil, bus, truk, dan sepeda motor yang bergerak dinamis.
- **`pipeline.py`**: Melakukan pemrosesan frame OpenCV, menggambar *bounding box* pelacakan objek, mengestimasi emisi CO2 secara dinamis, dan mengekspor data analisis terbaru ke file `src/app/data/cv_analytics.json` untuk dikonsumsi oleh dashboard React.

## Persyaratan Sistem

- Python 3.8 atau lebih baru
- Pustaka tambahan: `opencv-python`, `numpy`

## Cara Instalasi & Menjalankan

1. **Instalasi Dependensi**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Buat Video Simulasi**:
   ```bash
   python video_generator.py
   ```

3. **Jalankan Pipeline Deteksi AI**:
   ```bash
   python pipeline.py
   ```
   Akan muncul jendela visualisasi pemrosesan video OpenCV di layar Anda yang menunjukkan deteksi objek secara real-time. Tekan tombol **'q'** untuk keluar.
