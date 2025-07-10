import { axiosAuth } from "@/services/axios";
import type { Bookmark, CreateBookmarkRequest } from "@/services/type";

export const createBookmarkApi = (data: CreateBookmarkRequest) => {
  return axiosAuth.post<Bookmark>("/bookmarks", data);
};

export const removeBookmarkApi = (movieId: string) => {
  return axiosAuth.delete<Bookmark>(`/bookmarks/${movieId}`);
};
