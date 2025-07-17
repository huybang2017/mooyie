import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDashboardStats,
  getRevenueChart,
  getRecentBookings,
  getRecentComments,
  getRevenueAnalytics,
} from "@/services/dashboard-service";
import {
  type DashboardStatsResponse,
  type RevenueChartResponse,
  type RecentBookingsResponse,
  type RecentCommentsResponse,
  type RevenueAnalyticsResponse,
} from "@/services/type";

interface DashboardState {
  stats: DashboardStatsResponse | null;
  revenueChart: RevenueChartResponse | null;
  recentBookings: RecentBookingsResponse | null;
  recentComments: RecentCommentsResponse | null;
  revenueAnalytics: RevenueAnalyticsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  revenueChart: null,
  recentBookings: null,
  recentComments: null,
  revenueAnalytics: null,
  loading: false,
  error: null,
};

export const fetchDashboardStatsThunk = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardStats();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

export const fetchRevenueChartThunk = createAsyncThunk(
  "dashboard/fetchRevenueChart",
  async (params: { period?: string; months?: number }, { rejectWithValue }) => {
    try {
      const response = await getRevenueChart(params);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch revenue chart"
      );
    }
  }
);

export const fetchRecentBookingsThunk = createAsyncThunk(
  "dashboard/fetchRecentBookings",
  async (params: { limit?: number }, { rejectWithValue }) => {
    try {
      const response = await getRecentBookings(params);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch recent bookings"
      );
    }
  }
);

export const fetchRecentCommentsThunk = createAsyncThunk(
  "dashboard/fetchRecentComments",
  async (params: { limit?: number }, { rejectWithValue }) => {
    try {
      const response = await getRecentComments(params);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch recent comments"
      );
    }
  }
);

export const fetchRevenueAnalyticsThunk = createAsyncThunk(
  "dashboard/fetchRevenueAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRevenueAnalytics();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch revenue analytics"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.stats = null;
      state.revenueChart = null;
      state.recentBookings = null;
      state.recentComments = null;
      state.revenueAnalytics = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStatsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Revenue Chart
      .addCase(fetchRevenueChartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueChartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueChart = action.payload;
      })
      .addCase(fetchRevenueChartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Recent Bookings
      .addCase(fetchRecentBookingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentBookingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.recentBookings = action.payload;
      })
      .addCase(fetchRecentBookingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Recent Comments
      .addCase(fetchRecentCommentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentCommentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.recentComments = action.payload;
      })
      .addCase(fetchRecentCommentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Revenue Analytics
      .addCase(fetchRevenueAnalyticsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueAnalyticsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueAnalytics = action.payload;
      })
      .addCase(fetchRevenueAnalyticsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardData, clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
