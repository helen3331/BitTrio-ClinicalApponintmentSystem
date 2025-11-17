// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PolyclinicListPage from "./pages/PolyclinicListPage";
import CheckSymptomsPage from "./pages/CheckSymptomsPage";
import SymptomInputPage from "./pages/SymptomInputPage";
import DoctorListPage from "./pages/DoctorListPage";
import SlotSelectionPage from "./pages/SlotSelectionPage";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* YENİ EKLENEN SATIR: Ana sayfada Login'i göster */}
        <Route path="/" element={<LoginPage />} /> 
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/polyclinics" element={<PolyclinicListPage />} />
        <Route path="/polyclinics/:id/check" element={<CheckSymptomsPage />} />
        <Route path="/polyclinics/:id/symptom-input" element={<SymptomInputPage />} />

        <Route path="/select-doctor/:polyId" element={<DoctorListPage />} />
        <Route path="/select-slot/:doctorId" element={<SlotSelectionPage />} />

        <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </Router>
  );
}
export default App;