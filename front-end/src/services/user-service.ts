import { axiosAuth } from "./axios";

export const getUserApi = (id: string) => axiosAuth.get(`/users/${id}`);

export const getUserHistoryApi = (id: string) =>
  axiosAuth.get(`/users/${id}/history`);

export const getUserBookingsApi = (id: string) =>
  axiosAuth.get(`/users/${id}/bookings`);

export const getUserCommentsApi = (id: string) =>
  axiosAuth.get(`/users/${id}/comments`);

export const getUserBookmarksApi = (id: string) =>
  axiosAuth.get(`/users/${id}/bookmarks`);
