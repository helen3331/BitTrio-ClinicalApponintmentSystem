
// src/api/api.js içine ekle
const mockPolySymptoms = {
  1: {
    id: 1,
    name: "Kardiyoloji",
    symptoms: [
      "Göğüs ağrısı",
      "Nefes darlığı",
      "Çarpıntı",
      "Bacaklarda ödem",
      "Eforla yorulma",
    ],
  },
  2: {
    id: 2,
    name: "Kulak Burun Boğaz",
    symptoms: [
      "Kulak ağrısı",
      "Burun tıkanıklığı",
      "Boğaz ağrısı",
      "Baş dönmesi",
      "Ateş",
    ],
  },
  // ...
};

export function getPolyclinicSymptomsMock(id) {
  return Promise.resolve(mockPolySymptoms[id]);
}
// src/api/api.js içine ekle
export function mockAiRecommendPolyclinics(symptomText) {
  const text = symptomText.toLowerCase();
  const recs = [];

  if (text.includes("göğüs") || text.includes("çarpıntı")) {
    recs.push({ id: 1, name: "Kardiyoloji" });
  }
  if (text.includes("kulak") || text.includes("burun") || text.includes("boğaz")) {
    recs.push({ id: 2, name: "Kulak Burun Boğaz" });
  }
  if (recs.length === 0) {
    // default öneri
    recs.push({ id: 3, name: "Dahiliye" });
  }

  return Promise.resolve(recs);
}
// src/api/api.js içine ekle


const mockSlotsByDoctor = {
  101: [
    { id: 1001, time: "2025-11-14T10:00" },
    { id: 1002, time: "2025-11-14T10:30" },
  ],
  102: [
    { id: 1003, time: "2025-11-14T11:00" },
  ],
};


export function getSlotsByDoctorMock(doctorId) {
  return Promise.resolve(mockSlotsByDoctor[doctorId] || []);
}

export function mockBookAppointment(slotId) {
  // şimdilik sadece başarı döndürüyoruz
  return Promise.resolve({ success: true });
}
export function mockRegister(data) {
  // data = { isim, soyisim, email, password }
  
  // Basit bir e-posta kontrolü yapalım
  if (data.email === "patient@test.com" || data.email === "doctor@test.com") {
    return Promise.reject(new Error("Bu e-posta adresi zaten kullanılıyor."));
  }
  
  // Başarılı kayıt simülasyonu
  return Promise.resolve({
    success: true,
    user: {
      id: 123, // sahte id
      name: data.isim,
      email: data.email,
      role: 'patient' // Yeni kaydolan herkes 'patient' olsun
    }
  });
}
// src/api/api.js dosyasının en altına ekle:

export function getPatientAppointmentsMock() {
  // Sanki veritabanından hastanın eski randevuları geliyormuş gibi:
  return Promise.resolve([
    { 
      id: 1, 
      polyclinic: "Kardiyoloji", 
      doctor: "Dr. Kardiyo 1", 
      date: "2025-11-20", 
      time: "10:00",
      status: "Aktif" 
    },
    { 
      id: 2, 
      polyclinic: "Kulak Burun Boğaz", 
      doctor: "Dr. KBB 2", 
      date: "2025-12-05", 
      time: "14:30",
      status: "Aktif" 
    }
  ]);
}