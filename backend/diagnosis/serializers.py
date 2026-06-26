from rest_framework import serializers
from .models import Diagnosis, DetailDiagnosis, HasilDiagnosis
from pengetahuan.serializers import PenyakitSerializer


class DetailDiagnosisSerializer(serializers.ModelSerializer):
    nama_gejala = serializers.CharField(source='kode_gejala.nama_gejala', read_only=True)

    class Meta:
        model  = DetailDiagnosis
        fields = ['id', 'kode_gejala', 'nama_gejala', 'cf_user', 'cf_kombinasi']


class HasilDiagnosisSerializer(serializers.ModelSerializer):
    penyakit = PenyakitSerializer(source='id_penyakit', read_only=True)

    class Meta:
        model  = HasilDiagnosis
        fields = ['id', 'penyakit', 'cf_final', 'ranking']


class DiagnosisSerializer(serializers.ModelSerializer):
    detail = DetailDiagnosisSerializer(many=True, read_only=True, source='detaildiagnosis_set')
    hasil  = HasilDiagnosisSerializer(many=True, read_only=True, source='hasildiagnosis_set')

    class Meta:
        model  = Diagnosis
        fields = ['id_diagnosis', 'tanggal', 'detail', 'hasil']
