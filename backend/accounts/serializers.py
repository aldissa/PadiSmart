from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model  = User
        fields = ['nama', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            nama=validated_data['nama'],
            password=validated_data['password'],
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id_user', 'nama', 'email', 'role']
