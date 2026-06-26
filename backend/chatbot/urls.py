from django.urls import path
from . import views

urlpatterns = [
    path('<int:diagnosis_id>/', views.riwayat_chat, name='chatbot-riwayat'),
    path('<int:diagnosis_id>/kirim/', views.kirim_pesan, name='chatbot-kirim'),
]
