import { useEffect, useState } from "react";
import * as QRCodeLib from "qrcode.react";
import { toast } from "sonner";
import { axiosAuth } from "@/services/axios";
interface StripeQrPaymentProps {
  bookingId: string;
}
const StripeQrPayment: React.FC<StripeQrPaymentProps> = ({ bookingId }) => {
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const QRCode = QRCodeLib.QRCodeSVG;

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const res = await axiosAuth.get(`/payments/qr-checkout/${bookingId}`);
        setCheckoutUrl(res.data.url);
        setLoading(false);
      } catch (err) {
        toast.error("Không thể tạo mã QR thanh toán");
        setLoading(false);
      }
    };

    if (bookingId) fetchQr();
  }, [bookingId]);

  if (loading) return <p>Đang tải mã QR...</p>;

  if (!checkoutUrl) return <p>Không thể tải mã QR.</p>;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-bold">Quét mã QR để thanh toán trực tuyến</h2>
      <QRCode value={checkoutUrl} size={256} />
      <p className="text-sm text-gray-600">
        Quét mã QR bằng ứng dụng thanh toán của bạn hoặc bấm vào liên kết bên
        dưới để thanh toán trực tuyến.
      </p>
      <a
        href={checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        Hoặc bấm vào đây để thanh toán
      </a>
    </div>
  );
};

export default StripeQrPayment;
