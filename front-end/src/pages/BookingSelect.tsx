import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRoomByShowtimeThunk } from "@/store/slices/roomSlice";
import { toast } from "sonner";
import StripeQrPayment from "@/components/StripeQrPayment";
import { bookingWebSocket } from "@/services/booking-websocket";
import {
  getUserPendingBookingApi,
  getShowtimeDetailApi,
} from "@/services/booking-service";
import type { Seat } from "@/services/type";

const BookingSelect = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const dispatch = useAppDispatch();
  const { selectedRoom } = useAppSelector((state) => state.room);
  const { user } = useAppSelector((state) => state.auth);

  // State for real-time booking flow
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<
    "seats" | "payment" | "processing"
  >("seats");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentTimeLeft, setPaymentTimeLeft] = useState(0);
  const [bookingId, setBookingId] = useState<string>("");
  const [bookingStatus, setBookingStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [pendingSeats, setPendingSeats] = useState<string[]>([]);

  useEffect(() => {
    if (showtimeId) {
      dispatch(fetchRoomByShowtimeThunk(showtimeId));
    }
  }, [dispatch, showtimeId]);

  useEffect(() => {
    if (user?.id && showtimeId) {
      getUserPendingBookingApi(showtimeId)
        .then((res) => {
          const booking = res.data;
          if (booking && booking.status === "PENDING" && booking.expireAt) {
            setBookingId(booking.id);
            setBookingStatus(booking.status);
            setCurrentStep("payment");
            setShowPayment(true);
            // Cập nhật lại selectedSeats từ booking
            const seats = Array.isArray(booking.seats)
              ? booking.seats.map((s: any) =>
                  typeof s === "string"
                    ? s
                    : s.row && s.number
                    ? `${s.row}${s.number}`
                    : String(s.id || s)
                )
              : [];
            setSelectedSeats(seats);
            const expireAt = new Date(booking.expireAt).getTime();
            const now = Date.now();
            setPaymentTimeLeft(
              Math.max(0, Math.floor((expireAt - now) / 1000))
            );
          }
        })
        .catch(() => {});
    }
  }, [user?.id, showtimeId]);

  useEffect(() => {
    if (showtimeId) {
      getShowtimeDetailApi(showtimeId)
        .then((res) => {
          setBookedSeats(res.data.bookedSeats || []);
          setPendingSeats(res.data.pendingSeats || []);
        })
        .catch(() => {
          setBookedSeats([]);
          setPendingSeats([]);
        });
    }
  }, [showtimeId]);

  // Thêm hàm refetchSeats để cập nhật lại danh sách ghế đã đặt
  const refetchSeats = () => {
    if (showtimeId) {
      getShowtimeDetailApi(showtimeId)
        .then((res) => {
          setBookedSeats(res.data.bookedSeats || []);
          setPendingSeats(res.data.pendingSeats || []);
        })
        .catch(() => {
          setBookedSeats([]);
          setPendingSeats([]);
        });
    }
  };

  // WebSocket connection
  useEffect(() => {
    if (user?.id) {
      bookingWebSocket.connect(user.id);

      // Lắng nghe realtime cập nhật trạng thái booking/payment
      bookingWebSocket.onBookingUpdate((data) => {
        // Luôn refetch lại seats khi có bookingUpdate
        refetchSeats();
        // Nếu là booking của user hiện tại thì cập nhật trạng thái booking/payment
        if (data.bookingId === bookingId) {
          setBookingStatus(data.bookingStatus?.toUpperCase?.() || "");
          setPaymentStatus(data.paymentStatus?.toUpperCase?.() || "");
          if (
            data.bookingStatus === "confirmed" &&
            data.paymentStatus === "paid"
          ) {
            setCurrentStep("seats");
            setShowPayment(false);
            toast.success("Thanh toán thành công! Vé đã được xác nhận.");
            setSelectedSeats([]); // Reset ghế đã chọn khi thanh toán thành công
          }
          if (
            data.bookingStatus === "cancel" &&
            (data.paymentStatus === "failed" ||
              data.paymentStatus === "refunded")
          ) {
            setCurrentStep("seats");
            setShowPayment(false);
            toast.error("Vé đã bị hủy.");
            setSelectedSeats([]); // Reset ghế đã chọn
          }
        }
      });

      // Set up event listeners
      bookingWebSocket.onBookingCreated((data) => {
        console.log("Booking created:", data);
        setBookingId(data.id);
        setBookingStatus(data.status);
        setCurrentStep("payment");
        setShowPayment(true);
        if (data.expireAt) {
          const expireAt = new Date(data.expireAt).getTime();
          const now = Date.now();
          setPaymentTimeLeft(Math.max(0, Math.floor((expireAt - now) / 1000)));
        }
        toast.success("Đặt vé thành công! Vui lòng thanh toán trong 5 phút.");
      });

      bookingWebSocket.onBookingPaid((data) => {
        console.log("Booking paid:", data);
        setBookingStatus("CONFIRMED");
        setPaymentStatus("PAID");
        setCurrentStep("seats");
        setShowPayment(false);
        toast.success("Thanh toán thành công! Vé đã được xác nhận.");
        refetchSeats();
        setSelectedSeats([]); // Reset ghế đã chọn khi thanh toán thành công
      });

      bookingWebSocket.onBookingFailed((data) => {
        console.log("Booking failed:", data);
        setBookingStatus("CANCELED");
        setPaymentStatus("FAILED");
        setCurrentStep("seats");
        setShowPayment(false);
        toast.error("Thanh toán thất bại. Vé đã bị hủy.");
        refetchSeats();
        setSelectedSeats([]); // Reset ghế đã chọn
      });

      bookingWebSocket.onBookingTimeout((data) => {
        console.log("Booking timeout:", data);
        setBookingStatus("CANCELED");
        setPaymentStatus("FAILED");
        setCurrentStep("seats");
        setShowPayment(false);
        toast.error("Hết thời gian thanh toán. Vé đã bị hủy.");
        refetchSeats();
        setSelectedSeats([]); // Reset ghế đã chọn
      });

      bookingWebSocket.onBookingError((data) => {
        console.log("Booking error:", data);
        toast.error(data.message || "Có lỗi xảy ra khi đặt vé.");
      });

      // Listen for seats updates
      bookingWebSocket.onSeatsUpdated((data) => {
        // Always treat seats as string[] (seatId)
        const seatIds = data.seats.map((s: any) =>
          typeof s === "string"
            ? s
            : s.row && s.number
            ? `${s.row}${s.number}`
            : String(s.id || s)
        );
        if (data.showtimeId === showtimeId) {
          if (data.status === "pending") {
            setPendingSeats((prev) => [...new Set([...prev, ...seatIds])]);
          } else if (data.status === "released") {
            setPendingSeats((prev) =>
              prev.filter((seat) => !seatIds.includes(seat))
            );
          }
        }
      });

      return () => {
        bookingWebSocket.offBookingUpdate();
        bookingWebSocket.disconnect();
      };
    }
  }, [user?.id, showtimeId, bookingId]);

  // Payment timer
  useEffect(() => {
    if (showPayment && paymentTimeLeft > 0) {
      const timer = setInterval(() => {
        setPaymentTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (showPayment && paymentTimeLeft === 0) {
      toast.error("Hết thời gian thanh toán. Vui lòng thử lại.");
      setShowPayment(false);
      setCurrentStep("seats");
    }
  }, [showPayment, paymentTimeLeft]);

  const getRoomData = () => {
    if (
      selectedRoom &&
      selectedRoom.room &&
      Array.isArray(selectedRoom.room.seats)
    ) {
      return selectedRoom.room;
    }
    if (selectedRoom && Array.isArray(selectedRoom.seats)) {
      return { ...selectedRoom, seats: selectedRoom.seats };
    }
    return { seats: [], name: "N/A" };
  };

  const getMovieData = () => {
    if (selectedRoom && selectedRoom.movie) {
      return selectedRoom.movie;
    }
    return {
      title: "",
      genre: "",
      duration: "",
      description: "",
      image: "",
      id: "",
    };
  };

  // When selecting seats, always use seatId (string)
  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const handleConfirmBooking = () => {
    if (
      !selectedRoom ||
      !selectedRoom.room ||
      !Array.isArray(selectedRoom.room.seats) ||
      !user?.id
    )
      return;

    const roomSeats = selectedRoom.room.seats;

    const selectedSeatDetails = selectedSeats
      .map((seatId) => {
        const seat = roomSeats.find(
          (s: Seat) => `${s.row}${s.number}` === seatId
        );

        if (!seat) return null;

        return {
          id: seat.id,
          row: seat.row,
          number: seat.number,
          price: seat.price,
          type: seat.type,
          roomId: seat.roomId,
        };
      })
      .filter((seat): seat is NonNullable<typeof seat> => seat !== null);

    const totalPrice = selectedSeatDetails.reduce(
      (sum, seat) => sum + (typeof seat.price === "number" ? seat.price : 0),
      0
    );

    const bookingPayload = {
      showtimeId: selectedRoom.id,
      seats: selectedSeatDetails,
      totalPrice,
    };

    // Create booking via WebSocket for real-time updates
    bookingWebSocket.createBooking(user.id, bookingPayload);
    setCurrentStep("processing");
  };

  const getSeatPrice = (seatId: string): number => {
    const room = getRoomData();
    const seat = room.seats?.find(
      (s: Seat) => `${s.row}${s.number}` === seatId
    );
    return seat?.price || 0;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const room = getRoomData();
  const movie = getMovieData();

  if (!selectedRoom) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neutral-900 mx-auto"></div>
          <p className="mt-4 text-lg">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Movie Information */}
        <Card className="lg:col-span-1 mb-4 lg:mb-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-12 h-18 sm:w-16 sm:h-24 object-cover rounded"
              />
              <div>
                <h2 className="text-base sm:text-xl font-bold">
                  {movie.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {movie.genre} • {movie.duration} min
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  Thông tin suất chiếu
                </h3>
                <p className="text-xs sm:text-sm">
                  <strong>Phòng:</strong> {room.name}
                </p>
                <p className="text-xs sm:text-sm">
                  <strong>Thời gian:</strong>{" "}
                  {selectedRoom.time &&
                    new Date(selectedRoom.time[0].start).toLocaleString(
                      "vi-VN"
                    )}
                </p>
              </div>

              {selectedSeats.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    Ghế đã chọn
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => (
                      <Badge
                        key={seat}
                        variant="outline"
                        className="text-xs sm:text-sm"
                      >
                        {seat} - ${getSeatPrice(seat)}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm mt-2">
                    <strong>Tổng tiền:</strong>{" "}
                    {selectedSeats
                      .reduce((sum, seat) => sum + getSeatPrice(seat), 0)
                      .toLocaleString()}{" "}
                    VNĐ
                  </p>
                </div>
              )}

              {(currentStep as string) === "processing" && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Đang tạo booking...</span>
                </div>
              )}

              {/* Debug section for development */}
              {/* {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-2 bg-neutral-100 rounded text-xs">
                  <p>
                    <strong>Debug Info:</strong>
                  </p>
                  <p>Pending seats: {pendingSeats.join(", ")}</p>
                  <p>Selected seats: {selectedSeats.join(", ")}</p>
                  <p>
                    Booked seats: {selectedRoom.seats?.join(", ") || "None"}
                  </p>
                  <p>Current step: {currentStep}</p>
                  <p>Show payment: {showPayment ? "Yes" : "No"}</p>
                </div>
              )} */}
            </div>
          </CardContent>
        </Card>

        {/* Seat Selection */}
        <Card className="lg:col-span-2 bg-white dark:bg-[#18181c] text-black dark:text-white shadow-xl min-w-0">
          <CardHeader>
            <CardTitle className="text-black dark:text-white">
              Chọn ghế
            </CardTitle>
            <CardDescription className="text-neutral-700 dark:text-neutral-300">
              Chọn ghế bạn muốn đặt. Ghế đã được đặt sẽ có màu xám. Ghế bạn chọn
              sẽ có màu xanh lá. Ghế thường màu xanh dương nhạt. Ghế VIP màu
              vàng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(currentStep as string) === "seats" && (
              <div className="space-y-4 flex flex-col items-center">
                {/* Màn hình + Lưới ghế */}
                <div className="w-full flex flex-col items-center">
                  <div className="inline-block">
                    {/* Thanh màn hình */}
                    <div
                      className="bg-neutral-300 dark:bg-neutral-200 rounded-t-lg h-5 sm:h-6 flex items-center justify-center text-black font-bold text-xs sm:text-sm mb-1 w-full"
                      style={{ minWidth: "100%", width: "100%" }}
                    >
                      MÀN HÌNH
                    </div>
                    {/* Bảng ghế */}
                    <div className="overflow-x-auto w-full">
                      <table className="border-spacing-1 sm:border-spacing-2 border-separate min-w-max">
                        <tbody>
                          {(() => {
                            // Group seats by row
                            const seatsByRow: Record<string, Seat[]> = {};
                            room.seats?.forEach((seat: Seat) => {
                              if (!seatsByRow[seat.row])
                                seatsByRow[seat.row] = [];
                              seatsByRow[seat.row].push(seat);
                            });
                            const rowNames = Object.keys(seatsByRow).sort();
                            return rowNames.map((row) => (
                              <tr key={row}>
                                <td className="pr-1 sm:pr-2 text-neutral-400 dark:text-neutral-300 font-bold text-xs sm:text-lg">
                                  {row}
                                </td>
                                {seatsByRow[row].map((seat: Seat) => {
                                  const seatId = `${seat.row}${seat.number}`;
                                  const isSelected =
                                    selectedSeats.includes(seatId);
                                  const isBooked = bookedSeats.includes(seatId);
                                  const isPending =
                                    pendingSeats.includes(seatId);
                                  // Xác định màu ghế
                                  let base = "";
                                  if (isBooked)
                                    base =
                                      "bg-neutral-300 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400";
                                  else if (isPending)
                                    base =
                                      "bg-neutral-200 text-neutral-400 dark:bg-neutral-400 dark:text-neutral-700";
                                  else if (isSelected)
                                    base =
                                      "bg-green-500 text-white dark:bg-green-600";
                                  else if (seat.type === "PREMIUM")
                                    base =
                                      "bg-yellow-200 text-yellow-900 dark:bg-yellow-400 dark:text-black";
                                  else
                                    base =
                                      "bg-blue-100 text-blue-800 dark:bg-blue-400 dark:text-white";
                                  const border = "border-transparent";
                                  return (
                                    <td key={seatId} className="p-0 sm:p-1">
                                      <button
                                        disabled={isBooked || isPending}
                                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shadow-md transition-all duration-150 ${base} ${border} ${
                                          isSelected
                                            ? "ring-2 ring-green-400"
                                            : ""
                                        } ${
                                          isBooked || isPending
                                            ? "opacity-60 cursor-not-allowed"
                                            : "hover:scale-110"
                                        }`}
                                        onClick={() => handleSeatSelect(seatId)}
                                        title={
                                          isBooked
                                            ? "Ghế đã được đặt"
                                            : isPending
                                            ? "Ghế đang được đặt"
                                            : seat.type === "PREMIUM"
                                            ? "Ghế VIP"
                                            : "Ghế thường"
                                        }
                                      >
                                        {seat.number}
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex flex-nowrap gap-3 sm:gap-4 justify-center items-center mt-2 overflow-x-auto w-full pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-neutral-300 border border-neutral-400 dark:bg-neutral-700 dark:border-neutral-500 inline-block" />{" "}
                    <span className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">
                      Đã đặt
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-green-500 border border-green-400 dark:bg-green-600 inline-block" />{" "}
                    <span className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">
                      Ghế bạn chọn
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-blue-100 dark:bg-blue-400 inline-block" />{" "}
                    <span className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">
                      Ghế thường
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-yellow-200 border border-yellow-400 dark:bg-yellow-400 dark:border-yellow-600 inline-block" />{" "}
                    <span className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">
                      Ghế VIP
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 w-full">
                  <Button
                    onClick={handleConfirmBooking}
                    disabled={
                      selectedSeats.length === 0 || currentStep === "processing"
                    }
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-base sm:text-lg font-bold py-2 sm:py-3 rounded shadow-lg dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    Xác nhận đặt vé
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Section */}
            {showPayment && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Thanh toán
                  </CardTitle>
                  <CardDescription>
                    Quét mã QR để thanh toán. Thời gian còn lại:{" "}
                    <span
                      className={`font-bold ${
                        paymentTimeLeft < 60 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {formatTime(paymentTimeLeft)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    {/* Booking Summary */}
                    <div className="w-full mb-4">
                      <h4 className="font-semibold mb-2">Thông tin đặt vé</h4>
                      <div className="flex items-center space-x-4 mb-2">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{movie.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {movie.genre} • {movie.duration} min
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Ghế đã chọn</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedSeats.map((seat) => (
                            <Badge key={seat} variant="outline">
                              {seat} - ${getSeatPrice(seat)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    {bookingStatus && (
                      <div className="w-full p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {bookingStatus === "CONFIRMED" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : bookingStatus === "CANCELED" ? (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className="font-semibold">
                            Trạng thái: {bookingStatus}
                          </span>
                        </div>
                        {paymentStatus && (
                          <p className="text-sm text-muted-foreground">
                            Thanh toán: {paymentStatus}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Payment UI */}
                    {bookingId ? (
                      <StripeQrPayment bookingId={bookingId} />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Đang tạo booking, vui lòng chờ...</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingSelect;
