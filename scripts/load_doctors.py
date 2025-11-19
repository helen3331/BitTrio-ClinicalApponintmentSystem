import csv
from django.contrib.auth import get_user_model
from clinics.models import Clinic
from doctors.models import Doctor
User = get_user_model()


def run():
    print("🚀 Başlangıç: User & Doctor verileri yükleniyor...\n")

    # === USERS CSV YÜKLEME ===
    print("📌 Users yükleniyor...")

    with open("data/users.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            email = row["email"].strip()

            # Kullanıcı zaten varsa oluşturma
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": row["username"],
                    "full_name": row["full_name"],
                    "role": row["role"],
                }
            )

            # Şifreyi hashle (plaintext değil)
            if created:
                user.set_password(row["password"])
                user.save()
                print(f"   🆕 User oluşturuldu: {user.full_name}")
            else:
                print(f"   ✔ User zaten var: {user.full_name}")

    print("\n🎉 Users import tamamlandı.\n")

    # === DOCTORS CSV YÜKLEME ===
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

            # Doktor profili zaten varsa oluşturma
            doctor, created = Doctor.objects.get_or_create(
                user=user,
                defaults={
                    "clinic": clinic,
                    "title": title
                }
            )

            if created:
                print(f"   🆕 Doctor oluşturuldu: {doctor.user.full_name}")
            else:
                print(f"   ✔ Doctor zaten var: {doctor.user.full_name}")

    print("\n✅ TÜM VERİ BAŞARIYLA YÜKLENDİ!")