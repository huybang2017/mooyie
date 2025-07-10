import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");

  useEffect(() => {
    if (bookingId) {
      toast.success(`Thanh toán thành công cho booking ${bookingId}`);
    }
  }, [bookingId]);

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">🎉 Thanh toán thành công!</h1>
      <p className="mt-2">Cảm ơn bạn đã đặt vé.</p>
    </div>
  );
};

export default PaymentSuccess;
