import os
import django
from datetime import date, timedelta, time

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "clinical_backend.settings")
django.setup()

from doctors.models import Doctor, Schedule

# OLUŞTURULACAK SLOT SAATLERİ
SLOT_TIMES = [
    time(9, 0),
    time(9, 30),
    time(10, 0),
    time(10, 30),
    time(11, 0),
    time(11, 30),
    time(13, 0),
    time(13, 30),
    time(14, 0),
    time(14, 30),
    time(15, 0),
    time(15, 30),
    time(16, 0),
    time(16, 30)
]

# KAÇ GÜN İÇİN OLUŞTURULACAK
WORKING_DAY_COUNT = 5

def run():
    doctors = Doctor.objects.all()

    if not doctors.exists():
        print("⚠️ Sistemde doktor bulunamadı!")
        return

    print(f"🔍 {len(doctors)} doktor bulundu. Slot yüklemeye başlıyorum...\n")

    for doctor in doctors:
        print(f"👨‍⚕️ Doktor: {doctor.user.full_name} ({doctor.title})")

        working_days_created = 0
        current_date = date.today()

        # WORKING_DAY_COUNT kadar iş günü bulana kadar ilerle
        while working_days_created < WORKING_DAY_COUNT:
            # weekday() -> 0: Pazartesi, 4: Cuma, 5-6: Hafta sonu
            if current_date.weekday() < 5:  # Pazartesi–Cuma
                for slot_time in SLOT_TIMES:
                    # Aynı slotu tekrar tekrar oluşturmamak için get_or_create
                    schedule, created = Schedule.objects.get_or_create(
                        doctor=doctor,
                        date=current_date,
                        time=slot_time,
                        defaults={"is_booked": False},
                    )
                    if created:
                        print(f"   ➤ Slot eklendi: {current_date} {slot_time}")
                    else:
                        print(f"   ✔ Slot zaten var: {current_date} {slot_time}")

                working_days_created += 1

            current_date += timedelta(days=1)

        print("✔ Doktor için tüm hafta içi slotlar oluşturuldu.\n")

    print("\n🎉 TÜM SLOTLAR BAŞARIYLA OLUŞTURULDU ESRA! 💙🔥")



