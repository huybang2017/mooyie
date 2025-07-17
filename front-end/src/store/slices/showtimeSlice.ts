import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Showtime,
  FilterShowtimeRequest,
  CreateShowtimeRequest,
  UpdateShowtimeRequest,
  ShowtimeResponse,
  FilterShowtimeByMovieRequest,
} from "@/services/type";
import {
  getShowtimesApi,
  getShowtimeByIdApi,
  createShowtimeApi,
  updateShowtimeApi,
  deleteShowtimeApi,
  getShowtimesByMovieApi,
  getShowtimesAdminApi,
} from "@/services/showtime-service";

interface ShowtimeState {
  showtimes: ShowtimeResponse | null;
  showtimeDetail: Showtime | null;
  adminShowtimes: ShowtimeResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ShowtimeState = {
  showtimes: null,
  showtimeDetail: null,
  adminShowtimes: null,
  loading: false,
  error: null,
};

export const fetchShowtimesThunk = createAsyncThunk(
  "showtimes/fetchAll",
  async (params: FilterShowtimeRequest, { rejectWithValue }) => {
    try {
      const response = await getShowtimesApi(params);
      return response.data as ShowtimeResponse;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch showtimes"
      );
    }
  }
);

export const fetchAdminShowtimesThunk = createAsyncThunk(
  "showtimes/fetchAdmin",
  async (params: FilterShowtimeRequest, { rejectWithValue }) => {
    try {
      console.log(params);

      const response = await getShowtimesAdminApi(params);
      return response.data as ShowtimeResponse;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch admin showtimes"
      );
    }
  }
);

export const fetchShowtimeByIdThunk = createAsyncThunk(
  "showtimes/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getShowtimeByIdApi(id);
      return response.data as Showtime;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch showtime"
      );
    }
  }
);

export const createShowtimeThunk = createAsyncThunk(
  "showtimes/create",
  async (data: CreateShowtimeRequest, { rejectWithValue }) => {
    try {
      const response = await createShowtimeApi(data);
      return response.data as Showtime;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create showtime"
      );
    }
  }
);

export const updateShowtimeThunk = createAsyncThunk(
  "showtimes/update",
  async (
    { id, data }: { id: string; data: UpdateShowtimeRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateShowtimeApi(id, data);
      return response.data as Showtime;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update showtime"
      );
    }
  }
);

export const deleteShowtimeThunk = createAsyncThunk(
  "showtimes/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteShowtimeApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete showtime"
      );
    }
  }
);

export const fetchShowtimesByMovieThunk = createAsyncThunk(
  "showtimes/fetchByMovie",
  async (
    {
      movieId,
      params,
    }: { movieId: string; params: FilterShowtimeByMovieRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await getShowtimesByMovieApi(movieId, params);
      return response.data as ShowtimeResponse;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch showtimes by movie"
      );
    }
  }
);

const showtimeSlice = createSlice({
  name: "showtimes",
  initialState,
  reducers: {
    clearShowtimeDetail: (state) => {
      state.showtimeDetail = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShowtimesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchShowtimesThunk.fulfilled,
        (state, action: PayloadAction<ShowtimeResponse>) => {
          state.loading = false;
          state.showtimes = action.payload;
        }
      )
      .addCase(fetchShowtimesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAdminShowtimesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminShowtimesThunk.fulfilled,
        (state, action: PayloadAction<ShowtimeResponse>) => {
          state.loading = false;
          state.adminShowtimes = action.payload;
        }
      )
      .addCase(fetchAdminShowtimesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchShowtimeByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchShowtimeByIdThunk.fulfilled,
        (state, action: PayloadAction<Showtime>) => {
          state.loading = false;
          state.showtimeDetail = action.payload;
        }
      )
      .addCase(fetchShowtimeByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(
        createShowtimeThunk.fulfilled,
        (state, action: PayloadAction<Showtime>) => {
          if (state.showtimes?.data) {
            state.showtimes.data.unshift(action.payload);
            state.showtimes.total += 1;
          }
        }
      )

      .addCase(
        updateShowtimeThunk.fulfilled,
        (state, action: PayloadAction<Showtime>) => {
          if (state.showtimes?.data) {
            const index = state.showtimes.data.findIndex(
              (s) => s.id === action.payload.id
            );
            if (index !== -1) {
              state.showtimes.data[index] = action.payload;
            }
          }
          if (state.showtimeDetail?.id === action.payload.id) {
            state.showtimeDetail = action.payload;
          }
        }
      )

      .addCase(
        deleteShowtimeThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          if (state.showtimes?.data) {
            state.showtimes.data = state.showtimes.data.filter(
              (s) => s.id !== action.payload
            );
            state.showtimes.total -= 1;
          }
          if (state.showtimeDetail?.id === action.payload) {
            state.showtimeDetail = null;
          }
        }
      )

      .addCase(fetchShowtimesByMovieThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchShowtimesByMovieThunk.fulfilled,
        (state, action: PayloadAction<ShowtimeResponse>) => {
          state.loading = false;
          state.showtimes = action.payload;
        }
      )
      .addCase(fetchShowtimesByMovieThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearShowtimeDetail, clearError } = showtimeSlice.actions;
export default showtimeSlice.reducer;
