// src/pages/DoctorListPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoctorsByPolyclinicMock } from "../api/api";

export default function DoctorListPage() {
  const { polyId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDoctorsByPolyclinicMock(Number(polyId)).then(setDoctors);
  }, [polyId]);

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Doktor Seç</h2>
      <ul>
        {doctors.map((d) => (
          <li key={d.id}>
            {d.name}{" "}
            <button onClick={() => navigate(`/select-slot/${d.id}`)}>
              Saat seç
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
