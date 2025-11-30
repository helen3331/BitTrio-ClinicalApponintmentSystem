// // src/pages/SlotSelectionPage.jsx
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {  getAppointment} from "../api/getAppointment";
// import { getSlot } from "../api/getSlot";

// export default function SlotSelectionPage() {
//   const { doctorId } = useParams();
//   const [slots, setSlots] = useState([]);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     getSlot((doctorId)).then(setSlots);
//   }, [doctorId]);

//   const handleBook = () => {
//     getAppointment().then(() => {
//       setMessage("Randevunuz başarıyla alındı (mock).");
//     });
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: "20px auto" }}>
//       <h2>Uygun saatler</h2>
//       <ul>
//         {slots.map((s) => (
//           <li key={s.id}>
//             {new Date(s.time).toLocaleString("tr-TR")}{" "}
//             <button onClick={() => handleBook(s.id)}>Randevu al</button>
//           </li>
//         ))}
//       </ul>
//       {message && <p style={{ color: "green" }}>{message}</p>}
//     </div>
//   );
// }

// src/pages/SlotSelectionPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // useNavigate ekledim
import { getDoctorAvailability } from "../api/clinicslist";
import { createAppointment } from "../api/appointments";

export default function SlotSelectionPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState(""); // Başarı mesajı
  const [error, setError] = useState("");     // Hata mesajı
  const { state } = useLocation();

  useEffect(() => {
    getDoctorAvailability(doctorId).then(setSlots);
  }, [doctorId]);

  const selectSlot = async (slotId) => {
    // Her işlemden önce mesajları temizle
    setMessage("");
    setError("");

    try {
      await createAppointment(doctorId, slotId);
      alert("Randevunuz başarıyla oluşturuldu!");
      navigate("/patient/dashboard");
    } catch (err) {
      // HATA OLURSA (Örn: Slot dolu):
      // Backend serializer'da "Bu slot dolu." mesajını ayarlamıştın, o buraya düşecek.
      setError(err.message || "Bu saat maalesef dolu.");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>{state?.doctorName} – Uygun Saatler</h1>

      {slots.map((slot) => (
        <div
          key={slot.id}
          onClick={() => selectSlot(slot.id)}
          style={{
            padding: 15,
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          {slot.date} – {slot.time}
        </div>
      ))}
    </div>
  );
}