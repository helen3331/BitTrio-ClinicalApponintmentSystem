import axiosInstance from "./axiosInstance";

export const getClinics = async () => {
  const res = await axiosInstance.get("/api/clinics/list/");
  return res.data;
};

export const getDoctorsByClinic = async (clinicId) => {
  const res = await axiosInstance.get(`/api/doctors/${clinicId}/`);
  return res.data;
};

export const getDoctorAvailability = async (doctorId) => {
  const res = await axiosInstance.get(`/api/doctors/${doctorId}/availability/`);
  return res.data;
};
