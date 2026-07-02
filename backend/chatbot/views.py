import requests
import uuid
from decouple import config

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import serializers

from .models import RiwayatChat
from diagnosis.models import Diagnosis


# ── Serializer ────────────────────────────────────────────────────────────────

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model  = RiwayatChat
        fields = ['id_chat', 'pertanyaan', 'jawaban', 'waktu']


# ── Helper: call Langflow API ─────────────────────────────────────────────────

def generate_jawaban(pertanyaan: str, diagnosis) -> str:
    """Kirim pertanyaan ke Langflow (Gemini), return jawaban AI."""

    # Buat konteks dari hasil diagnosis
    hasil_list = diagnosis.hasildiagnosis_set.order_by('ranking')
    konteks = ""
    if hasil_list.exists():
        baris = []
        for h in hasil_list[:3]:  # ambil top 3
            p  = h.id_penyakit
            cf = float(h.cf_final) * 100
            baris.append(
                f"- {p.nama_penyakit} (keyakinan {cf:.1f}%): {p.deskripsi or '-'} | Penanganan: {p.penanganan or '-'}"
            )
        konteks = "Hasil diagnosis CF:\n" + "\n".join(baris)

    input_lengkap = f"{konteks}\n\nPertanyaan petani: {pertanyaan}" if konteks else pertanyaan

    try:
        response = requests.post(
            config('LANGFLOW_URL'),
            json={
                "output_type": "chat",
                "input_type":  "chat",
                "input_value": input_lengkap,
                "session_id":  str(uuid.uuid4()),
            },
            headers={
                "x-api-key": config('LANGFLOW_API_KEY'),
                "ngrok-skip-browser-warning": "true"   # ← tambahkan baris ini
            },
            timeout=90,
            
        )
        response.raise_for_status()
        data = response.json()

        # Ambil teks jawaban dari response Langflow
        return (
            data["outputs"][0]["outputs"][0]
            ["results"]["message"]["text"]
        )
    except requests.exceptions.Timeout:
        return "Maaf, layanan chatbot membutuhkan waktu terlalu lama. Coba lagi sebentar."
    except Exception as e:
        return f"Maaf, layanan chatbot sedang tidak tersedia. ({str(e)})"


# ── Views ─────────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def kirim_pesan(request, diagnosis_id):
    """POST /api/chatbot/<diagnosis_id>/kirim/"""
    try:
        diagnosis = Diagnosis.objects.get(pk=diagnosis_id, id_user=request.user)
    except Diagnosis.DoesNotExist:
        return Response({'error': 'Diagnosis tidak ditemukan'}, status=404)

    pertanyaan = request.data.get('pertanyaan', '').strip()
    if not pertanyaan:
        return Response({'error': 'Pertanyaan tidak boleh kosong'}, status=400)

    jawaban = generate_jawaban(pertanyaan, diagnosis)

    chat = RiwayatChat.objects.create(
        id_diagnosis=diagnosis,
        pertanyaan=pertanyaan,
        jawaban=jawaban,
    )

    return Response(ChatSerializer(chat).data, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def riwayat_chat(request, diagnosis_id):
    """GET /api/chatbot/<diagnosis_id>/"""
    try:
        diagnosis = Diagnosis.objects.get(pk=diagnosis_id, id_user=request.user)
    except Diagnosis.DoesNotExist:
        return Response({'error': 'Diagnosis tidak ditemukan'}, status=404)

    chats = RiwayatChat.objects.filter(id_diagnosis=diagnosis).order_by('waktu')
    return Response(ChatSerializer(chats, many=True).data)