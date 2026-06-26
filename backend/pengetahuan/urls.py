from django.urls import path
from . import views

urlpatterns = [
    path('penyakit/',        views.penyakit_list,   name='penyakit-list'),
    path('penyakit/<int:pk>/', views.penyakit_detail, name='penyakit-detail'),
    path('gejala/',          views.gejala_list,     name='gejala-list'),
    path('gejala/<str:kode>/', views.gejala_detail,  name='gejala-detail'),
    path('relasi/',          views.relasi_list,     name='relasi-list'),
]
