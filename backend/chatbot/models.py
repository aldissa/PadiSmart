from django.db import models
from diagnosis.models import Diagnosis

class RiwayatChat(models.Model):
    id_chat = models.AutoField(primary_key=True)
    id_diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE, db_column='id_diagnosis')
    pertanyaan = models.TextField()
    jawaban = models.TextField(null=True, blank=True)
    waktu = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'riwayat_chat'