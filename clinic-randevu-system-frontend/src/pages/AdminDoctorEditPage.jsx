import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminDoctorEditPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [title, setTitle] = useState("");
  const [clinics, setClinics] = useState([]);

  // Klinik listesi
  useEffect(() => {
    axiosInstance
      .get("/api/clinics/list/")
      .then((res) => setClinics(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Mevcut doktor bilgilerini yükle
  useEffect(() => {
    axiosInstance
      .get("/api/appointments/admin/doctors/")
      .then((res) => {
        const doc = res.data.find((d) => d.id === parseInt(doctorId));
        if (doc) {
          setFullName(doc.full_name);
          setEmail(doc.email || "");
          setClinicId(doc.clinic_id || "");
          setTitle(doc.title || "");
        }
      })
      .catch((err) => console.error(err));
  }, [doctorId]);

  // Doktor güncelleme isteği
  const handleUpdate = (e) => {
    e.preventDefault();

    axiosInstance
      .put(`/api/appointments/admin/doctors/${doctorId}/update/`, {
        full_name: fullName,
        email: email,
        clinic_id: clinicId,
        title: title,
      })
      .then(() => {
        alert("Doktor bilgileri güncellendi!");
        navigate("/admin/doctors");
      })
      .catch(() => alert("Güncelleme sırasında bir hata oluştu."));
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Doktor Bilgilerini Düzenle</h1>

      <form onSubmit={handleUpdate} style={{ marginTop: "25px" }}>
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
          Güncelle
        </button>
      </form>

      <button onClick={() => navigate("/admin/doctors")} style={backBtn}>
        ← Listeye Dön
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
  background: "#4caf50",
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
