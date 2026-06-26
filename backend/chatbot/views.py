import requests
import uuid

LANGFLOW_URL = "http://localhost:7860/api/v1/run/9190ff32-645a-44f4-bddf-f3dfb81ba57c"
LANGFLOW_API_KEY = "YOUR_API_KEY_HERE"  # isi dari teman kamu

def generate_jawaban(pertanyaan: str, diagnosis) -> str:
    """Kirim pertanyaan ke Langflow, return jawaban AI."""

    # Buat konteks dari hasil diagnosis
    hasil_teratas = diagnosis.hasildiagnosis_set.order_by('ranking').first()
    konteks = ""
    if hasil_teratas:
        p = hasil_teratas.id_penyakit
        cf = float(hasil_teratas.cf_final) * 100
        konteks = (
            f"Petani ini sudah didiagnosis: {p.nama_penyakit} "
            f"(keyakinan {cf:.1f}%). "
            f"Deskripsi: {p.deskripsi}. Penanganan: {p.penanganan}."
        )

    input_lengkap = f"{konteks}\n\nPertanyaan petani: {pertanyaan}" if konteks else pertanyaan

    try:
        response = requests.post(
            LANGFLOW_URL,
            json={
                "output_type": "chat",
                "input_type": "chat",
                "input_value": input_lengkap,
                "session_id": str(uuid.uuid4()),
            },
            headers={"x-api-key": LANGFLOW_API_KEY},
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()

        # Ambil teks jawaban dari response Langflow
        return (
            data["outputs"][0]["outputs"][0]
            ["results"]["message"]["text"]
        )
    except Exception as e:
        # Fallback ke jawaban default kalau Langflow tidak bisa diakses
        return f"Maaf, layanan chatbot sedang tidak tersedia. ({str(e)})"