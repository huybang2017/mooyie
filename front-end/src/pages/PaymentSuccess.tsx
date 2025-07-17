import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { axiosAuth } from "@/services/axios";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");
  const [status, setStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingId) {
      setLoading(true);
      axiosAuth.get(`/bookings/${bookingId}`)
        .then(res => {
          setStatus(res.data.status);
          setPaymentStatus(res.data.payment?.status || "");
          if (res.data.status === "CONFIRMED" && res.data.payment?.status === "PAID") {
            toast.success("Thanh toán thành công! Vé đã được xác nhận.");
          } else if (res.data.status === "CANCELED" || res.data.payment?.status === "FAILED") {
            toast.error("Thanh toán thất bại hoặc đã bị huỷ.");
          } else {
            toast.info("Đang chờ xác nhận thanh toán từ Stripe...");
          }
        })
        .catch(() => {
          toast.error("Không tìm thấy thông tin booking.");
        })
        .finally(() => setLoading(false));
    }
  }, [bookingId]);

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">🎉 Thanh toán thành công!</h1>
      <p className="mt-2">Cảm ơn bạn đã đặt vé.</p>
      {loading ? (
        <p>Đang kiểm tra trạng thái thanh toán...</p>
      ) : (
        <div className="mt-4">
          <p className="font-semibold">Trạng thái booking: <span className="text-blue-600">{status || "Đang kiểm tra..."}</span></p>
          {paymentStatus && (
            <p className="font-semibold">Trạng thái thanh toán: <span className="text-green-600">{paymentStatus}</span></p>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
