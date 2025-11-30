import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function AdminDoctorCreatePage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [title, setTitle] = useState("");
  const [clinics, setClinics] = useState([]);

  // Klinik listesi çek
  useEffect(() => {
    axiosInstance
      .get("/api/clinics/list/")
      .then((res) => setClinics(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Doktor oluşturma fonksiyonu
  const handleCreateDoctor = (e) => {
    e.preventDefault();

    axiosInstance
      .post("/api/appointments/admin/doctors/create/", {
        full_name: fullName,
        email: email,
        clinic_id: clinicId,
        title: title,
      })
      .then(() => {
        alert("Doktor başarıyla oluşturuldu!");
        navigate("/admin/doctors");
      })
      .catch(() => alert("Doktor oluşturulurken bir hata oluştu."));
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Yeni Doktor Ekle</h1>

      <form onSubmit={handleCreateDoctor} style={{ marginTop: "25px" }}>
        <label>Doktor Adı Soyadı</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Klinik</label>
        <select
          value={clinicId}
          onChange={(e) => setClinicId(e.target.value)}
          required
          style={inputStyle}
        >
          <option value="">Seçiniz</option>
          {clinics.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Ünvan</label>
        <input
          type="text"
          value={title}
          placeholder="Uzm. Dr., Prof. Dr. vb."
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={submitBtn}>
          Doktoru Oluştur
        </button>
      </form>

      <button
        onClick={() => navigate("/admin/doctors")}
        style={backBtn}
      >
        ← Geri Dön
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  marginBottom: "20px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const submitBtn = {
  width: "100%",
  padding: "12px",
  background: "#667eea",
  color: "white",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "500",
};

const backBtn = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  background: "#ddd",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
};
