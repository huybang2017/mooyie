export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
