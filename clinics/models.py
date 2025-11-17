from django.db import models

# Create your models here.
class Clinic(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
    
class Symptom(models.Model):
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name="symptoms")
    description = models.CharField(max_length=255)

    class Meta:
        ordering = ["description"]

    def __str__(self):
        return self.description