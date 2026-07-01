# 🌾 PadiSmart

> Sistem Pakar Diagnosis Hama dan Penyakit Tanaman Padi berbasis Web menggunakan Metode **Certainty Factor (CF)** dengan integrasi **Chatbot AI (Gemini via Langflow)**

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![Django](https://img.shields.io/badge/Django-6.0-green?logo=django)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)
![DRF](https://img.shields.io/badge/DRF-REST_API-red)
![Langflow](https://img.shields.io/badge/Langflow-1.10-purple)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-blue?logo=google)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CDN-38bdf8?logo=tailwindcss)

---

## 📌 Tentang Project

**PadiSmart** adalah sistem pakar berbasis web yang membantu petani Indonesia mendiagnosis hama dan penyakit tanaman padi secara mandiri. Pengguna memilih gejala yang ditemukan di lahan beserta tingkat keyakinannya sendiri (CF User), lalu sistem menghitung probabilitas penyakit menggunakan metode **Certainty Factor**. Hasil diagnosis dapat dilanjutkan dengan sesi tanya jawab bersama **chatbot AI berbasis Gemini 2.5 Flash** yang dijalankan melalui Langflow.

**Mata Kuliah:** Kecerdasan Buatan  
**Tim:** PadiSmart  
**Universitas:** Universitas Nusaputra

---

## ✨ Fitur Utama

- 🔐 **Autentikasi JWT** — Register, Login, Logout dengan SimpleJWT
- 🧠 **Diagnosis CF** — Setiap gejala punya slider CF sendiri, dihitung dengan metode Certainty Factor
- 📊 **Hasil Diagnosis** — Ranking penyakit/hama berdasarkan nilai CF tertinggi, lengkap dengan deskripsi & penanganan
- 💬 **Chatbot AI** — Tanya jawab lanjutan kontekstual berdasarkan hasil diagnosis, menggunakan Gemini 2.5 Flash via Langflow
- 📋 **Riwayat Diagnosis** — Histori semua sesi diagnosis per user, bisa expand untuk lihat detail & lanjut konsultasi
- 📖 **Referensi Ilmiah** — Halaman kurasi jurnal & paper yang menjadi rujukan pengembangan basis pengetahuan
- 📈 **Dashboard Statistik** — Ringkasan total penyakit/gejala/user/diagnosis dan grafik penyakit paling sering terdeteksi
- 🛡️ **Django Admin Panel** — CRUD data penyakit, gejala, dan relasi CF pakar
- 📖 **Dokumentasi API** — Swagger UI & ReDoc otomatis via drf-spectacular

---

## 🏗️ Arsitektur Sistem

```
Frontend (HTML/CSS/JS + Tailwind CDN, SPA-style)
        ↓ REST API (JWT)
Backend (Django REST Framework)
        ↓                    ↓
   MySQL Database      Langflow (Gemini 2.5 Flash)
```

---

## 🗂️ Struktur Project

```
padismart/
├── backend/                        # Django Backend
│   ├── accounts/                   # Autentikasi & manajemen user
│   ├── pengetahuan/                # Master data (penyakit, gejala, relasi CF) + statistik
│   ├── diagnosis/                  # Logika CF & hasil diagnosis
│   ├── chatbot/                    # Integrasi chatbot Langflow/Gemini
│   ├── padismart/                  # Konfigurasi utama Django
│   ├── data/                       # Dataset CSV
│   │   ├── penyakit.csv
│   │   ├── gejala.csv
│   │   └── relasi_penyakit_gejala.csv
│   ├── manage.py
│   └── .env.example
│
├── frontend/                       # Frontend SPA statis
│   ├── index.html                  # Entry point (navbar, auth modal, page container)
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js                  # Helper auth & base URL
│   │   ├── app.js                  # Controller utama & routing halaman
│   │   ├── auth.js                 # Login/register/logout
│   │   ├── dashboard.js            # Dashboard ringkasan & statistik
│   │   ├── diagnosis.js            # Pilih gejala, submit CF, hasil, chat
│   │   ├── chat.js                 # Chatbot AI
│   │   ├── articles.js             # Referensi jurnal & paper
│   │   └── history.js              # Riwayat diagnosis
│   └── assets/
│       ├── images/
│       └── icons/
│
└── docs/
    └── langflow/
        └── padiSmart_Goal.json     # Flow Langflow untuk chatbot
```

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| Backend | Django 6.0, Django REST Framework |
| Auth | SimpleJWT (dengan token blacklist) |
| Database | MySQL 8.0 |
| AI/Chatbot | Langflow 1.10, Gemini 2.5 Flash |
| Dokumentasi API | drf-spectacular (Swagger + ReDoc) |
| Frontend | HTML, CSS, JavaScript (Vanilla SPA), Tailwind CSS (CDN), Font Awesome |
| Metode Pakar | Certainty Factor (CF) |

---

## ⚙️ Cara Instalasi

### Prasyarat
- Python 3.11+
- MySQL 8.0
- Browser modern (Chrome/Edge/Firefox)

### 1. Clone Repository

```bash
git clone https://github.com/aldissa/PadiSmart.git
cd PadiSmart/backend
```

### 2. Buat Virtual Environment

```bash
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-decouple mysqlclient requests drf-spectacular
```

### 4. Konfigurasi Environment

Buat file `.env` di folder `backend/`:

```env
SECRET_KEY=your_django_secret_key
DB_NAME=padismart
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306
LANGFLOW_URL=http://localhost:7860/api/v1/run/<flow-id>
LANGFLOW_API_KEY=your_langflow_api_key
```

### 5. Buat Database MySQL

```sql
CREATE DATABASE padismart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6. Migrasi Database

```bash
python manage.py migrate
```

### 7. Import Data

```bash
python manage.py import_data --csv-dir "data"
```

### 8. Buat Superuser (Admin)

```bash
python manage.py createsuperuser
```

### 9. Jalankan Server Backend

```bash
python manage.py runserver
```

Server berjalan di `http://127.0.0.1:8000`

### 10. Jalankan Frontend

Buka `frontend/index.html` langsung di browser, atau serve dengan Live Server (VS Code extension) agar path relatif berjalan dengan baik.

---

## 💬 Setup Langflow (Chatbot)

Langflow dijalankan terpisah dari backend Django (environment sendiri) karena dependensinya berat.

```bash
python -m venv venv-langflow
.\venv-langflow\Scripts\Activate.ps1
pip install langflow
langflow run
```

1. Buka `http://localhost:7860`
2. Import file `docs/langflow/padiSmart_Goal.json`
3. Isi **Google API Key** di komponen Language Model (dapatkan gratis di [aistudio.google.com/apikey](https://aistudio.google.com/apikey))
4. Salin **Flow ID** dari URL browser dan **Langflow API Key** dari Settings → API Keys
5. Update `.env` backend dengan nilai tersebut

---

## 📖 Dokumentasi API

Setelah server berjalan, akses dokumentasi di:

| URL | Keterangan |
|---|---|
| `http://127.0.0.1:8000/api/docs/` | Swagger UI (interaktif) |
| `http://127.0.0.1:8000/api/redoc/` | ReDoc (lebih rapi) |
| `http://127.0.0.1:8000/api/schema/` | OpenAPI Schema (JSON) |

### Ringkasan Endpoint

| Method | Endpoint | Keterangan | Auth |
|---|---|---|---|
| POST | `/api/auth/register/` | Daftar akun | ❌ |
| POST | `/api/auth/login/` | Login, dapat JWT | ❌ |
| POST | `/api/auth/logout/` | Logout (blacklist token) | ✅ |
| GET | `/api/auth/me/` | Data user login | ✅ |
| GET | `/api/pengetahuan/penyakit/` | List penyakit | ❌ |
| GET | `/api/pengetahuan/gejala/` | List gejala | ❌ |
| GET | `/api/pengetahuan/relasi/` | Relasi + nilai CF pakar | ❌ |
| GET | `/api/pengetahuan/statistik/summary/` | Ringkasan total (user, diagnosis, penyakit, gejala) | ❌ |
| GET | `/api/pengetahuan/statistik/penyakit/` | Penyakit paling sering terdeteksi | ❌ |
| GET | `/api/pengetahuan/statistik/cf-distribusi/` | Distribusi tingkat keyakinan CF | ❌ |
| GET | `/api/pengetahuan/statistik/gejala/` | Gejala paling sering dipilih | ❌ |
| POST | `/api/diagnosis/submit/` | Submit gejala & hitung CF | ✅ |
| GET | `/api/diagnosis/riwayat/` | Riwayat diagnosis user | ✅ |
| GET | `/api/diagnosis/<id>/` | Detail diagnosis | ✅ |
| POST | `/api/chatbot/<id>/kirim/` | Kirim pertanyaan ke bot | ✅ |
| GET | `/api/chatbot/<id>/` | Riwayat chat | ✅ |

---

## 🧮 Metode Certainty Factor

```
CF Kombinasi  = (MB - MD) × CF_User
CF Gabungan   = CF1 + CF2 × (1 - CF1)
```

**Skala CF User** (dipilih user lewat slider per gejala):

| Nilai | Keterangan |
|---|---|
| 0.0 | Tidak yakin sama sekali |
| 0.2 | Sedikit yakin |
| 0.4 | Cukup yakin |
| 0.6 | Yakin |
| 0.8 | Sangat yakin |
| 1.0 | Pasti |

---

## 🧪 Menjalankan Unit Test

```bash
python manage.py test
```

---

## 📚 Referensi Ilmiah

Basis pengetahuan dan metode pada sistem ini merujuk pada beberapa jurnal, di antaranya:

- Hutabarat, F. P., & Nasution, Y. R. (2024). *Sistem Pakar Diagnosis Hama dan Penyakit pada Tanaman Padi menggunakan Metode Certainty Factor*. MEANS.
- Karuniawan, P., Farida, I. N., & Suhertian, J. (2021). *Implementasi Metode Certainty Factor untuk Mengidentifikasi Penyakit Tanaman Kedelai dan Padi*. Nusantara of Engineering.
- Bhat, S. A., & Huang, N. F. (2021). *Big Data and AI Revolution in Precision Agriculture: Survey and Challenges*. IEEE Access.
- Barons, M. J., Walsh, L. E., Salakpi, E. E., & Nichols, L. (2024). *A Decision Support System for Sustainable Agriculture and Food Loss Reduction under Uncertain Agricultural Policy Frameworks*. Agriculture (MDPI).

Daftar lengkap dan link tersedia di halaman **Artikel** pada aplikasi.

---

## 📄 Lisensi

Project ini dibuat untuk keperluan akademik — Mata Kuliah Kecerdasan Buatan, Universitas Nusaputra.
