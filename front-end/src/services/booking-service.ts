import { axiosAuth } from "./axios";
import type {
  Booking,
  CreateBookingRequest,
  FilterBookingRequest,
} from "./type";

export const createBookingApi = (data: CreateBookingRequest) => {
  return axiosAuth.post<Booking>("/bookings", data);
};

export const getUserBookingsApi = () => {
  return axiosAuth.get<Booking[]>("/bookings/user");
};

export const getBookingDetailApi = (id: string) => {
  return axiosAuth.get<Booking>(`/bookings/${id}`);
};

export const cancelBookingApi = (id: string) => {
  return axiosAuth.patch(`/bookings/${id}/cancel`);
};

export const getSeatsStatusApi = (showtimeId: string) => {
  return axiosAuth.get<string[]>(`/bookings/${showtimeId}/seats`);
};

// Admin APIs
export const getAdminBookingsApi = (params: FilterBookingRequest) => {
  return axiosAuth.get("/bookings/admin", { params });
};

// Get user's pending booking for a showtime
export const getUserPendingBookingApi = (showtimeId: string) => {
  return axiosAuth.get<Booking>(`/bookings/pending?showtimeId=${showtimeId}`);
};

export const updateBookingApi = (id: string, data: { status: string }) => {
  return axiosAuth.patch<Booking>(`/bookings/${id}`, data);
};

export const checkExpiredBookingsApi = () => {
  return axiosAuth.post("/bookings/check-expired");
};

export const getShowtimeDetailApi = (id: string) => {
  return axiosAuth.get(`/showtimes/${id}`);
};
