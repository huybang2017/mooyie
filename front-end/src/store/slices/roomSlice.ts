import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Room, CreateRoomRequest, Seat, Showtime } from "@/services/type";
import {
  createRoomApi,
  getRoomByShowtimeApi,
  getRoomsByTheaterApi,
  getRoomSeatsApi,
} from "@/services/room-service";

interface RoomState {
  rooms: Room[];
  seats: Seat[];
  selectedRoom: Showtime | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  rooms: [],
  seats: [],
  selectedRoom: null,
  loading: false,
  error: null,
};

export const fetchRoomsByTheaterThunk = createAsyncThunk(
  "room/fetchByTheater",
  async (theaterId: string, { rejectWithValue }) => {
    try {
      const response = await getRoomsByTheaterApi(theaterId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch rooms by theater"
      );
    }
  }
);

export const createRoomThunk = createAsyncThunk(
  "room/create",
  async (data: CreateRoomRequest, { rejectWithValue }) => {
    try {
      const response = await createRoomApi(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create room"
      );
    }
  }
);

export const fetchRoomSeatsThunk = createAsyncThunk(
  "room/fetchSeats",
  async (roomId: string, { rejectWithValue }) => {
    try {
      const response = await getRoomSeatsApi(roomId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch room seats"
      );
    }
  }
);

export const fetchRoomByShowtimeThunk = createAsyncThunk(
  "room/fetchByShowtime",
  async (showtimeId: string, { rejectWithValue }) => {
    try {
      const response = await getRoomByShowtimeApi(showtimeId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch room by showtime"
      );
    }
  }
);

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSeats: (state) => {
      state.seats = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomsByTheaterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRoomsByTheaterThunk.fulfilled,
        (state, action: PayloadAction<Room[]>) => {
          state.loading = false;
          state.rooms = action.payload;
        }
      )
      .addCase(fetchRoomsByTheaterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRoomThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createRoomThunk.fulfilled,
        (state, action: PayloadAction<Room>) => {
          state.loading = false;
          state.rooms.unshift(action.payload);
        }
      )
      .addCase(createRoomThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRoomSeatsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRoomSeatsThunk.fulfilled,
        (state, action: PayloadAction<Seat[]>) => {
          state.loading = false;
          state.seats = action.payload;
        }
      )
      .addCase(fetchRoomSeatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRoomByShowtimeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRoomByShowtimeThunk.fulfilled,
        (state, action: PayloadAction<Showtime>) => {
          state.selectedRoom = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchRoomByShowtimeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSeats } = roomSlice.actions;
export default roomSlice.reducer;
