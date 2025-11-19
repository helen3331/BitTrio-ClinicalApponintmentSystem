import csv
from django.contrib.auth import get_user_model

User = get_user_model()


def run():
    print("🚀 Hasta (patient) import işlemi başladı...\n")

    csv_path = "data/patients.csv"

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            email = row["email"].strip()

            # Kullanıcı zaten varsa tekrar oluşturma
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": row["username"],
                    "full_name": row["full_name"],
                    "role": "patient",
                }
            )

            if created:
                user.set_password(row["password"])
                user.save()
                print(f"   🆕 Hasta oluşturuldu: {user.full_name}")
            else:
                print(f"   ✔ Hasta zaten mevcut: {user.full_name}")

    print("\n✅ Patient import işlemi başarıyla tamamlandı!")
