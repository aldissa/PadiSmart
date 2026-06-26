from django.urls import path
from . import views

urlpatterns = [
    path('submit/',        views.submit_diagnosis, name='diagnosis-submit'),
    path('riwayat/',       views.riwayat_diagnosis, name='diagnosis-riwayat'),
    path('<int:pk>/',      views.detail_diagnosis,  name='diagnosis-detail'),
]
