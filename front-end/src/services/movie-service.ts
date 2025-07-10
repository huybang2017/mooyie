import { axiosAuth, axiosClient } from "@/services/axios";
import type {
  CreateMovieRequest,
  FilterMovieRequest,
  MovieResponse,
  UpdateMovieRequest,
} from "@/services/type";

export const getMoviesApi = (params: FilterMovieRequest) => {
  const { genre, page = 1, limit = 10 } = params;
  return axiosClient.get<MovieResponse>("/movies", {
    params: {
      genre,
      page,
      limit,
    },
  });
};

export const getMovieByIdApi = (id: string) => {
  return axiosClient.get(`/movies/${id}`);
};

export const createMovieApi = (data: CreateMovieRequest) => {
  return axiosAuth.post("/movies", data);
};

export const updateMovieApi = (id: string, data: UpdateMovieRequest) => {
  return axiosAuth.patch(`/movies/${id}`, data);
};

export const deleteMovieApi = (id: string) => {
  return axiosAuth.delete(`/movies/${id}`);
};

export const getMoviesAdminApi = (params: FilterMovieRequest) => {
  const { genre, title, status, page = 1, limit = 10 } = params;
  return axiosAuth.get<MovieResponse>("/movies/admin", {
    params: {
      genre,
      title,
      status,
      page,
      limit,
    },
  });
};
