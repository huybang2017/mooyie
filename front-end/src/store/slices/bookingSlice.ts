import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  CreateBookingRequest,
  Booking,
  BookingResponse,
} from "@/services/type";
import {
  createBookingApi,
  cancelBookingApi,
  getUserBookingsApi,
  updateBookingApi,
  getAdminBookingsApi,
  getBookingDetailApi,
} from "@/services/booking-service";
import type { FilterBookingRequest } from "@/services/type";

interface BookingState {
  bookingDetail: Booking | null;
  // seatsStatus: GetSeatsStatusResponse | null;
  userBookings: Booking[];
  loading: boolean;
  error: string | null;
  adminBookings: BookingResponse | null;
}

const initialState: BookingState = {
  bookingDetail: null,
  // seatsStatus: null,
  userBookings: [],
  loading: false,
  error: null,
  adminBookings: null,
};

export const createBookingThunk = createAsyncThunk(
  "booking/create",
  async (data: CreateBookingRequest, { rejectWithValue }) => {
    try {
      const response = await createBookingApi(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

export const getBookingByIdThunk = createAsyncThunk(
  "booking/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getBookingDetailApi(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get booking detail"
      );
    }
  }
);

export const cancelBookingThunk = createAsyncThunk(
  "booking/cancel",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await cancelBookingApi(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to cancel booking"
      );
    }
  }
);

// export const getSeatsStatusThunk = createAsyncThunk(
//   "booking/getSeatsStatus",
//   async (showtimeId: string, { rejectWithValue }) => {
//     try {
//       const response = await getSeatsStatusApi(showtimeId);
//       return response.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to get seats status"
//       );
//     }
//   }
// );

export const getUserBookingsThunk = createAsyncThunk(
  "booking/getUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserBookingsApi();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get user bookings"
      );
    }
  }
);

export const updateBookingThunk = createAsyncThunk(
  "booking/update",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateBookingApi(id, { status });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update booking"
      );
    }
  }
);

export const fetchAdminBookingsThunk = createAsyncThunk<
  BookingResponse,
  FilterBookingRequest,
  { rejectValue: string }
>("booking/fetchAdminBookings", async (params, { rejectWithValue }) => {
  try {
    const response = await getAdminBookingsApi(params);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Fetch failed");
  }
});

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingDetail: (state) => {
      state.bookingDetail = null;
    },
    // clearSeatsStatus: (state) => {
    //   state.seatsStatus = null;
    // },
    clearUserBookings: (state) => {
      state.userBookings = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAdminBookings: (state) => {
      state.adminBookings = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createBookingThunk.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.loading = false;
          state.bookingDetail = action.payload;
        }
      )
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getBookingByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getBookingByIdThunk.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.loading = false;
          state.bookingDetail = action.payload;
        }
      )
      .addCase(getBookingByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(cancelBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        cancelBookingThunk.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.loading = false;
          state.bookingDetail = action.payload;
        }
      )
      .addCase(cancelBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // .addCase(getSeatsStatusThunk.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(
      //   getSeatsStatusThunk.fulfilled,
      //   (state, action: PayloadAction<GetSeatsStatusResponse>) => {
      //     state.loading = false;
      //     state.seatsStatus = action.payload;
      //   }
      // )
      // .addCase(getSeatsStatusThunk.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })
      .addCase(getUserBookingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserBookingsThunk.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.loading = false;
          state.userBookings = action.payload;
        }
      )
      .addCase(getUserBookingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateBookingThunk.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.loading = false;
          state.bookingDetail = action.payload;
        }
      )
      .addCase(updateBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAdminBookingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminBookingsThunk.fulfilled,
        (state, action: PayloadAction<BookingResponse>) => {
          state.loading = false;
          state.adminBookings = action.payload;
        }
      )
      .addCase(fetchAdminBookingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra";
      });
  },
});

export const {
  clearBookingDetail,
  // clearSeatsStatus,
  clearUserBookings,
  clearError,
  clearAdminBookings,
} = bookingSlice.actions;
export default bookingSlice.reducer;
