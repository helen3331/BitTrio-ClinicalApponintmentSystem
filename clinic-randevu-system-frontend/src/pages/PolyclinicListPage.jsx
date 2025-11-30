// src/pages/PolyclinicListPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClinics} from "../api/clinicslist";

export default function PolyclinicListPage() {
  const [polyclinics, setPolyclinics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getClinics().then(setPolyclinics);
  }, []);

  const goToSymptoms = (clinic) => {
      navigate(`/polyclinics/${clinic.id}/check`, {
        state: {
          clinicId: clinic.id,
          clinicName: clinic.name,
        },
      });
    };

  return (
    <div style={{ padding: 40 }}>
      <h1>Poliklinik Seç</h1>

      {polyclinics.map((clinic) => (
        <div
          key={clinic.id}
          onClick={() => goToSymptoms(clinic)}
          style={{
            padding: 20,
            background: "#f5f7ff",
            marginBottom: 10,
            borderRadius: 10,
            cursor: "pointer"
          }}
        >
          {clinic.name}
        </div>
      ))}
    </div>
  );
}

