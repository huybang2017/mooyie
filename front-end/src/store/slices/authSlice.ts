import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
  RegisterPayload,
} from "@/services/type";
import {
  getMe,
  loginApi,
  refreshTokenApi,
  registerApi,
} from "@/services/auth-service";

interface AuthState {
  user: ProfileResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const { data }: { data: LoginResponse } = await loginApi(credentials);
      localStorage.setItem("token", data.accessToken);
      const userRes = await getMe();
      return { user: userRes.data, token: data.accessToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      await registerApi(userData);
      const { email, password } = userData;
      const { data }: { data: LoginResponse } = await loginApi({
        email,
        password,
      });
      localStorage.setItem("token", data.accessToken);
      const userRes = await getMe();
      return { user: userRes.data, token: data.accessToken };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMe();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await refreshTokenApi(refreshToken);
      const { accessToken } = response.data;
      localStorage.setItem("token", accessToken);
      const userRes = await getMe();
      return { user: userRes.data, token: accessToken };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Token refresh failed"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<ProfileResponse>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
