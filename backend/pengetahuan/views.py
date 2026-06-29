from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Penyakit, Gejala, RelasiPenyakitGejala
from .serializers import PenyakitSerializer, GejalaSerializer, RelasiSerializer

from django.db.models import Count
from diagnosis.models import HasilDiagnosis, DetailDiagnosis
from accounts.models import User


# ── PENYAKIT ──────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def penyakit_list(request):
    if request.method == 'GET':
        return Response(PenyakitSerializer(Penyakit.objects.all(), many=True).data)

    if not request.user.is_authenticated or request.user.role != 'admin':
        return Response({'error': 'Akses ditolak'}, status=403)

    serializer = PenyakitSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def penyakit_detail(request, pk):
    try:
        penyakit = Penyakit.objects.get(pk=pk)
    except Penyakit.DoesNotExist:
        return Response({'error': 'Penyakit tidak ditemukan'}, status=404)

    if request.method == 'GET':
        return Response(PenyakitSerializer(penyakit).data)

    if not request.user.is_authenticated or request.user.role != 'admin':
        return Response({'error': 'Akses ditolak'}, status=403)

    if request.method == 'PUT':
        serializer = PenyakitSerializer(penyakit, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    penyakit.delete()
    return Response({'message': 'Penyakit berhasil dihapus'}, status=204)


# ── GEJALA ────────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def gejala_list(request):
    if request.method == 'GET':
        return Response(GejalaSerializer(Gejala.objects.all(), many=True).data)

    if not request.user.is_authenticated or request.user.role != 'admin':
        return Response({'error': 'Akses ditolak'}, status=403)

    serializer = GejalaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def gejala_detail(request, kode):
    try:
        gejala = Gejala.objects.get(pk=kode)
    except Gejala.DoesNotExist:
        return Response({'error': 'Gejala tidak ditemukan'}, status=404)

    if request.method == 'GET':
        return Response(GejalaSerializer(gejala).data)

    if not request.user.is_authenticated or request.user.role != 'admin':
        return Response({'error': 'Akses ditolak'}, status=403)

    if request.method == 'PUT':
        serializer = GejalaSerializer(gejala, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    gejala.delete()
    return Response({'message': 'Gejala berhasil dihapus'}, status=204)


# ── RELASI ────────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def relasi_list(request):
    data = RelasiSerializer(
        RelasiPenyakitGejala.objects.select_related('id_penyakit', 'kode_gejala').all(),
        many=True
    ).data
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def statistik_penyakit(request):
    """GET /api/pengetahuan/statistik/penyakit/ → penyakit paling sering terdeteksi"""
    data = (
        HasilDiagnosis.objects
        .values('id_penyakit__nama_penyakit')
        .annotate(total=Count('id'))
        .order_by('-total')
    )
    hasil = [
        {
            'nama_penyakit': item['id_penyakit__nama_penyakit'],
            'total': item['total']
        }
        for item in data
    ]
    return Response(hasil)

@api_view(['GET'])
@permission_classes([AllowAny])
def statistik_summary(request):
    """GET /api/pengetahuan/statistik/summary/"""
    from diagnosis.models import Diagnosis
    return Response({
        'total_user':      User.objects.count(),
        'total_diagnosis': Diagnosis.objects.count(),
        'total_penyakit':  Penyakit.objects.count(),
        'total_gejala':    Gejala.objects.count(),
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def statistik_cf_distribusi(request):
    """
    GET /api/pengetahuan/statistik/cf-distribusi/
    Distribusi CF final hasil diagnosis:
    - Rendah    : CF < 0.40
    - Sedang    : 0.40 <= CF < 0.60
    - Tinggi    : 0.60 <= CF < 0.80
    - Sangat Tinggi : CF >= 0.80
    """
    from decimal import Decimal
    hasil = HasilDiagnosis.objects.all()

    distribusi = {'Rendah': 0, 'Sedang': 0, 'Tinggi': 0, 'Sangat Tinggi': 0}
    for h in hasil:
        cf = h.cf_final
        if cf < Decimal('0.40'):
            distribusi['Rendah'] += 1
        elif cf < Decimal('0.60'):
            distribusi['Sedang'] += 1
        elif cf < Decimal('0.80'):
            distribusi['Tinggi'] += 1
        else:
            distribusi['Sangat Tinggi'] += 1

    return Response([
        {'label': k, 'total': v}
        for k, v in distribusi.items()
    ])


@api_view(['GET'])
@permission_classes([AllowAny])
def statistik_gejala(request):
    """GET /api/pengetahuan/statistik/gejala/ — gejala paling sering dipilih"""
    data = (
        DetailDiagnosis.objects
        .values('kode_gejala__nama_gejala')
        .annotate(total=Count('id'))
        .order_by('-total')[:10]  # top 10
    )
    return Response([
        {'nama_gejala': item['kode_gejala__nama_gejala'], 'total': item['total']}
        for item in data
    ])