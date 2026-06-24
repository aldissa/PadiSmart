from django.db import models

class Penyakit(models.Model):
    id_penyakit = models.AutoField(primary_key=True)
    nama_penyakit = models.CharField(max_length=100)
    deskripsi = models.TextField(blank=True, null=True)
    penanganan = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'penyakit'

    def __str__(self):
        return self.nama_penyakit


class Gejala(models.Model):
    kode_gejala = models.CharField(max_length=10, primary_key=True)
    nama_gejala = models.CharField(max_length=255)

    class Meta:
        db_table = 'gejala'

    def __str__(self):
        return f"{self.kode_gejala} - {self.nama_gejala}"


class RelasiPenyakitGejala(models.Model):
    id = models.AutoField(primary_key=True)
    id_penyakit = models.ForeignKey(Penyakit, on_delete=models.CASCADE, db_column='id_penyakit')
    kode_gejala = models.ForeignKey(Gejala, on_delete=models.CASCADE, db_column='kode_gejala')
    mb = models.DecimalField(max_digits=3, decimal_places=2)
    md = models.DecimalField(max_digits=3, decimal_places=2)
    cf_pakar = models.DecimalField(max_digits=3, decimal_places=2)

    class Meta:
        db_table = 'relasi_penyakit_gejala'