import type {
  DashboardStatsResponse,
  RecentBookingsResponse,
  RecentCommentsResponse,
  RevenueAnalyticsResponse,
  RevenueChartResponse,
} from "@/services/type";
import { axiosAuth } from "./axios";

// Types for dashboard responses

// API functions
export const getDashboardStats = () => {
  return axiosAuth.get<DashboardStatsResponse>("/admin/dashboard/stats");
};

export const getRevenueChart = (params: {
  period?: string;
  months?: number;
}) => {
  return axiosAuth.get<RevenueChartResponse>("/admin/dashboard/revenue", {
    params,
  });
};

export const getRecentBookings = (params: { limit?: number }) => {
  return axiosAuth.get<RecentBookingsResponse>(
    "/admin/dashboard/recent-bookings",
    { params }
  );
};

export const getRecentComments = (params: { limit?: number }) => {
  return axiosAuth.get<RecentCommentsResponse>(
    "/admin/dashboard/recent-comments",
    { params }
  );
};

export const getRevenueAnalytics = () => {
  return axiosAuth.get<RevenueAnalyticsResponse>(
    "/admin/dashboard/revenue-analytics"
  );
};
