export function Login(email, password) {
  // Sadece demo için:
  if (email === "patient@test.com") {
    return Promise.resolve({
      token: "fake-token/  access token",
      role: "patient",
      name: "Test Patient",
    });
  }
  if (email === "doctor@test.com") {
    return Promise.resolve({
      token: "fake-token",
      role: "doctor",
      name: "Dr. Test",
    });
  }
  if (email === "admin@test.com") {
    return Promise.resolve({
      token: "fake-token",
      role: "admin",
      name: "Admin User",
    });
  }
  return Promise.reject(new Error("Invalid credentials"));
}
const mockPolyclinics = [
  { id: 1, name: "Kardiyoloji" },
  { id: 2, name: "Kulak Burun Boğaz" },
  { id: 3, name: "Dermatoloji" },
];

export function getPolyclinicsMock() {
  return Promise.resolve(mockPolyclinics);
}
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
const mockDoctorsByPoly = {
  1: [
    { id: 101, name: "Dr. Kardiyo 1" },
    { id: 102, name: "Dr. Kardiyo 2" },
  ],
  2: [
    { id: 201, name: "Dr. KBB 1" },
    { id: 202, name: "Dr. KBB 2" },
  ],
};

const mockSlotsByDoctor = {
  101: [
    { id: 1001, time: "2025-11-14T10:00" },
    { id: 1002, time: "2025-11-14T10:30" },
  ],
  102: [
    { id: 1003, time: "2025-11-14T11:00" },
  ],
};

export function getDoctorsByPolyclinicMock(polyId) {
  return Promise.resolve(mockDoctorsByPoly[polyId] || []);
}

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