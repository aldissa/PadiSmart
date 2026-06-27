from django.test import TestCase
from rest_framework.test import APIClient
from pengetahuan.models import Penyakit, Gejala

class TestPengetahuan(TestCase):
    def setUp(self):
        self.client = APIClient()
        Penyakit.objects.create(
            id_penyakit=1,
            nama_penyakit='Tungro',
            deskripsi='Penyakit virus',
            penanganan='Cabut tanaman sakit'
        )
        Gejala.objects.create(
            kode_gejala='G001',
            nama_gejala='Daun menguning'
        )

    def test_list_penyakit(self):
        res = self.client.get('/api/pengetahuan/penyakit/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)

    def test_list_gejala(self):
        res = self.client.get('/api/pengetahuan/gejala/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)