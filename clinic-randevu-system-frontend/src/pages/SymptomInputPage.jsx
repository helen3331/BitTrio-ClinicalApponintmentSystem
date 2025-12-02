// src/pages/SymptomInputPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function SymptomInputPage() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axiosInstance.post("/api/ai/analyze/", {
        symptoms,
      });

      let aiData = res.data.result;
      
      if (!aiData.clinics || !Array.isArray(aiData.clinics)) {
        throw new Error("Beklenmeyen AI formatı");
      }

      setResult(aiData);

    } catch (err) {
      console.log(err);
      setError("AI analizinde hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClinic = async (clinicName) => {
    try {
      const res = await axiosInstance.post(
        `/api/clinics/from-name/`, { name: clinicName }
      );

      const clinicId = res.data.clinic_id;

      // kullanıcıyı klasik randevu akışına bağla:
      // navigate(`/polyclinics/${clinicId}/check`);
      navigate(`/select-doctor/${clinicId}`);

    } catch (err) {
      console.log(err);
      alert("Bu klinik sistemde henüz bulunmuyor.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Şikayetlerinizi Yazın</h2>

      <form onSubmit={handleAnalyze}>
        <label style={labelStyle}>Semptomlarınızı Yazın</label>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Örn: karın ağrısı, ateş, iştahsızlık..."
          required
          style={textareaStyle}
        />

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Analiz Ediliyor..." : "AI'ya Gönder"}
        </button>
      </form>

      {error && <p style={errorStyle}>{error}</p>}

      {/* AI Sonuç Kartı */}
      {result?.clinics && Array.isArray(result.clinics) && result.clinics.length > 0 && (
        <div style={resultBox}>
          <h2>AI Önerisi</h2>

          {/* Her klinik için kart oluştur */}
          <div style={clinicList}>
            {result.clinics.map((item, index) => (
              <div key={index} style={clinicCard}>
                <p style={{ fontSize: "18px", fontWeight: "600" }}>
                  {item.name}
                </p>

                <p style={{ fontSize: "14px", marginTop: "5px" }}>
                  {item.reason}
                </p>

                <button
                  style={selectBtn}
                  onClick={() => handleSelectClinic(item.name)}
                >
                  Bu Klinikten Randevu Al
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  fontWeight: "600",
};

const textareaStyle = {
  width: "100%",
  height: "140px",
  padding: "12px",
  fontSize: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "8px",
  marginBottom: "20px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#667eea",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "500",
};

const errorStyle = {
  color: "red",
  marginTop: "10px",
};

const resultBox = {
  marginTop: "30px",
  padding: "20px",
  background: "#f8f9fa",
  borderRadius: "12px",
  border: "1px solid #ddd",
};

const clinicList = {
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const clinicCard = {
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  background: "white",
};


const selectBtn = {
  width: "100%",
  marginTop: "10px",
  padding: "10px",
  background: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
};