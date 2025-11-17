import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
      <Link to="/polyclinics" style={{ marginRight: 10 }}>Poliklinikler</Link>
      <Link to="/patient/dashboard" style={{ marginRight: 10 }}>Hasta Paneli</Link>
      <Link to="/doctor/dashboard" style={{ marginRight: 10 }}>Doktor Paneli</Link>
      <Link to="/admin/dashboard" style={{ marginRight: 10 }}>Admin Paneli</Link>
      <Link to="/login">Giriş</Link>
    </nav>
  );
}