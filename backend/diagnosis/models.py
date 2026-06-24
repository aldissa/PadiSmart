from django.conf import settings
from django.db import models
from pengetahuan.models import Penyakit, Gejala

class Diagnosis(models.Model):
    id_diagnosis = models.AutoField(primary_key=True)
    id_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_column='id_user')
    tanggal = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'diagnosis'


class DetailDiagnosis(models.Model):
    id = models.AutoField(primary_key=True)
    id_diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE, db_column='id_diagnosis')
    kode_gejala = models.ForeignKey(Gejala, on_delete=models.CASCADE, db_column='kode_gejala')
    cf_user = models.DecimalField(max_digits=3, decimal_places=2)
    cf_kombinasi = models.DecimalField(max_digits=5, decimal_places=4, null=True, blank=True)

    class Meta:
        db_table = 'detail_diagnosis'


class HasilDiagnosis(models.Model):
    id = models.AutoField(primary_key=True)
    id_diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE, db_column='id_diagnosis')
    id_penyakit = models.ForeignKey(Penyakit, on_delete=models.CASCADE, db_column='id_penyakit')
    cf_final = models.DecimalField(max_digits=5, decimal_places=4)
    ranking = models.IntegerField()

    class Meta:
        db_table = 'hasil_diagnosis'