from django.db import models
from accounts.models import User
from clinics.models import Clinic
from datetime import time

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
    

class WorkingDay(models.Model):
    """
    Doktorun haftanın hangi günleri hangi saat aralığında çalışacağını tanımlar.
    """
    WEEKDAYS = (
        (0, "Monday"),
        (1, "Tuesday"),
        (2, "Wednesday"),
        (3, "Thursday"),
        (4, "Friday"),
        (5, "Saturday"),
        (6, "Sunday"),
    )

    doctor = models.ForeignKey("Doctor", on_delete=models.CASCADE, related_name="working_days")
    weekday = models.IntegerField(choices=WEEKDAYS)
    start_time = models.TimeField(default=time(9, 0))
    end_time = models.TimeField(default=time(17, 0))
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("doctor", "weekday")
        ordering = ["doctor", "weekday"]

    def __str__(self):
        return f"{self.doctor} - {self.get_weekday_display()} {self.start_time}-{self.end_time}"


class DoctorHoliday(models.Model):
    """
    Doktorun izin/tatil günleri – o güne slot açılmayacak,
    varsa boşta olan slotlar iptal edilebilir.
    """
    doctor = models.ForeignKey("Doctor", on_delete=models.CASCADE, related_name="holidays")
    date = models.DateField()
    reason = models.CharField(max_length=200, blank=True)

    class Meta:
        unique_together = ("doctor", "date")
        ordering = ["doctor", "date"]

    def __str__(self):
        return f"{self.doctor} - {self.date} ({self.reason})"