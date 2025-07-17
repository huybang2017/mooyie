import { axiosAuth, axiosClient } from "@/services/axios";
import type {
  FilterShowtimeRequest,
  CreateShowtimeRequest,
  UpdateShowtimeRequest,
  Showtime,
  ShowtimeResponse,
  FilterShowtimeByMovieRequest,
} from "@/services/type";

export const getShowtimesApi = (params: FilterShowtimeRequest) => {
  return axiosClient.get<ShowtimeResponse>("/showtimes", { params });
};

export const getShowtimesByMovieApi = (
  movieId: string,
  params: FilterShowtimeByMovieRequest
) => {
  const { time, theaterLogo } = params;
  return axiosClient.get<ShowtimeResponse>(`/showtimes/movies/${movieId}`, {
    params: {
      time,
      theaterLogo,
    },
  });
};

export const getShowtimesAdminApi = (params: FilterShowtimeRequest) => {
  const { movie, time, page = 1, limit = 10, isActive } = params;
  return axiosAuth.get<ShowtimeResponse>("/showtimes/admin", {
    params: { movie, time, page, limit, isActive },
  });
};

export const getShowtimeByIdApi = (id: string) => {
  return axiosClient.get<Showtime>(`/showtimes/${id}`);
};

export const createShowtimeApi = (data: CreateShowtimeRequest) => {
  return axiosAuth.post<Showtime>("/showtimes", data);
};

export const updateShowtimeApi = (id: string, data: UpdateShowtimeRequest) => {
  return axiosAuth.patch<Showtime>(`/showtimes/${id}`, data);
};

export const deleteShowtimeApi = (id: string) => {
  return axiosAuth.delete(`/showtimes/${id}`);
};
