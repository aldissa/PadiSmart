from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

class TestAuth(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register(self):
        res = self.client.post('/api/auth/register/', {
            'nama': 'Test User',
            'email': 'test@test.com',
            'password': '123456'
        }, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertIn('access', res.data)

    def test_login_berhasil(self):
        # Register dulu
        self.client.post('/api/auth/register/', {
            'nama': 'Test User',
            'email': 'test2@test.com',
            'password': '123456'
        }, format='json')
        # Login
        res = self.client.post('/api/auth/login/', {
            'email': 'test2@test.com',
            'password': '123456'
        }, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertIn('access', res.data)

    def test_login_salah_password(self):
        res = self.client.post('/api/auth/login/', {
            'email': 'tidakada@test.com',
            'password': 'salah'
        }, format='json')
        self.assertEqual(res.status_code, 401)