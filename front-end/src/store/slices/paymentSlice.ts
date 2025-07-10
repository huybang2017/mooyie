import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Payment,
  CreatePaymentRequest,
  CreateIntentRequest,
  CreateIntentResponse,
} from "@/services/type";
import {
  createPaymentApi,
  getPaymentByIdApi,
  refundPaymentApi,
  createIntentApi,
} from "@/services/payment-service";

interface PaymentState {
  payment: Payment | null;
  refund: Payment | null;
  intent: CreateIntentResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payment: null,
  refund: null,
  intent: null,
  loading: false,
  error: null,
};

export const createPaymentThunk = createAsyncThunk(
  "payment/create",
  async (data: CreatePaymentRequest, { rejectWithValue }) => {
    try {
      const response = await createPaymentApi(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create payment"
      );
    }
  }
);

export const getPaymentByIdThunk = createAsyncThunk(
  "payment/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getPaymentByIdApi(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get payment"
      );
    }
  }
);

export const refundPaymentThunk = createAsyncThunk(
  "payment/refund",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await refundPaymentApi(bookingId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to refund payment"
      );
    }
  }
);

export const createIntentThunk = createAsyncThunk(
  "payment/createIntent",
  async (data: CreateIntentRequest, { rejectWithValue }) => {
    try {
      const response = await createIntentApi(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create payment intent"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPayment: (state) => {
      state.payment = null;
    },
    clearRefund: (state) => {
      state.refund = null;
    },
    clearIntent: (state) => {
      state.intent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createPaymentThunk.fulfilled,
        (state, action: PayloadAction<Payment>) => {
          state.loading = false;
          state.payment = action.payload;
        }
      )
      .addCase(createPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getPaymentByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPaymentByIdThunk.fulfilled,
        (state, action: PayloadAction<Payment>) => {
          state.loading = false;
          state.payment = action.payload;
        }
      )
      .addCase(getPaymentByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(refundPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        refundPaymentThunk.fulfilled,
        (state, action: PayloadAction<Payment>) => {
          state.loading = false;
          state.refund = action.payload;
        }
      )
      .addCase(refundPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createIntentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createIntentThunk.fulfilled,
        (state, action: PayloadAction<CreateIntentResponse>) => {
          state.loading = false;
          state.intent = action.payload;
        }
      )
      .addCase(createIntentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPayment, clearRefund, clearIntent, clearError } =
  paymentSlice.actions;
export default paymentSlice.reducer;
