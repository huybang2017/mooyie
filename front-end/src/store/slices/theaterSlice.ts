import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Theater,
  CreateTheaterRequest,
  TheaterResponse,
  FilterTheatersRequest,
  UpdateTheaterRequest,
} from "@/services/type";
import {
  getTheatersApi,
  createTheaterApi,
  getTheatersAdminApi,
  updateTheaterAdminApi,
} from "@/services/theater-service";

interface TheaterState {
  theaters: Theater[];
  adminTheaters: TheaterResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: TheaterState = {
  theaters: [],
  adminTheaters: null,
  loading: false,
  error: null,
};

export const fetchTheatersThunk = createAsyncThunk<Theater[]>(
  "theater/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTheatersApi();
      return response.data as unknown as Theater[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch theaters"
      );
    }
  }
);

export const fetchTheatersAdminThunk = createAsyncThunk<
  TheaterResponse,
  FilterTheatersRequest
>("theaters/fetchAdmin", async (params, { rejectWithValue }) => {
  try {
    const res = await getTheatersAdminApi(params);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Something went wrong"
    );
  }
});

export const createTheaterThunk = createAsyncThunk(
  "theater/create",
  async (data: CreateTheaterRequest, { rejectWithValue }) => {
    try {
      const response = await createTheaterApi(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create theater"
      );
    }
  }
);

export const updateTheaterThunk = createAsyncThunk<
  Theater,
  { id: string; data: UpdateTheaterRequest }
>("theaters/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateTheaterAdminApi(id, data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update theater"
    );
  }
});

const theaterSlice = createSlice({
  name: "theater",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTheatersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTheatersThunk.fulfilled,
        (state, action: PayloadAction<Theater[]>) => {
          state.loading = false;
          state.theaters = action.payload;
        }
      )
      .addCase(fetchTheatersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Theater
      .addCase(createTheaterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createTheaterThunk.fulfilled,
        (state, action: PayloadAction<Theater>) => {
          state.loading = false;
          if (state.adminTheaters?.data) {
            state.adminTheaters.data.unshift(action.payload);
          }
        }
      )
      .addCase(createTheaterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch admin theaters
      .addCase(fetchTheatersAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTheatersAdminThunk.fulfilled,
        (state, action: PayloadAction<TheaterResponse>) => {
          state.loading = false;
          state.adminTheaters = action.payload;
        }
      )
      .addCase(fetchTheatersAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Update Theater
      .addCase(updateTheaterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTheaterThunk.fulfilled,
        (state, action: PayloadAction<Theater>) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.adminTheaters?.data.findIndex(
            (t) => t.id === updated.id
          );
          if (index !== undefined && index !== -1 && state.adminTheaters) {
            state.adminTheaters.data[index] = updated;
          }
        }
      )
      .addCase(updateTheaterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = theaterSlice.actions;
export default theaterSlice.reducer;
