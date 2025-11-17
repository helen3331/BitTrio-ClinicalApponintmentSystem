// src/pages/SymptomInputPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAiRecommendPolyclinics } from "../api/api";

export default function SymptomInputPage() {
  const [symptoms, setSymptoms] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleAnalyze = () => {
    mockAiRecommendPolyclinics(symptoms).then(setResults);
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Şikayetlerinizi Yazın</h2>
      <textarea
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        rows={5}
        style={{ width: "100%" }}
        placeholder="Örn: Son 2 gündür göğüs ağrım var ve nefes darlığı hissediyorum..."
      />
      <button onClick={handleAnalyze} style={{ marginTop: 10 }}>
        Analiz Et
      </button>

      {results.length > 0 && (
        <>
          <h3>Önerilen poliklinikler:</h3>
          <ul>
            {results.map((r) => (
              <li key={r.id}>
                {r.name}{" "}
                <button onClick={() => navigate(`/select-doctor/${r.id}`)}>
                  Bu poliklinikten randevu al
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
