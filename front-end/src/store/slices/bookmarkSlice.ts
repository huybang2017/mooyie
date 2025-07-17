import {
  createBookmarkApi,
  removeBookmarkApi,
} from "@/services/bookmark-service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Bookmark, CreateBookmarkRequest } from "@/services/type";
import { setBookmarkforCurrentUser } from "./authSlice";

interface BookmarkState {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
}

const initialState: BookmarkState = {
  bookmarks: [],
  loading: false,
  error: null,
};

export const createBookmarkThunk = createAsyncThunk(
  "bookmark/create",
  async (data: CreateBookmarkRequest, { rejectWithValue }) => {
    try {
      const response = await createBookmarkApi(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create bookmark"
      );
    }
  }
);

export const removeBookmarkThunk = createAsyncThunk(
  "bookmark/remove",
  async (movieId: string, { rejectWithValue }) => {
    try {
      const response = await removeBookmarkApi(movieId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove bookmark"
      );
    }
  }
);

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookmarkThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createBookmarkThunk.fulfilled,
        (state, action: PayloadAction<Bookmark>) => {
          state.loading = false;
          state.bookmarks.unshift(action.payload);
        }
      )
      .addCase(createBookmarkThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeBookmarkThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeBookmarkThunk.fulfilled,
        (state, action: PayloadAction<Bookmark>) => {
          state.loading = false;
          state.bookmarks = state.bookmarks.filter(
            (b) => b.movieId !== action.payload.movieId
          );
        }
      )
      .addCase(removeBookmarkThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
