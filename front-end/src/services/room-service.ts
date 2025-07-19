import { axiosClient, axiosAuth } from "@/services/axios";
import type {
  Room,
  CreateRoomRequest,
  GetRoomsByTheaterResponse,
  GetRoomSeatsResponse,
  Showtime,
} from "@/services/type";

export const createRoomApi = (data: CreateRoomRequest) => {
  return axiosAuth.post<Room>("/rooms", data);
};

export const getRoomsByTheaterApi = (theaterId: string) => {
  return axiosClient.get<GetRoomsByTheaterResponse>(
    `/rooms/theater/${theaterId}`
  );
};

export const getRoomSeatsApi = (roomId: string) => {
  return axiosClient.get<GetRoomSeatsResponse>(`/rooms/${roomId}/seats`);
};

export const getRoomByShowtimeApi = (showtimeId: string) => {
  return axiosClient.get<Showtime>(`/rooms/showtime/${showtimeId}`);
};
