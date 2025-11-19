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
DAY_COUNT = 5

def run():
    doctors = Doctor.objects.all()

    if not doctors.exists():
        print("⚠️ Sistemde doktor bulunamadı!")
        return

    print(f"🔍 {len(doctors)} doktor bulundu. Slot yüklemeye başlıyorum...\n")

    for doctor in doctors:
        print(f"👨‍⚕️ Doktor: {doctor.user.full_name} ({doctor.title})")

        for day in range(DAY_COUNT):
            slot_date = date.today() + timedelta(days=day)

            for slot_time in SLOT_TIMES:
                Schedule.objects.create(
                    doctor=doctor,
                    date=slot_date,
                    time=slot_time,
                    is_booked=False
                )

                print(f"   ➤ Slot eklendi: {slot_date} {slot_time}")

        print("✔ Doktor için tüm slotlar oluşturuldu.\n")

    print("\n🎉 TÜM SLOTLAR BAŞARIYLA OLUŞTURULDU ESRA! 💙🔥")



