from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = (
        ("patient", "Patient"),
        ("doctor", "Doctor"),
        ("admin", "Administrator"),
    )
    
    email = models.CharField(max_length=255, unique=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = "email"          # Kullanıcı email ile giriş yapacak
    REQUIRED_FIELDS = ["username"]    # username yine zorunlu olsun (opsiyonel)
    
    def __str__(self):
        return self.full_name or self.email