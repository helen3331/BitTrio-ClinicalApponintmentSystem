import csv
from datetime import date, timedelta, time

from django.contrib.auth import get_user_model
from clinics.models import Clinic, Symptom
from doctors.models import Doctor, Schedule

User = get_user_model()

# =========================================================
#  SLOT AYARLARI — SADECE HAFTA İÇİ
# =========================================================

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
    time(16, 30),
]

# Kaç İŞ GÜNÜ için slot üretilecek (sadece Pazartesi–Cuma)
WORKING_DAY_COUNT = 5


# =========================================================
# 1) KLINIK & SEMPTOM YÜKLEME
# =========================================================
def load_clinics_and_symptoms():
    print("🚀 Klinik & Semptom import süreci başladı...\n")

    csv_path = "data/clinics.csv"

    # --- Klinikler ---
    print("🏥 Klinikler oluşturuluyor...\n")

    clinics_created = 0
    clinic_names = set()

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            clinic_name = row["clinic_name"].strip()
            if clinic_name:
                clinic_names.add(clinic_name)

    for name in clinic_names:
        clinic, created = Clinic.objects.get_or_create(name=name)
        if created:
            print(f"   🆕 Klinik oluşturuldu: {name}")
            clinics_created += 1
        else:
            print(f"   ✔ Klinik zaten var: {name}")

    print(f"\n➡ {len(clinic_names)} klinik bulundu, {clinics_created} yeni klinik oluşturuldu.\n")

    # --- Semptomlar ---
    print("🩺 Semptomlar ekleniyor...\n")

    symptoms_created = 0

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            clinic_name = row["clinic_name"].strip()
            symptom_name = row["symptom"].strip()

            if not clinic_name or not symptom_name:
                continue

            clinic = Clinic.objects.get(name=clinic_name)

            symptom, created = Symptom.objects.get_or_create(
                description=symptom_name,
                clinic=clinic,
            )

            if created:
                print(f"   ➕ {symptom_name} -> {clinic_name}")
                symptoms_created += 1
            else:
                print(f"   ✔ Zaten var: {symptom_name} -> {clinic_name}")

    print(f"\n🎉 {symptoms_created} yeni semptom eklendi.")
    print("✅ Klinik & Semptom import işlemi başarıyla tamamlandı!\n")


# =========================================================
# 2) USER & DOCTOR YÜKLEME
# =========================================================
def load_users_and_doctors():
    print("🚀 Başlangıç: User & Doctor verileri yükleniyor...\n")

    # --- Users ---
    print("📌 Users yükleniyor...")

    with open("data/users.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            email = row["email"].strip()

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": row["username"],
                    "full_name": row["full_name"],
                    "role": row["role"],
                },
            )

            if created:
                user.set_password(row["password"])
                user.save()
                print(f"   🆕 User oluşturuldu: {user.full_name}")
            else:
                print(f"   ✔ User zaten var: {user.full_name}")

    print("\n🎉 Users import tamamlandı.\n")

    # --- Doctors ---
    print("📌 Doctors yükleniyor...")

    with open("data/doctors.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            user_id = row["user_id"]
            clinic_id = row["clinic_id"]
            title = row["title"]

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                print(f"   ❌ User bulunamadı (id={user_id}) — atlanıyor")
                continue

            try:
                clinic = Clinic.objects.get(id=clinic_id)
            except Clinic.DoesNotExist:
                print(f"   ❌ Clinic bulunamadı (id={clinic_id}) — atlanıyor")
                continue

            doctor, created = Doctor.objects.get_or_create(
                user=user,
                defaults={
                    "clinic": clinic,
                    "title": title,
                },
            )

            if created:
                print(f"   🆕 Doctor oluşturuldu: {doctor.user.full_name}")
            else:
                # Klinik veya title değişmişse istersen burada güncelleyebilirsin
                print(f"   ✔ Doctor zaten var: {doctor.user.full_name}")

    print("\n✅ User & Doctor import işlemi tamamlandı!\n")


# =========================================================
# 3) PATIENT (HASTA) YÜKLEME
# =========================================================
def load_patients():
    print("🚀 Hasta (patient) import işlemi başladı...\n")

    csv_path = "data/patients.csv"

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            email = row["email"].strip()

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": row["username"],
                    "full_name": row["full_name"],
                    "role": "patient",
                },
            )

            if created:
                user.set_password(row["password"])
                user.save()
                print(f"   🆕 Hasta oluşturuldu: {user.full_name}")
            else:
                print(f"   ✔ Hasta zaten mevcut: {user.full_name}")

    print("\n✅ Patient import işlemi başarıyla tamamlandı!\n")


# =========================================================
# 4) HAFTA İÇİ SLOT OLUŞTURMA
# =========================================================
def create_weekday_slots():
    doctors = Doctor.objects.all()

    if not doctors.exists():
        print("⚠️ Sistemde doktor bulunamadı! Slot oluşturulamadı.\n")
        return

    print(f"🔍 {doctors.count()} doktor bulundu. Sadece hafta içi slot yüklemeye başlıyorum...\n")

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


# =========================================================
# ANA ÇALIŞTIRMA FONKSİYONU
# (django-extensions runscript ile uyumlu)
# =========================================================
def run():
    """
    Hepsini tek seferde çalıştırmak için:
    python manage.py runscript load_initial_data   (dosya adın neyse)
    """
    load_clinics_and_symptoms()
    load_users_and_doctors()
    load_patients()
    create_weekday_slots()
    print("✅ TÜM BAŞLANGIÇ VERİLERİ VE HAFTA İÇİ SLOTLAR YÜKLENDİ!")
