import { store } from "@/store";
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store.getState().auth.refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = store.getState().auth.refreshToken;
        const res = await axios.post("https://api.example.com/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;

        // Cập nhật token mới
        store.dispatch(
          setTokens({
            accessToken: newAccessToken,
            refreshToken,
          })
        );

        localStorage.setItem("accessToken", newAccessToken);

        // Gửi lại request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
