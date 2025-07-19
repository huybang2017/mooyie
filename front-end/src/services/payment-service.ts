import { axiosAuth } from "@/services/axios";
import type {
  Payment,
  CreatePaymentRequest,
  CreateIntentRequest,
  CreateIntentResponse,
} from "@/services/type";

export const createPaymentApi = (data: CreatePaymentRequest) => {
  return axiosAuth.post<Payment>("/payments", data);
};

export const getPaymentByIdApi = (id: string) => {
  return axiosAuth.get<Payment>(`/payments/${id}`);
};

export const refundPaymentApi = (bookingId: string) => {
  return axiosAuth.post<Payment>(`/payments/refund/${bookingId}`);
};

export const createIntentApi = (data: CreateIntentRequest) => {
  return axiosAuth.post<CreateIntentResponse>("/payments/intent", data);
};

export const getQrCheckoutApi = (bookingId: string) => {
  return axiosAuth.get<string>(`/payments/qr-checkout/${bookingId}`);
};

// Payment status check
export const checkPaymentStatusApi = (bookingId: string) => {
  return axiosAuth.get<Payment>(`/payments/booking/${bookingId}`);
};
