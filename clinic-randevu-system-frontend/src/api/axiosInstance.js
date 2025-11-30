import axios from "axios";
import {
  getAccess,
  getRefresh,
  saveAuth,
  clearAuth
} from "../utils/auth";

const BASE_URL = "http://localhost:8000"; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// 🔹 her request'te access token ekle
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccess();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 401 → refresh token ile yenile
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = getRefresh();
      if (!refresh) {
        clearAuth();
        window.location.href = "/login";
        return;
      }

      try {
        const res = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh,
        });

        const newAccess = res.data.access;

        saveAuth({
          access: newAccess,
          refresh: refresh, // çoğu backend refresh döndürmez
          role: localStorage.getItem("role"),
          full_name: localStorage.getItem("full_name")
        });

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
