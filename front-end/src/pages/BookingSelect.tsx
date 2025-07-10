import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRoomByShowtimeThunk } from "@/store/slices/roomSlice";
import { toast } from "sonner";
import { createBookingThunk } from "@/store/slices/bookingSlice";
import StripeQrPayment from "@/components/StripeQrPayment";

const BookingSelect = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedRoom } = useAppSelector((state) => state.room);
  const { bookingDetail } = useAppSelector((state) => state.booking);

  useEffect(() => {
    if (showtimeId) {
      dispatch(fetchRoomByShowtimeThunk(showtimeId));
    }
  }, [dispatch, showtimeId]);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<"seats">("seats");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentTimeLeft, setPaymentTimeLeft] = useState(60);
  const [bookingId, setBookingId] = useState<string>("");

  useEffect(() => {
    if (bookingDetail) {
      setBookingId(bookingDetail.id);
    }
  }, [bookingDetail]);

  useEffect(() => {
    if (showPayment && paymentTimeLeft > 0) {
      const timer = setInterval(() => {
        setPaymentTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (showPayment && paymentTimeLeft === 0) {
      toast.error("Payment window expired. Please try again.");
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
    return { seats: [] };
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
      !Array.isArray(selectedRoom.room.seats)
    )
      return;

    const roomSeats = selectedRoom.room.seats;

    const selectedSeatDetails = selectedSeats
      .map((seatId) => {
        const seat = roomSeats.find(
          (s: any) => `${s.row}${s.number}` === seatId
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
    dispatch(createBookingThunk(bookingPayload));
    setShowPayment(true);
  };

  const calculateTotal = () => {
    const roomData = getRoomData();
    return selectedSeats.reduce((sum, seatId) => {
      const seat = (roomData.seats || []).find(
        (s: any) => `${s.row}${s.number}` === seatId
      );
      return sum + (seat && typeof seat.price === "number" ? seat.price : 0);
    }, 0);
  };

  const getSeatStatus = (seatId: string) => {
    const roomData = getRoomData();
    const bookedSeats = Array.isArray(selectedRoom?.seats)
      ? selectedRoom.seats
      : [];
    const isBooked = bookedSeats.some(
      (bookedSeat: any) => `${bookedSeat.row}${bookedSeat.number}` === seatId
    );
    if (isBooked) return "occupied";
    if (selectedSeats.includes(seatId)) return "selected";
    const seat = (roomData.seats || []).find(
      (s: any) => `${s.row}${s.number}` === seatId
    );
    if (seat && seat.type === "PREMIUM") return "premium";
    return "available";
  };

  const getSeatPrice = (seatId: string) => {
    const roomData = getRoomData();
    const seat = (roomData.seats || []).find(
      (s: any) => `${s.row}${s.number}` === seatId
    );
    return seat && typeof seat.price === "number" ? seat.price : 0;
  };

  const renderSeatGrid = () => {
    const roomData = getRoomData();
    const seatsArr = Array.isArray(roomData.seats) ? roomData.seats : [];
    const rows = [...new Set(seatsArr.map((s: any) => s.row))].sort();
    const maxNumber =
      seatsArr.length > 0 ? Math.max(...seatsArr.map((s: any) => s.number)) : 0;
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full mx-auto max-w-md mb-2"></div>
          <p className="text-sm text-muted-foreground">SCREEN</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          {rows.map((row: string) => (
            <div key={row} className="flex items-center space-x-1">
              <span className="text-xs font-medium w-4 text-center">{row}</span>
              {Array.from({ length: maxNumber }, (_, i) => {
                const seatId = `${row}${i + 1}`;
                const status = getSeatStatus(seatId);
                return (
                  <button
                    key={seatId}
                    onClick={() =>
                      status !== "occupied" && handleSeatSelect(seatId)
                    }
                    disabled={status === "occupied"}
                    className={`
                      w-8 h-8 rounded text-xs font-medium transition-colors
                      ${
                        status === "occupied" &&
                        "bg-neutral-400 cursor-not-allowed"
                      }
                      ${status === "selected" && "bg-green-600 text-white"}
                      ${
                        status === "premium" &&
                        "bg-yellow-500 text-white hover:bg-yellow-600"
                      }
                      ${
                        status === "available" &&
                        "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                      }
                    `}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Premium</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-neutral-400 rounded"></div>
            <span>Occupied</span>
          </div>
        </div>
      </div>
    );
  };

  const movie = getMovieData();

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold">Book Tickets</h1>
            <p className="text-muted-foreground">
              Select seats for {movie.title}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {currentStep === "seats" && !showPayment && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Seats</CardTitle>
                  <CardDescription>Choose your preferred seats</CardDescription>
                </CardHeader>
                <CardContent>{renderSeatGrid()}</CardContent>
              </Card>
            )}
            {showPayment && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                  <CardDescription>
                    Scan the QR code below to pay via your banking app.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    {/* Booking Summary */}
                    <div className="w-full mb-4">
                      <h4 className="font-semibold mb-2">Booking Summary</h4>
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
                        <h4 className="font-medium">Selected Seats</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedSeats.map((seat) => (
                            <Badge key={seat} variant="outline">
                              {seat} - ${getSeatPrice(seat)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Payment UI */}
                    {bookingId ? (
                      <StripeQrPayment bookingId={bookingId} />
                    ) : (
                      <div>Đang tạo booking, vui lòng chờ...</div>
                    )}
                    {paymentTimeLeft > 0 ? (
                      <div className="w-full text-center text-yellow-600 font-semibold mt-4">
                        Waiting for payment... ({paymentTimeLeft} second
                        {paymentTimeLeft !== 1 ? "s" : ""} left)
                      </div>
                    ) : (
                      <div className="w-full text-center mt-4">
                        <Button
                          className="mt-2"
                          onClick={() => {
                            setShowPayment(false);
                            setPaymentTimeLeft(60);
                          }}
                        >
                          Back to Booking
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Movie Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full max-w-[120px] h-auto mx-auto object-contain rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {movie.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span>{movie.genre}</span>
                      <span>•</span>
                      <span>{movie.duration} min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {currentStep === "seats" && !showPayment && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Tickets ({selectedSeats.length})</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleConfirmBooking}
                      disabled={selectedSeats.length === 0}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSelect;
