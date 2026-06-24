from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, nama, password=None, role='user'):
        if not email:
            raise ValueError('Email wajib diisi')
        user = self.model(email=self.normalize_email(email), nama=nama, role=role)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nama, password=None):
        user = self.create_user(email, nama, password, role='admin')
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    id_user = models.AutoField(primary_key=True)
    nama = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    role = models.CharField(max_length=20, default='user')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nama']

    class Meta:
        db_table = 'user'

    def __str__(self):
        return self.nama