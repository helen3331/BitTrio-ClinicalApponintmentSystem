import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function AdminDoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  // Doktorları yükle
  const loadDoctors = () => {
    axiosInstance.get("/api/appointments/admin/doctors/")
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // Doktor silme
  const deleteDoctor = (id) => {
    if (!window.confirm("Bu doktoru silmek istediğine emin misin?")) return;

    axiosInstance.delete(`/api/appointments/admin/doctors/${id}/delete/`)
      .then(() => {
        alert("Doktor silindi!");
        loadDoctors();
      })
      .catch(() => alert("Silme işleminde hata oluştu."));
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Doktor Yönetimi</h1>

      <button
        onClick={() => navigate("/admin/doctors/create")}
        style={buttonStyle}
      >
        + Yeni Doktor Ekle
      </button>

      <div style={{ marginTop: 30 }}>
        {doctors.length === 0 ? (
          <p>Henüz doktor kaydı yok.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Doktor Adı</th>
                <th>Klinik</th>
                <th>Ünvan</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.id}</td>
                  <td>{doc.full_name}</td>
                  <td>{doc.clinic_name}</td>
                  <td>{doc.title || "-"}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/doctors/${doc.id}/edit`)}
                      style={editBtn}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => deleteDoctor(doc.id)}
                      style={deleteBtn}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "12px 15px",
  background: "#667eea",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500",
  marginBottom: "15px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const editBtn = {
  padding: "6px 10px",
  background: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  marginRight: "10px",
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 10px",
  background: "#e63946",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
