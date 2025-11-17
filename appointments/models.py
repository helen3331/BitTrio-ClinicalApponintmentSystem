from django.db import models
from accounts.models import User
from doctors.models import Doctor, Schedule

# Create your models here.
class Appointment(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('cancelled', 'Cancelled'),
    ]

    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    # Slot → One-to-One
    schedule = models.OneToOneField(
        Schedule,
        on_delete=models.CASCADE,
        related_name="appointment"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        patient_name = self.patient.full_name or self.patient.email
        doctor_name = self.doctor.user.full_name or self.doctor.user.email
        return f"{patient_name} → {doctor_name} ({self.schedule.date} {self.schedule.time})"