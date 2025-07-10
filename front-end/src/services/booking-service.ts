import { axiosAuth } from "@/services/axios";
import type {
  Booking,
  BookingResponse,
  CreateBookingRequest,
  FilterBookingRequest,
} from "@/services/type";

export const createBookingApi = (data: CreateBookingRequest) => {
  return axiosAuth.post<Booking>("/bookings", data);
};

export const getBookingByIdApi = (id: string) => {
  return axiosAuth.get<Booking>(`/bookings/${id}`);
};

export const cancelBookingApi = (id: string) => {
  return axiosAuth.patch<Booking>(`/bookings/${id}/cancel`);
};

// export const getSeatsStatusApi = (showtimeId: string) => {
//   return axiosAuth.get<GetSeatsStatusResponse>(`/bookings/${showtimeId}/seats`);
// };

export const getUserBookingsApi = () => {
  return axiosAuth.get<Booking[]>(`/bookings/user`);
};

export const getBookingAdminApi = (params: FilterBookingRequest) => {
  const { customerName, theaterName, movieName, status, limit, page } = params;
  return axiosAuth.get<BookingResponse>(`/bookings/admin`, {
    params: {
      customerName,
      theaterName,
      movieName,
      status,
      limit,
      page,
    },
  });
};

export const updateBookingApi = (id: string, data: { status: string }) => {
  return axiosAuth.patch<Booking>(`/bookings/${id}`, data);
};
