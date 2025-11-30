import axiosInstance from "./axiosInstance";

export const loginRequest = async (email, password) => {
  const response = await axiosInstance.post("/api/accounts/login/", {
    email,
    password,
  });

  // response.data = { access, refresh, role, full_name }
  return response.data;
};