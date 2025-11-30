// src/pages/PatientDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFullName } from "../utils/auth";
import { getMyAppointments } from "../api/appointments";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const fullName = getFullName() || "Kullanıcı";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAppointments()
      .then((data) => {
        setAppointments(data);
      })
      .catch((err) => console.error("Appointment error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      {/* ÜST BİLGİ - Kullanıcı */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        border: '1px solid #ccc', 
        padding: '15px', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        textAlign: 'left',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ margin: 0, color: '#333' }}>{fullName}</h4>        <p style={{ margin: "5px 0 0 0", color: "#666" }}>
          Hasta Profil Sayfası
        </p>
      </div>

      {/* RANDEVU AL BUTONU */}
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Yeni bir randevu mu planlıyorsunuz?</h2>
        <button 
          onClick={() => navigate('/polyclinics')}
          style={{ 
            padding: '15px 40px', 
            fontSize: '18px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '30px', 
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}
          // Basit bir hover efekti için (opsiyonel)
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Randevu Al
        </button>
      </div>

      {/* RANDEVU LİSTESİ */}
      <div>
        <h3 style={{ marginBottom: "15px", color: "#333" }}>Randevularım</h3>

        {loading ? (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fafafa",
              borderRadius: "10px",
              border: "1px solid #eee",
              textAlign: "center",
              color: "#777",
            }}
          >
            Yükleniyor...
          </div>
        ) : appointments.length === 0 ? (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fafafa",
              borderRadius: "10px",
              border: "1px solid #eee",
              textAlign: "center",
              color: "#777",
            }}
          >
            Henüz randevunuz bulunmuyor.
          </div>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              style={{
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "10px",
                border: "1px solid #ddd",
                marginBottom: "15px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              <h4 style={{ margin: 0, color: "#333" }}>{appt.doctor_name}</h4>
              <p style={{ margin: "5px 0", color: "#555" }}>
                {appt.date} • {appt.time}
              </p>
              <p
                style={{
                  margin: 0,
                  marginTop: "10px",
                  padding: "6px 10px",
                  display: "inline-block",
                  borderRadius: "6px",
                  backgroundColor:
                    appt.status === "scheduled" ? "#e3ffe3" : "#ffe3e3",
                  color: appt.status === "scheduled" ? "#128212" : "#b60000",
                  fontSize: "14px",
                }}
              >
                {appt.status === "scheduled" ? "Planlandı" : "İptal Edildi"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}