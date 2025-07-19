import { store } from "@/store";
import { logout, refreshToken } from "@/store/slices/authSlice";
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken") || null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const token = localStorage.getItem("refreshToken") || null;

    if (error.response?.status === 401 && !originalRequest._retry && token) {
      originalRequest._retry = true;

      try {
        const resultAction = await store.dispatch(refreshToken(token));

        if (refreshToken.fulfilled.match(resultAction)) {
          const newAccessToken = resultAction.payload.accessToken;

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosAuth(originalRequest);
        } else {
          store.dispatch(logout());
          return Promise.reject(error);
        }
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
