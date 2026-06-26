"""
Endpoint diagnosis dengan metode Certainty Factor (CF).

Rumus:
    CF kombinasi = MB - MD
    CF gabungan  = CF1 + CF2 * (1 - CF1)   ← untuk dua gejala ke atas

Flow:
    1. User kirim daftar gejala + nilai CF user (skala 0.0 - 1.0)
    2. Sistem hitung CF kombinasi tiap gejala
    3. Sistem gabungkan CF per penyakit
    4. Simpan ke Diagnosis, DetailDiagnosis, HasilDiagnosis
    5. Return hasil terurut dari CF tertinggi
"""

from decimal import Decimal

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.utils import timezone

from .models import Diagnosis, DetailDiagnosis, HasilDiagnosis
from .serializers import DiagnosisSerializer
from pengetahuan.models import Gejala, RelasiPenyakitGejala


# ── Helper: hitung CF ─────────────────────────────────────────────────────────

def hitung_cf_kombinasi(mb, md, cf_user):
    """CF kombinasi = (MB - MD) * CF_user"""
    return (mb - md) * cf_user


def gabung_cf(cf_lama, cf_baru):
    """CF gabungan = CF1 + CF2 * (1 - CF1)"""
    return cf_lama + cf_baru * (1 - cf_lama)


# ── API: Submit Diagnosis ─────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_diagnosis(request):
    """
    POST /api/diagnosis/submit/

    Body:
    {
        "gejala": [
            {"kode_gejala": "G001", "cf_user": 0.8},
            {"kode_gejala": "G003", "cf_user": 0.6},
            ...
        ]
    }
    """
    gejala_input = request.data.get('gejala', [])

    if not gejala_input:
        return Response({'error': 'Minimal 1 gejala harus dipilih'}, status=400)

    # Buat record diagnosis
    diagnosis = Diagnosis.objects.create(id_user=request.user)

    # Ambil semua relasi yang relevan
    kode_list = [g['kode_gejala'] for g in gejala_input]
    relasi_qs = RelasiPenyakitGejala.objects.filter(
        kode_gejala__kode_gejala__in=kode_list
    ).select_related('id_penyakit', 'kode_gejala')

    # Map: kode_gejala → cf_user dari input
    cf_user_map = {g['kode_gejala']: Decimal(str(g['cf_user'])) for g in gejala_input}

    # Simpan detail + hitung CF per penyakit
    cf_per_penyakit = {}   # {id_penyakit: cf_gabungan}

    for relasi in relasi_qs:
        kode   = relasi.kode_gejala.kode_gejala
        cf_usr = cf_user_map.get(kode, Decimal('0'))

        cf_komb = hitung_cf_kombinasi(relasi.mb, relasi.md, cf_usr)

        # Simpan detail
        DetailDiagnosis.objects.create(
            id_diagnosis=diagnosis,
            kode_gejala=relasi.kode_gejala,
            cf_user=cf_usr,
            cf_kombinasi=cf_komb,
        )

        # Gabungkan CF per penyakit
        pid = relasi.id_penyakit.id_penyakit
        if pid not in cf_per_penyakit:
            cf_per_penyakit[pid] = cf_komb
        else:
            cf_per_penyakit[pid] = gabung_cf(cf_per_penyakit[pid], cf_komb)

    if not cf_per_penyakit:
        diagnosis.delete()
        return Response({'error': 'Gejala tidak cocok dengan basis pengetahuan'}, status=400)

    # Simpan hasil, urutkan dari CF tertinggi
    hasil_urut = sorted(cf_per_penyakit.items(), key=lambda x: x[1], reverse=True)

    for ranking, (pid, cf_final) in enumerate(hasil_urut, start=1):
        from pengetahuan.models import Penyakit
        HasilDiagnosis.objects.create(
            id_diagnosis=diagnosis,
            id_penyakit=Penyakit.objects.get(pk=pid),
            cf_final=round(cf_final, 4),
            ranking=ranking,
        )

    # Return hasil lengkap
    return Response(DiagnosisSerializer(diagnosis).data, status=201)


# ── API: Riwayat Diagnosis ────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def riwayat_diagnosis(request):
    """GET /api/diagnosis/riwayat/  → riwayat diagnosis milik user yang login"""
    diagnoses = Diagnosis.objects.filter(id_user=request.user).order_by('-tanggal')
    return Response(DiagnosisSerializer(diagnoses, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detail_diagnosis(request, pk):
    """GET /api/diagnosis/<pk>/  → detail satu diagnosis"""
    try:
        diagnosis = Diagnosis.objects.get(pk=pk, id_user=request.user)
    except Diagnosis.DoesNotExist:
        return Response({'error': 'Diagnosis tidak ditemukan'}, status=404)

    return Response(DiagnosisSerializer(diagnosis).data)
