// src/pages/DoctorListPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../api/config";

export default function DoctorListPage() {
  const { polyId } = useParams(); 
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (polyId) {
      fetch(`${API_URL}/doctors/${polyId}/`)
        .then((res) => {
           if (!res.ok) throw new Error("API Hatası");
           return res.json();
        })
        .then((data) => setDoctors(data))
        .catch(err => console.error("Hata:", err));
    }
  }, [polyId]);

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Doktor Seç</h2>
      
      {doctors.length === 0 && <p>Yükleniyor veya doktor bulunamadı...</p>}

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {doctors.map((d) => (
          <li key={d.id} style={{ 
            marginBottom: "15px", 
            padding: "15px", 
            border: "1px solid #e0e0e0", 
            borderRadius: "8px",
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            
            {/* --- DOKTOR BİLGİLERİ KISMI --- */}
            <div>
               {/* Ünvan ve İsim */}
               <div style={{ fontWeight: "bold", fontSize: "1.1em", color: "#333" }}>
                 {d.title} {d.full_name}
               </div>
               {/* Altına Poliklinik Adı (Opsiyonel ama şık durur) */}
               <div style={{ fontSize: "0.9em", color: "#666" }}>
                 {d.clinic_name} Kliniği
               </div>
            </div>
            {/* ------------------------------ */}

            <button 
                onClick={() => navigate(`/select-slot/${d.id}`)}
                style={{ 
                  padding: "8px 16px", 
                  backgroundColor: "#007bff", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "5px", 
                  cursor: "pointer" 
                }}
            >
              Saat Seç
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}