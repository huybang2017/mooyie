import { axiosClient, axiosAuth } from "@/services/axios";
import type {
  CreateTheaterRequest,
  FilterTheatersRequest,
  Theater,
  TheaterResponse,
  UpdateTheaterRequest,
} from "@/services/type";

export const getTheatersApi = () => {
  return axiosClient.get<Theater>("/theaters");
};

export const createTheaterApi = (data: CreateTheaterRequest) => {
  return axiosAuth.post<Theater>("/theaters", data);
};

export const getTheatersAdminApi = (params: FilterTheatersRequest) => {
  const { name, location, brand, status, page = 1, limit = 10 } = params;
  return axiosAuth.get<TheaterResponse>("/theaters/admin", {
    params: {
      name,
      location,
      brand,
      status,
      page,
      limit,
    },
  });
};

export const updateTheaterAdminApi = (
  id: string,
  data: UpdateTheaterRequest
) => {
  return axiosAuth.patch(`/theaters/${id}`, data);
};
