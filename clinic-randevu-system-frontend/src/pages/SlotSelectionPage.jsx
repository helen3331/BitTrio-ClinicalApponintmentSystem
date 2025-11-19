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
import { useParams, useNavigate } from "react-router-dom"; // useNavigate ekledim
import { getSlot } from "../api/getSlot";
import { bookAppointment } from "../api/getAppointment"; // Yeni fonksiyonumuz

export default function SlotSelectionPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState(""); // Başarı mesajı
  const [error, setError] = useState("");     // Hata mesajı

  useEffect(() => {
    // Slotları çek
    getSlot(doctorId).then(setSlots);
  }, [doctorId]);

  const handleBook = async (slotId) => {
    // Her işlemden önce mesajları temizle
    setMessage("");
    setError("");

    try {
      // API'yi çağır (Doktor ID ve Slot/Schedule ID gönderiyoruz)
      await bookAppointment(doctorId, slotId);
      
      // BAŞARILI OLURSA:
      setMessage("Randevunuz başarıyla oluşturuldu! Yönlendiriliyorsunuz...");
      
      // O slotun butonunu pasif yapabilir veya listeyi yenileyebilirsin.
      // Biz 2 saniye sonra dashboard'a yönlendirelim:
      setTimeout(() => {
         navigate("/patient/dashboard");
      }, 2000);

    } catch (err) {
      // HATA OLURSA (Örn: Slot dolu):
      // Backend serializer'da "Bu slot dolu." mesajını ayarlamıştın, o buraya düşecek.
      setError(err.message || "Bu saat maalesef dolu.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Uygun Saatler</h2>
      
      {/* Mesaj Alanları */}
      {message && <div style={{ padding: "10px", backgroundColor: "#d4edda", color: "#155724", marginBottom: "10px", borderRadius: "5px" }}>{message}</div>}
      {error && <div style={{ padding: "10px", backgroundColor: "#f8d7da", color: "#721c24", marginBottom: "10px", borderRadius: "5px" }}>{error}</div>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {slots.map((s) => (
          <li key={s.id} style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "15px",
            borderBottom: "1px solid #eee",
            marginBottom: "10px",
            backgroundColor: s.is_booked ? "#f9f9f9" : "white" // Doluysa gri yap
          }}>
            
            <div style={{ fontSize: "1.1em", color: s.is_booked ? "#999" : "black" }}>
              📅 <strong>{s.date}</strong> &nbsp; 
              ⏰ <strong>{s.time ? s.time.substring(0, 5) : ""}</strong> 
            </div>

            <button 
              // Eğer slot backend'den zaten "is_booked: true" geldiyse butonu kilitle
              disabled={s.is_booked} 
              onClick={() => handleBook(s.id)}
              style={{
                padding: "8px 15px",
                // Doluysa gri, boşsa yeşil
                backgroundColor: s.is_booked ? "#ccc" : "#28a745", 
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: s.is_booked ? "not-allowed" : "pointer"
              }}
            >
              {s.is_booked ? "Dolu" : "Randevu al"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}