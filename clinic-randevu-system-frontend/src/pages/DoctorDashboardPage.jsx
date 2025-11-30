import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { getFullName } from "../utils/auth";

export default function DoctorDashboardPage() {
  const doctorName = getFullName();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/api/appointments/doctor/")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Bugünün tarihi
  const today = new Date().toISOString().split("T")[0];

  // Bugünkü randevular
  const todaysAppointments = appointments.filter((appt) =>
    appt.appointment_time.startsWith(today)
  );

  // Gelecek randevular
  const futureAppointments = appointments.filter(
    (appt) => appt.appointment_time > today
  );

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Doktor Bilgisi */}
      <div
        style={{
          padding: "20px",
          background: "#eef2ff",
          borderRadius: "10px",
          border: "1px solid #d8dfff",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ margin: 0 }}>{doctorName}</h2>
        <p style={{ margin: "5px 0 0 0", color: "#666" }}>
          Doktor Kontrol Paneli
        </p>
      </div>

      {/* Bugünkü Randevular */}
      <h3 style={{ marginBottom: "15px" }}>Bugünkü Randevular</h3>

      {todaysAppointments.length === 0 ? (
        <div
          style={{
            padding: "15px",
            background: "#fafafa",
            borderRadius: "10px",
            border: "1px solid #ddd",
            color: "#777",
            marginBottom: "30px",
          }}
        >
          Bugün için randevunuz bulunmamaktadır.
        </div>
      ) : (
        todaysAppointments.map((appt) => (
          <div
            key={appt.appointment_id}
            style={{
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              marginBottom: "15px",
              background: "white",
            }}
          >
            <strong>Hasta:</strong> {appt.patient_name} <br />
            <strong>Klinik:</strong> {appt.clinic_name} <br />
            <strong>Saat:</strong> {appt.appointment_time}
            <div
              style={{
                marginTop: "10px",
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: "6px",
                background:
                  appt.status === "scheduled" ? "#e3ffe3" : "#ffe3e3",
                color: appt.status === "scheduled" ? "#137a13" : "#b00000",
                fontSize: "14px",
              }}
            >
              {appt.status === "scheduled" ? "Planlandı" : "İptal Edildi"}
            </div>
          </div>
        ))
      )}

      {/* Gelecek Randevular */}
      <h3 style={{ margin: "30px 0 15px 0" }}>Gelecek Randevular</h3>

      {futureAppointments.length === 0 ? (
        <div
          style={{
            padding: "15px",
            background: "#fafafa",
            borderRadius: "10px",
            border: "1px solid #ddd",
            color: "#777",
          }}
        >
          Yaklaşan randevunuz bulunmamaktadır.
        </div>
      ) : (
        futureAppointments.map((appt) => (
          <div
            key={appt.appointment_id}
            style={{
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              marginBottom: "15px",
              background: "white",
            }}
          >
            <strong>Hasta:</strong> {appt.patient_name} <br />
            <strong>Klinik:</strong> {appt.clinic_name} <br />
            <strong>Tarih:</strong> {appt.appointment_time.split("T")[0]} <br />
            <strong>Saat:</strong> {appt.appointment_time.split("T")[1]} <br />
            <div
              style={{
                marginTop: "10px",
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: "6px",
                background:
                  appt.status === "scheduled" ? "#e3ffe3" : "#ffe3e3",
                color: appt.status === "scheduled" ? "#137a13" : "#b00000",
                fontSize: "14px",
              }}
            >
              {appt.status === "scheduled" ? "Planlandı" : "İptal Edildi"}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
