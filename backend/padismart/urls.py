from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # API v1
    path('api/auth/',        include('accounts.urls')),
    path('api/pengetahuan/', include('pengetahuan.urls')),
    path('api/diagnosis/',   include('diagnosis.urls')),
    path('api/chatbot/',     include('chatbot.urls')),
]
