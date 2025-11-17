from django.contrib import admin
from .models import Clinic, Symptom

# Register your models here.
admin.site.register(Clinic)
admin.site.register(Symptom)