import os
import django

# Django ayarlarını yükle
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "clinical_backend.settings")
django.setup()

from clinics.models import Clinic, Symptom

# Kliniklere göre semptom listeleri
symptom_data = {
    1: [  # KBB
        "Kulak çınlaması",
        "Kulakta dolgunluk hissi",
        "Baş dönmesi",
        "Burun tıkanıklığı",
        "Boğaz ağrısı",
        "Ses kısıklığı",
        "Geniz akıntısı",
        "Kulak ağrısı",
        "Yutma güçlüğü",
        "Sinüzit belirtileri (yüz ağrısı/basınç)",
    ],
    2: [  # Dahiliye
        "Halsizlik ve yorgunluk",
        "Sürekli mide bulantısı",
        "İştah kaybı",
        "Karın ağrısı",
        "Kilo kaybı",
        "Ateş ve titreme",
        "Nefes darlığı",
        "Çarpıntı",
        "Aşırı susama",
        "Bacaklarda şişlik (ödem)",
    ],
    3: [  # Dermatoloji
        "Kaşıntı",
        "Kırmızı döküntü",
        "Kuruluk ve pullanma",
        "Egzama benzeri lezyonlar",
        "Ciltte kabarcıklar",
        "Güneş hassasiyeti",
        "Saç dökülmesi",
        "Akne (sivilce)",
        "Ciltte ani renk değişimi",
        "Mantar enfeksiyonu (kaşıntı/koku)",
    ],
}

def add_symptoms():
    for clinic_id, symptoms in symptom_data.items():
        try:
            clinic = Clinic.objects.get(id=clinic_id)
        except Clinic.DoesNotExist:
            print(f"Klinik bulunamadı: {clinic_id}")
            continue

        for desc in symptoms:
            Symptom.objects.create(
                clinic=clinic,
                description=desc
            )
            print(f"Eklendi → {clinic.name}: {desc}")

    print("\nTÜM SEMPTOMLAR BAŞARIYLA EKLENDİ 💙🔥")


if __name__ == "__main__":
    add_symptoms()
