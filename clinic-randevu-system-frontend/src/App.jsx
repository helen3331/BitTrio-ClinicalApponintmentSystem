// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import PatientAppointments from "./pages/PatientAppointments";
import PrivateRoute from "./routes/PrivateRoute";


<<<<<<< Updated upstream
import Navbar from "./components/Navbar";
=======
// import Navbar from "./components/Navbar";
>>>>>>> Stashed changes
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminDoctorCreatePage from "./pages/AdminDoctorCreatePage";
import AdminDoctorEditPage from "./pages/AdminDoctorEditPage";
import AdminDoctorListPage from "./pages/AdminDoctorListPage";
import AdminScheduleManagementPage from "./pages/AdminScheduleManagementPage";
import CheckSymptomsPage from "./pages/CheckSymptomsPage";
import DoctorCalendarPage from "./pages/DoctorCalendarPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import DoctorListPage from "./pages/DoctorListPage";
import LoginPage from "./pages/LoginPage";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import PolyclinicListPage from "./pages/PolyclinicListPage";
import RegisterPage from "./pages/RegisterPage";
import SlotSelectionPage from "./pages/SlotSelectionPage";
import SymptomInputPage from "./pages/SymptomInputPage";

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
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

        <Route path="/patient/dashboard" element={
            <PrivateRoute allowed="patient">
              <PatientDashboardPage />
            </PrivateRoute>
          } />

        <Route path="/patient/appointments"
          element={
            <PrivateRoute allowed="patient">
              <PatientAppointments />
            </PrivateRoute>
          } />

        <Route path="/doctor/dashboard" element={
            <PrivateRoute allowed="doctor">
              <DoctorDashboardPage />
            </PrivateRoute>
          } />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowed="admin">
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/calendar"
          element={
            <PrivateRoute allowed="doctor">
              <DoctorCalendarPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <PrivateRoute allowed="admin">
              <AdminDoctorListPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/doctors/create"
          element={
            <PrivateRoute allowed="admin">
              <AdminDoctorCreatePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/doctors/:doctorId/edit"
          element={
            <PrivateRoute allowed="admin">
              <AdminDoctorEditPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/schedules"
          element={
            <PrivateRoute allowed="admin">
              <AdminScheduleManagementPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;