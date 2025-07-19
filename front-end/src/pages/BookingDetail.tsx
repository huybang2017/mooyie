import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getBookingByIdThunk } from "@/store/slices/bookingSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { bookingDetail, loading } = useAppSelector((state) => state.booking);

  useEffect(() => {
    if (id) {
      dispatch(getBookingByIdThunk(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <div className="text-center">Loading booking data...</div>;
  }

  if (!bookingDetail) {
    return (
      <div className="text-center text-red-500">Booking not found</div>
    );
  }

  const movieTitle = bookingDetail.showtime?.movie?.title || "Unknown";
  const showtimeDate = bookingDetail.showtime?.time?.[0]?.start;
  const formattedDate = showtimeDate
    ? new Date(showtimeDate).toLocaleString("en-US")
    : "Unknown";

  // If seats is a JSON string, parse
  let seats: any[] = [];
  try {
    seats = Array.isArray(bookingDetail.seats)
      ? bookingDetail.seats
      : JSON.parse(bookingDetail.seats);
  } catch {
    seats = [];
  }

  const formattedSeats = seats.length
    ? seats.map((seat) => `${seat.row ?? "?"}${seat.number ?? "?"}`).join(", ")
    : "No seat information";

  const formattedPrice = `${bookingDetail.totalPrice.toLocaleString("en-US")}$`;

  const statusLabel = bookingDetail.status;
  const statusColor =
    bookingDetail.status === "CONFIRMED"
      ? "bg-green-100 text-green-800"
      : bookingDetail.status === "PENDING"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chi tiết đặt vé</h1>
      <div className="bg-white dark:bg-card border rounded-lg p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-muted-foreground">
            Tên phim
          </label>
          <p className="text-lg font-medium">{movieTitle}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">
            Ngày chiếu
          </label>
          <p className="text-lg">{formattedDate}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">
            Ghế đã đặt
          </label>
          <p className="text-lg">{formattedSeats}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">
            Tổng tiền
          </label>
          <p className="text-lg">{formattedPrice}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground">
            Trạng thái
          </label>
          <span
            className={`inline-block px-3 py-1 text-sm rounded-full ${statusColor}`}
          >
            {statusLabel === "BOOKED"
              ? "Đã thanh toán"
              : statusLabel === "PENDING"
              ? "Chờ thanh toán"
              : "Đã hủy"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
