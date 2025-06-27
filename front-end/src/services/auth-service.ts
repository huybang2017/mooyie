import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from "@/services/type";
import { axiosClient, axiosAuth } from "./axios";

export const registerApi = (data: RegisterPayload) =>
  axiosClient.post<string>("/auth/register", data);

export const loginApi = (data: LoginPayload) =>
  axiosClient.post<LoginResponse>("/auth/login", data);

export const refreshTokenApi = (refreshToken: string) =>
  axiosClient.post<{ accessToken: string; refreshToken: string }>(
    "/auth/refresh",
    { refreshToken }
  );

export const getMe = () => axiosAuth.get("/auth/me");
