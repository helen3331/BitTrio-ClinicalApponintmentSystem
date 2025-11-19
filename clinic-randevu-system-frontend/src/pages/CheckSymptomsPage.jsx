// src/pages/CheckSymptomsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {getPolyclinicSymptoms } from "../api/symptomscheck";

export default function CheckSymptomsPage() {
  const { id } = useParams();
  const [poly, setPoly] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPolyclinicSymptoms((id)).then(setPoly);
  }, [id]);

  if (!poly) return <p>Yükleniyor...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>{poly.name} için tipik şikayetler:</h2>
      <ul>
        {poly.symptoms.map((s, index) => (
          <li key={index}>{s}</li>
        ))}
      </ul>
      <p style={{ marginTop: 10, fontWeight: "bold" }}>
        Bu şikayetlerden en az 3'ü sizde var mı?
      </p>
      <button
        onClick={() => navigate(`/select-doctor/${poly.id}`)}
        style={{ marginRight: 10 }}
      >
        Evet, devam et
      </button>
      <button
        onClick={() => navigate(`/polyclinics/${poly.id}/symptom-input`)}
      >
        Hayır / Emin değilim
      </button>
    </div>
  );
}
