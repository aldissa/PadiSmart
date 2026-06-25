from django.contrib import admin
from .models import Penyakit, Gejala, RelasiPenyakitGejala

@admin.register(Penyakit)
class PenyakitAdmin(admin.ModelAdmin):
    list_display = ['id_penyakit', 'nama_penyakit']
    search_fields = ['nama_penyakit']

@admin.register(Gejala)
class GejalaAdmin(admin.ModelAdmin):
    list_display = ['kode_gejala', 'nama_gejala']
    search_fields = ['kode_gejala', 'nama_gejala']

@admin.register(RelasiPenyakitGejala)
class RelasiAdmin(admin.ModelAdmin):
    list_display = ['id', 'id_penyakit', 'kode_gejala', 'mb', 'md', 'cf_pakar']
    list_filter = ['id_penyakit']