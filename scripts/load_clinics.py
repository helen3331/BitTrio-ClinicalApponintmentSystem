import csv
from clinics.models import Clinic, Symptom


def run():
    print("🚀 Klinik & Semptom import süreci başladı...\n")

    csv_path = "data/clinics.csv"

    # =========================================================
    #  1) AŞAMA — KLINIKLERİ OLUŞTUR (TEKRAR YOK)
    # =========================================================
    print("🏥 Klinikler oluşturuluyor...\n")

    clinics_created = 0
    clinic_names = set()

    # CSV'deki tüm klinik isimlerini tek tek topla
    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            clinic_name = row["clinic_name"].strip()
            if clinic_name:
                clinic_names.add(clinic_name)

    # Klinikleri oluştur
    for name in clinic_names:
        clinic, created = Clinic.objects.get_or_create(name=name)
        if created:
            print(f"   🆕 Klinik oluşturuldu: {name}")
            clinics_created += 1
        else:
            print(f"   ✔ Klinik zaten var: {name}")

    print(f"\n➡ {len(clinic_names)} klinik bulundu, {clinics_created} yeni klinik oluşturuldu.\n")

    # =========================================================
    #  2) AŞAMA — SEMPTOMLARI EKLE
    # =========================================================
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
                clinic=clinic
            )

            if created:
                print(f"   ➕ {symptom_name} -> {clinic_name}")
                symptoms_created += 1
            else:
                print(f"   ✔ Zaten var: {symptom_name} -> {clinic_name}")

    print(f"\n🎉 {symptoms_created} yeni semptom eklendi.")
    print("✅ Klinik & Semptom import işlemi başarıyla tamamlandı!")