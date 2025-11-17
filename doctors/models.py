from django.db import models
from accounts.models import User
from clinics.models import Clinic

# Create your models here.
class Doctor(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="doctor_profile"
    )

    clinic = models.ForeignKey(
        Clinic,
        on_delete=models.CASCADE,
        related_name="doctors"
    )

    # Örn: "Uzm. Dr.", "Prof. Dr.", "Op. Dr."
    title = models.CharField(max_length=100, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        name = self.user.full_name or self.user.email
        title = f"{self.title} " if self.title else ""
        return f"{title}{name}"

class Schedule(models.Model):
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name="schedules"
    )
    date = models.DateField()
    time = models.TimeField()
    is_booked = models.BooleanField(default=False)  # slot boş mu dolu mu?

    class Meta:
        unique_together = ('doctor', 'date', 'time')   # ÇAKIŞMA ÖNLENİR
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.doctor} - {self.date} {self.time}"