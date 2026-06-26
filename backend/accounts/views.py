from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate

from .serializers import RegisterSerializer, UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """POST /api/auth/register/"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user':    UserSerializer(user).data,
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """POST /api/auth/login/"""
    email    = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email dan password wajib diisi'}, status=400)

    user = authenticate(request, email=email, password=password)
    if user is None:
        return Response({'error': 'Email atau password salah'}, status=401)

    refresh = RefreshToken.for_user(user)
    return Response({
        'user':    UserSerializer(user).data,
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """POST /api/auth/logout/  — blacklist refresh token"""
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logout berhasil'})
    except Exception:
        return Response({'error': 'Token tidak valid'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """GET /api/auth/me/  — data user yang sedang login"""
    return Response(UserSerializer(request.user).data)
