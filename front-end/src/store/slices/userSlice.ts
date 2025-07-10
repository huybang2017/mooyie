import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  ProfileResponse,
  Booking,
  Bookmark,
  Comment,
  FilterUserRequest,
  PaginationResponse,
} from "@/services/type";
import {
  updateUserProfile,
  getUserById,
  getUserWatchHistory,
  getUserBookings,
  getUserComments,
  getUserBookmarks,
  changePassword,
  updateUserAvatar,
  getAllUsers,
  changeStatusAccount,
} from "@/services/user-service";

interface AdminUsersState {
  data: ProfileResponse[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

interface UserState {
  currentUser: ProfileResponse | null;
  userProfile: ProfileResponse | null;
  watchHistory: Booking[];
  userBookings: Booking[];
  userComments: Comment[];
  userBookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  adminUsers: AdminUsersState;
}

const initialState: UserState = {
  currentUser: null,
  userProfile: null,
  watchHistory: [],
  userBookings: [],
  userComments: [],
  userBookmarks: [],
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  adminUsers: {
    data: [],
    total: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    loading: false,
    error: null,
  },
};

// --- ADMIN THUNKS ---
export const fetchAdminUsersThunk = createAsyncThunk<
  PaginationResponse & { data: ProfileResponse[] },
  FilterUserRequest
>("user/fetchAdminUsers", async (params, { rejectWithValue }) => {
  try {
    const response = await getAllUsers(params);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch users"
    );
  }
});

export const changeUserStatusThunk = createAsyncThunk(
  "user/changeUserStatus",
  async (
    { id, status }: { id: string; status: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await changeStatusAccount(id, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change user status"
      );
    }
  }
);

// --- EXISTING USER THUNKS (unchanged) ---
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (
    { id, data }: { id: string; data: Partial<ProfileResponse> },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUserProfile(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getUserById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

export const fetchUserWatchHistory = createAsyncThunk(
  "user/fetchWatchHistory",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getUserWatchHistory(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch watch history"
      );
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  "user/fetchBookings",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getUserBookings(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

export const fetchUserComments = createAsyncThunk(
  "user/fetchComments",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getUserComments(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

export const fetchUserBookmarks = createAsyncThunk(
  "user/fetchBookmarks",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getUserBookmarks(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookmarks"
      );
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "user/changePassword",
  async (
    {
      id,
      data,
    }: { id: string; data: { oldPassword: string; newPassword: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await changePassword(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (
    { id, avatar }: { id: string; avatar: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUserAvatar(id, avatar);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update avatar"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
      state.adminUsers.error = null;
    },
    setCurrentUser: (state, action: PayloadAction<ProfileResponse>) => {
      state.currentUser = action.payload;
    },
    clearUserData: (state) => {
      state.currentUser = null;
      state.userProfile = null;
      state.watchHistory = [];
      state.userBookings = [];
      state.userComments = [];
      state.userBookmarks = [];
      state.adminUsers = initialState.adminUsers;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- ADMIN USERS ---
      .addCase(fetchAdminUsersThunk.pending, (state) => {
        state.adminUsers.loading = true;
        state.adminUsers.error = null;
      })
      .addCase(fetchAdminUsersThunk.fulfilled, (state, action) => {
        state.adminUsers.loading = false;
        const { data, total, currentPage, totalPages, pageSize } =
          action.payload;
        state.adminUsers.data = data || [];
        state.adminUsers.total = total || 0;
        state.adminUsers.currentPage = currentPage || 1;
        state.adminUsers.totalPages = totalPages || 1;
        state.adminUsers.pageSize = pageSize || 10;
      })
      .addCase(fetchAdminUsersThunk.rejected, (state, action) => {
        state.adminUsers.loading = false;
        state.adminUsers.error = action.payload as string;
      })
      .addCase(changeUserStatusThunk.pending, (state) => {
        state.adminUsers.loading = true;
        state.adminUsers.error = null;
      })
      .addCase(changeUserStatusThunk.fulfilled, (state, action) => {
        state.adminUsers.loading = false;
        // Update user status in-place
        const idx = state.adminUsers.data.findIndex(
          (u) => u.id === action.payload.id
        );
        if (idx !== -1) {
          state.adminUsers.data[idx] = action.payload;
        }
      })
      .addCase(changeUserStatusThunk.rejected, (state, action) => {
        state.adminUsers.loading = false;
        state.adminUsers.error = action.payload as string;
      })
      // --- EXISTING USER LOGIC (unchanged) ---
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.currentUser = action.payload;
        state.userProfile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      // Fetch User by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Watch History
      .addCase(fetchUserWatchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.watchHistory = action.payload;
      })
      .addCase(fetchUserWatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Comments
      .addCase(fetchUserComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserComments.fulfilled, (state, action) => {
        state.loading = false;
        state.userComments = action.payload;
      })
      .addCase(fetchUserComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Bookmarks
      .addCase(fetchUserBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookmarks = action.payload;
      })
      .addCase(fetchUserBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Change Password
      .addCase(changeUserPassword.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      // Update Avatar
      .addCase(updateAvatar.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (state.currentUser) {
          state.currentUser.avatar = action.payload.avatar;
        }
        if (state.userProfile) {
          state.userProfile.avatar = action.payload.avatar;
        }
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { clearError, setCurrentUser, clearUserData } = userSlice.actions;
export default userSlice.reducer;
