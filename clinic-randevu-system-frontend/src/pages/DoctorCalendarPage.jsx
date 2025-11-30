import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { getFullName } from "../utils/auth";

export default function DoctorCalendarPage() {
  const doctorName = getFullName();

  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Randevuları çek
  useEffect(() => {
    axiosInstance
      .get("/api/appointments/doctor/")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Bir ayın takvimini üret
  const generateCalendar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay(); // pazarı 0 sayar
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendar = [];
    let week = [];

    // Boş kutucuklar (ayın 1’i pazartesi değilse)
    for (let i = 0; i < (firstWeekday === 0 ? 6 : firstWeekday - 1); i++) {
      week.push("");
    }

    // Günleri ekle
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    if (week.length > 0) calendar.push(week);

    return calendar;
  };

  // Seçilen günün randevularını filtrele
  const todaysAppointments = appointments.filter((appt) =>
    appt.appointment_time.startsWith(selectedDate)
  );

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Doktor Bilgisi */}
      <div
        style={{
          background: "#eef2ff",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
          border: "1px solid #dbe0ff",
        }}
      >
        <h2 style={{ margin: 0 }}>{doctorName}</h2>
        <p style={{ margin: "5px 0 0 0", color: "#666" }}>Takvim Görünümü</p>
      </div>

      {/* Takvim */}
      <h3 style={{ marginBottom: "15px" }}>Aylık Takvim</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontWeight: "600",
              color: "#555",
            }}
          >
            {d}
          </div>
        ))}

        {generateCalendar().map((week, wi) =>
          week.map((day, di) => {
            if (day === "") {
              return <div key={wi + "-" + di}></div>;
            }

            const dateStr = `2025-${String(
              new Date().getMonth() + 1
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            return (
              <div
                key={wi + "-" + di}
                onClick={() => setSelectedDate(dateStr)}
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                  cursor: "pointer",
                  background:
                    dateStr === selectedDate
                      ? "#667eea"
                      : dateStr === todayStr
                      ? "#dfe3ff"
                      : "white",
                  color: dateStr === selectedDate ? "white" : "#333",
                  fontWeight: "500",
                }}
              >
                {day}
              </div>
            );
          })
        )}
      </div>

      {/* Randevu Listesi */}
      <h3>
        {selectedDate} Tarihli Randevular ({todaysAppointments.length})
      </h3>

      {todaysAppointments.length === 0 ? (
        <div
          style={{
            padding: "15px",
            background: "#fafafa",
            borderRadius: "10px",
            border: "1px solid #ddd",
            color: "#777",
          }}
        >
          Bu tarihte randevu yok.
        </div>
      ) : (
        todaysAppointments.map((appt) => (
          <div
            key={appt.id}
            style={{
              padding: "15px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              background: "white",
            }}
          >
            <strong>Hasta:</strong> {appt.patient_name} <br />
            <strong>Klinik:</strong> {appt.clinic_name} <br />
            <strong>Saat:</strong> {appt.appappointment_time}
            <div
              style={{
                marginTop: "10px",
                display: "inline-block",
                padding: "5px 10px",
                background:
                  appt.status === "scheduled" ? "#e3ffe3" : "#ffe3e3",
                borderRadius: "6px",
                color: appt.status === "scheduled" ? "#1a7a1a" : "#b00000",
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
