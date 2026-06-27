# 🌾 PadiSmart

> Sistem Pakar Diagnosis Hama dan Penyakit Tanaman Padi berbasis Web menggunakan Metode **Certainty Factor (CF)** dengan integrasi **Chatbot AI (Gemini)**

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![Django](https://img.shields.io/badge/Django-6.0-green?logo=django)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)
![DRF](https://img.shields.io/badge/DRF-REST_API-red)
![Langflow](https://img.shields.io/badge/Langflow-1.9-purple)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-blue?logo=google)

---

## 📌 Tentang Project

**PadiSmart** adalah sistem pakar berbasis web yang membantu petani Indonesia mendiagnosis hama dan penyakit tanaman padi secara mandiri. Pengguna memilih gejala yang ditemukan di lahan, menentukan tingkat keyakinan (CF User), lalu sistem menghitung probabilitas penyakit menggunakan metode **Certainty Factor**. Hasil diagnosis kemudian dapat dilanjutkan dengan sesi tanya jawab bersama **chatbot AI berbasis Gemini 2.5 Flash**.

**Mata Kuliah:** Kecerdasan Buatan  
**Tim:** PadiSmart  
**Universitas:** Universitas Nusaputra

---

## ✨ Fitur Utama

- 🔐 **Autentikasi JWT** — Register, Login, Logout dengan SimpleJWT
- 🧠 **Diagnosis CF** — Hitung Certainty Factor dari gejala yang dipilih pengguna
- 📊 **Hasil Diagnosis** — Ranking penyakit/hama berdasarkan nilai CF tertinggi
- 💬 **Chatbot AI** — Tanya jawab lanjutan menggunakan Gemini 2.5 Flash via Langflow
- 📋 **Riwayat Diagnosis** — Histori semua sesi diagnosis per user
- 🛡️ **Admin Panel** — CRUD data penyakit, gejala, dan relasi CF pakar
- 📖 **Dokumentasi API** — Swagger UI & ReDoc otomatis

---

## 🏗️ Arsitektur Sistem

```
Frontend (HTML/CSS/JS + Tailwind)
        ↓ HTTP Request
Backend (Django REST Framework)
        ↓                    ↓
   MySQL Database      Langflow (Gemini 2.5 Flash)
```

---

## 🗂️ Struktur Project

```
padismart/
├── backend/                    # Django Backend
│   ├── accounts/               # App autentikasi & manajemen user
│   ├── pengetahuan/            # App master data (penyakit, gejala, relasi CF)
│   ├── diagnosis/              # App logika CF & hasil diagnosis
│   ├── chatbot/                # App integrasi chatbot Langflow/Gemini
│   ├── padismart/              # Konfigurasi utama Django
│   ├── data/                   # File CSV dataset
│   │   ├── penyakit.csv
│   │   ├── gejala.csv
│   │   └── relasi_penyakit_gejala.csv
│   ├── manage.py
│   └── .env.example
├── frontend/                   # Frontend statis
│   ├── index.html              # Landing page
│   ├── auth/
│   │   ├── login.html
│   │   └── register.html
│   ├── diagnosis/
│   │   ├── pilih-gejala.html
│   │   ├── hasil.html
│   │   └── chat.html
│   ├── riwayat/
│   │   └── index.html
│   ├── admin/
│   │   └── dashboard.html
│   └── assets/
│       ├── css/style.css
│       └── js/api.js
└── docs/
    └── langflow/
        └── padiSmart_Goal.json # Flow Langflow untuk chatbot
```

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| Backend | Django 6.0, Django REST Framework |
| Auth | SimpleJWT |
| Database | MySQL 8.0 |
| AI/Chatbot | Langflow 1.9, Gemini 2.5 Flash |
| Dokumentasi API | drf-spectacular (Swagger + ReDoc) |
| Frontend | HTML, CSS, JavaScript, Tailwind CSS |
| Metode Pakar | Certainty Factor (CF) |

---

## ⚙️ Cara Instalasi

### Prasyarat
- Python 3.11+
- MySQL 8.0
- Node.js (opsional, untuk Tailwind CLI)

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
pip install -r requirements.txt
```

### 4. Konfigurasi Environment

Buat file `.env` di folder `backend/` berdasarkan `.env.example`:

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
python manage.py import_data --csv-dir "path/ke/folder/data"
```

### 8. Buat Superuser (Admin)

```bash
python manage.py createsuperuser
```

### 9. Jalankan Server

```bash
python manage.py runserver
```

---

## 💬 Setup Langflow (Chatbot)

1. Install Langflow di environment terpisah:
```bash
pip install langflow
langflow run
```

2. Buka `http://localhost:7860`
3. Import file `docs/langflow/padiSmart_Goal.json`
4. Isi **Google API Key** di komponen Language Model
5. Salin **Flow ID** dari URL browser dan **Langflow API Key** dari Settings → API Keys
6. Update `.env` dengan nilai tersebut

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
| POST | `/api/auth/logout/` | Logout | ✅ |
| GET | `/api/auth/me/` | Data user login | ✅ |
| GET | `/api/pengetahuan/penyakit/` | List penyakit | ❌ |
| GET | `/api/pengetahuan/gejala/` | List gejala | ❌ |
| GET | `/api/pengetahuan/relasi/` | Relasi + nilai CF pakar | ❌ |
| POST | `/api/diagnosis/submit/` | Submit gejala & hitung CF | ✅ |
| GET | `/api/diagnosis/riwayat/` | Riwayat diagnosis | ✅ |
| GET | `/api/diagnosis/<id>/` | Detail diagnosis | ✅ |
| POST | `/api/chatbot/<id>/kirim/` | Kirim pertanyaan ke bot | ✅ |
| GET | `/api/chatbot/<id>/` | Riwayat chat | ✅ |

---

## 🧮 Metode Certainty Factor

```
CF Kombinasi  = (MB - MD) × CF_User
CF Gabungan   = CF1 + CF2 × (1 - CF1)
```

**Skala CF User:**

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

## 📄 Lisensi

Project ini dibuat untuk keperluan akademik — Mata Kuliah Kecerdasan Buatan, Universitas Nusaputra.
