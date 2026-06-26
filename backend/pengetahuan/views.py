from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Penyakit, Gejala, RelasiPenyakitGejala
from .serializers import PenyakitSerializer, GejalaSerializer, RelasiSerializer


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