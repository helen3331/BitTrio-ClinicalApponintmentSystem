import axiosInstance from "./axiosInstance";

export const getMyAppointments = async () => {
  const res = await axiosInstance.get("/api/appointments/my/");
  return res.data;
};

export const createAppointment = async (doctorId, scheduleId) => {
  const res = await axiosInstance.post("/api/appointments/create/", {
    doctor: doctorId,
    schedule: scheduleId,
  });
  return res.data;
};