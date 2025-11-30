import { useNavigate } from "react-router-dom";
import { getFullName } from "../utils/auth";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const adminName = getFullName();

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Paneli</h1>

      <div
        style={{
          padding: 20,
          background: "#eef2ff",
          borderRadius: 10,
          marginBottom: 30,
        }}
      >
        <h2>{adminName}</h2>
        <p>Yönetim paneline hoş geldiniz.</p>
      </div>

      <button
        onClick={() => navigate("/admin/doctors")}
        style={btnStyle}
      >
        Doktor Yönetimi
      </button>

      <button
        onClick={() => navigate("/admin/schedules")}
        style={btnStyle}
      >
        Doktor Çalışma Saatleri Yönetimi
      </button>
    </div>
  );
}

const btnStyle = {
  width: "100%",
  padding: 15,
  border: "none",
  background: "#667eea",
  color: "white",
  borderRadius: 10,
  marginBottom: 15,
  cursor: "pointer",
  fontSize: "16px",
};
