from rest_framework import serializers
from .models import Penyakit, Gejala, RelasiPenyakitGejala


class PenyakitSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Penyakit
        fields = ['id_penyakit', 'nama_penyakit', 'deskripsi', 'penanganan']


class GejalaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Gejala
        fields = ['kode_gejala', 'nama_gejala']


class RelasiSerializer(serializers.ModelSerializer):
    nama_penyakit = serializers.CharField(source='id_penyakit.nama_penyakit', read_only=True)
    nama_gejala   = serializers.CharField(source='kode_gejala.nama_gejala',   read_only=True)

    class Meta:
        model  = RelasiPenyakitGejala
        fields = ['id', 'id_penyakit', 'nama_penyakit', 'kode_gejala', 'nama_gejala', 'mb', 'md', 'cf_pakar']
