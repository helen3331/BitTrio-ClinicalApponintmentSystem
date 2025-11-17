// src/pages/SlotSelectionPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSlotsByDoctorMock, mockBookAppointment } from "../api/api";

export default function SlotSelectionPage() {
  const { doctorId } = useParams();
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSlotsByDoctorMock(Number(doctorId)).then(setSlots);
  }, [doctorId]);

  const handleBook = (slotId) => {
    mockBookAppointment(slotId).then(() => {
      setMessage("Randevunuz başarıyla alındı (mock).");
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Uygun saatler</h2>
      <ul>
        {slots.map((s) => (
          <li key={s.id}>
            {new Date(s.time).toLocaleString("tr-TR")}{" "}
            <button onClick={() => handleBook(s.id)}>Randevu al</button>
          </li>
        ))}
      </ul>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}
