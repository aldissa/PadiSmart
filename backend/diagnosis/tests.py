# tests.py di app diagnosis
from django.test import TestCase
from decimal import Decimal
from diagnosis.views import hitung_cf_kombinasi, gabung_cf

class TestCF(TestCase):
    def test_hitung_cf_kombinasi(self):
        # CF kombinasi = (MB - MD) * CF_user
        result = hitung_cf_kombinasi(Decimal('0.8'), Decimal('0.2'), Decimal('0.6'))
        self.assertAlmostEqual(float(result), 0.36, places=4)

    def test_gabung_cf(self):
        # CF gabungan = CF1 + CF2 * (1 - CF1)
        result = gabung_cf(Decimal('0.5'), Decimal('0.4'))
        self.assertAlmostEqual(float(result), 0.7, places=4)

    def test_cf_kombinasi_nol(self):
        # CF user 0 = tidak yakin sama sekali
        result = hitung_cf_kombinasi(Decimal('0.9'), Decimal('0.1'), Decimal('0.0'))
        self.assertEqual(float(result), 0.0)