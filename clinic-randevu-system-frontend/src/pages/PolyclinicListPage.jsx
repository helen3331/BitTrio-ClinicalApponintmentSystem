// src/pages/PolyclinicListPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPolyclinicsMock } from "../api/api";

export default function PolyclinicListPage() {
  const [polyclinics, setPolyclinics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPolyclinicsMock().then(setPolyclinics);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Poliklinik Seç</h2>
      <ul>
        {polyclinics.map((p) => (
          <li key={p.id} style={{ marginBottom: 10 }}>
            <button onClick={() => navigate(`/polyclinics/${p.id}/check`)}>
              {p.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
