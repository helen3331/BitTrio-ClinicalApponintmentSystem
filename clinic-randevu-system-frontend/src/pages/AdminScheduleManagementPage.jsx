import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function AdminScheduleManagementPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [schedules, setSchedules] = useState([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Doktor listesini çek
  useEffect(() => {
    axiosInstance
      .get("/api/appointments/admin/doctors/")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Bir doktor seçildiğinde çalışma saatlerini çek
  const loadSchedules = (doctorId) => {
    axiosInstance
      .get(`/api/appointments/admin/schedules/${doctorId}/`)
      .then((res) => setSchedules(res.data))
      .catch((err) => console.error(err));
  };

  const handleDoctorChange = (e) => {
    const id = e.target.value;
    setSelectedDoctorId(id);
    if (id) {
      loadSchedules(id);
    } else {
      setSchedules([]);
    }
  };

  // Yeni slot ekleme
  const addSchedule = (e) => {
    e.preventDefault();

    axiosInstance
      .post(`/api/appointments/admin/schedules/${selectedDoctorId}/create/`, {
        date,
        time,
      })
      .then(() => {
        alert("Yeni çalışma saati eklendi!");
        loadSchedules(selectedDoctorId);
      })
      .catch(() => alert("Ekleme sırasında hata oluştu."));
  };

  // Slot silme
  const deleteSchedule = (id) => {
    if (!window.confirm("Bu çalışma saatini silmek istiyor musun?")) return;

    axiosInstance
      .delete(`/api/appointments/admin/schedules/${id}/delete/`)
      .then(() => {
        alert("Çalışma saati silindi.");
        loadSchedules(selectedDoctorId);
      })
      .catch(() => alert("Silme işlemi sırasında hata oluştu."));
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Doktor Çalışma Saatleri Yönetimi</h1>

      {/* Doktor seçme */}
      <label>Doktor Seçin</label>
      <select
        value={selectedDoctorId}
        onChange={handleDoctorChange}
        style={selectStyle}
      >
        <option value="">Seçiniz</option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.full_name} — {doc.clinic_name}
          </option>
        ))}
      </select>

      {/* Doktor seçili değilse */}
      {!selectedDoctorId && (
        <p style={{ marginTop: "20px", color: "#777" }}>
          Bir doktor seçiniz.
        </p>
      )}

      {/* Doktor seçildiyse çalışma saatleri listesi */}
      {selectedDoctorId && (
        <div style={{ marginTop: "30px", display: "flex", gap: "40px" }}>
          {/* Sol taraf: Slot listesi */}
          <div style={{ flex: 2 }}>
            <h2>Çalışma Saatleri</h2>

            {schedules.length === 0 ? (
              <p>Bu doktora ait çalışma saati yok.</p>
            ) : (
              schedules.map((s) => (
                <div key={s.id} style={slotItem}>
                  <strong>{s.date}</strong> — {s.time}
                  <button
                    onClick={() => deleteSchedule(s.id)}
                    style={deleteBtn}
                  >
                    Sil
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Sağ taraf: Yeni Slot Ekleme Formu */}
          <div style={{ flex: 1 }}>
            <h2>Yeni Çalışma Saati Ekle</h2>
            <form onSubmit={addSchedule}>
              <label>Tarih</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={inputStyle}
              />

              <label>Saat</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                style={inputStyle}
              />

              <button type="submit" style={addBtn}>
                Ekle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "25px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const slotItem = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const deleteBtn = {
  background: "#e63946",
  color: "white",
  padding: "6px 10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "8px",
  marginBottom: "20px",
};

const addBtn = {
  padding: "12px",
  width: "100%",
  background: "#4caf50",
  color: "white",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};
