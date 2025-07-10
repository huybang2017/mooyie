import type {
  ProfileResponse,
  Booking,
  Bookmark,
  Comment,
  FilterUserRequest,
  PaginationResponse,
} from "@/services/type";
import { axiosAuth } from "./axios";

export const getAllUsers = (
  params: FilterUserRequest
): Promise<{ data: PaginationResponse & { data: ProfileResponse[] } }> => {
  const { page, limit, role, email, name, status } = params;

  return axiosAuth.get<PaginationResponse & { data: ProfileResponse[] }>(
    "/users/admin",
    {
      params: {
        page,
        limit,
        role,
        email,
        name,
        status,
      },
    }
  );
};

// Update user profile
export const updateUserProfile = (id: string, data: Partial<ProfileResponse>) =>
  axiosAuth.patch<ProfileResponse>(`/users/${id}`, data);

export const changeStatusAccount = (id: string, status: boolean) =>
  axiosAuth.put<ProfileResponse>(`/users/${id}/status`, { status });

// Get user by ID
export const getUserById = (id: string) =>
  axiosAuth.get<ProfileResponse>(`/users/${id}`);

// Get user watch history
export const getUserWatchHistory = (id: string) =>
  axiosAuth.get<Booking[]>(`/users/${id}/history`);

// Get user bookings
export const getUserBookings = (id: string) =>
  axiosAuth.get<Booking[]>(`/users/${id}/bookings`);

// Get user comments
export const getUserComments = (id: string) =>
  axiosAuth.get<Comment[]>(`/users/${id}/comments`);

// Get user bookmarks
export const getUserBookmarks = (id: string) =>
  axiosAuth.get<Bookmark[]>(`/users/${id}/bookmarks`);

// Change password
export const changePassword = (
  id: string,
  data: {
    oldPassword: string;
    newPassword: string;
  }
) => axiosAuth.patch(`/users/${id}/change-password`, data);

// Update user avatar
export const updateUserAvatar = (id: string, avatar: string) =>
  axiosAuth.patch<ProfileResponse>(`/users/${id}`, { avatar });
