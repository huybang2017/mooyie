import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getUserBookingsThunk,
  cancelBookingThunk,
} from "@/store/slices/bookingSlice";
import { toast } from "sonner";
import { bookingWebSocket } from "@/services/booking-websocket";
import type { Booking } from "@/services/type";
import QRCode from "react-qr-code";

const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
  USED: "bg-blue-100 text-blue-800",
  EXPIRED: "bg-gray-100 text-gray-800",
};

const statusLabel = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELED: "Canceled",
  USED: "Used",
  EXPIRED: "Expired",
};

const getSeatString = (seats: any) => {
  let seatList: any[] = [];
  try {
    seatList = Array.isArray(seats)
      ? seats
      : typeof seats === "string"
      ? JSON.parse(seats)
      : [];
  } catch {
    seatList = [];
  }
  return seatList.length
    ? seatList.map((s) => `${s.row ?? "?"}${s.number ?? "?"}`).join(", ")
    : "N/A";
};

const Bookings = () => {
  const dispatch = useAppDispatch();
  const { userBookings, loading } = useAppSelector((state) => state.booking);
  const { user } = useAppSelector((state) => state.auth);
  const [cancelingBookings, setCancelingBookings] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    dispatch(getUserBookingsThunk())
      .unwrap()
      .catch((err) => {
        console.error("Failed to fetch user bookings:", err);
      });
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      bookingWebSocket.connect(user.id);
      bookingWebSocket.onBookingUpdate((data) => {
        // data: { bookingId, bookingStatus, paymentStatus }
        // Refresh bookings nếu có thay đổi
        dispatch(getUserBookingsThunk());
        if (
          data.bookingStatus === "confirmed" &&
          data.paymentStatus === "paid"
        ) {
          toast.success("Payment successful! Ticket confirmed.");
        }
        if (
          data.bookingStatus === "cancel" &&
          data.paymentStatus === "failed"
        ) {
          toast.error("Payment failed or timed out. Ticket cancelled.");
        }
      });

      // Set up event listeners for real-time updates
      bookingWebSocket.onBookingPaid((data) => {
        console.log("Booking paid:", data);
        toast.success("Payment successful! Ticket confirmed.");
        // Refresh bookings
        dispatch(getUserBookingsThunk());
      });

      bookingWebSocket.onBookingFailed((data) => {
        console.log("Booking failed:", data);
        toast.error("Payment failed. Ticket cancelled.");
        // Refresh bookings
        dispatch(getUserBookingsThunk());
      });

      bookingWebSocket.onBookingTimeout((data) => {
        console.log("Booking timeout:", data);
        toast.error("Payment timed out. Ticket cancelled.");
        // Refresh bookings
        dispatch(getUserBookingsThunk());
      });

      bookingWebSocket.onBookingExpired((data) => {
        console.log("Booking expired:", data);
        toast.warning("Ticket expired.");
        // Refresh bookings
        dispatch(getUserBookingsThunk());
      });

      return () => {
        bookingWebSocket.offBookingUpdate();
        bookingWebSocket.disconnect();
      };
    }
  }, [user?.id, dispatch]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancelingBookings((prev) => new Set(prev).add(bookingId));

      await dispatch(cancelBookingThunk(bookingId)).unwrap();
      toast.success("Ticket cancelled successfully!");

      // Refresh bookings
      dispatch(getUserBookingsThunk());
    } catch (error: any) {
      toast.error(error || "Could not cancel ticket");
    } finally {
      setCancelingBookings((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const canCancelBooking = (booking: Booking) => {
    if (booking.status !== "CONFIRMED") return false;

    const bookingDate = new Date(booking.createdAt);
    const now = new Date();
    const hoursDiff =
      (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= 24;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4" />;
      case "CANCELED":
        return <XCircle className="w-4 h-4" />;
      case "USED":
        return <CheckCircle className="w-4 h-4" />;
      case "EXPIRED":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>

      {userBookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
              <p className="text-muted-foreground">
                You have not booked any tickets yet. Choose a movie and book
                now!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {userBookings?.map((booking: Booking) => (
            <Card key={booking.id} className="border shadow-sm">
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <div>
                  <CardTitle className="text-lg">
                    {booking.showtime?.movie?.title || "N/A"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {booking.showtime?.time?.[0]?.start
                      ? new Date(booking.showtime.time[0].start).toLocaleString(
                          "en-US",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      statusColor[booking.status as keyof typeof statusColor]
                    }
                  >
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">
                      {statusLabel[booking.status as keyof typeof statusLabel]}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {booking.showtime?.room?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {booking.totalPrice.toLocaleString()} VND
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Booked on:{" "}
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-US"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium text-sm mb-1">
                        Seats booked:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {getSeatString(booking.seats)}
                      </div>
                    </div>

                    {booking.payment && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Payment:</h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              booking.payment.status === "PAID"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {booking.payment.status}
                          </Badge>
                          {booking.payment.status === "PAID" && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                booking.payment.paidAt
                              ).toLocaleDateString("en-US")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="text-sm text-muted-foreground">
                    Ticket code:
                    <div className="mt-2">
                      <QRCode value={booking.id} size={80} />
                    </div>
                  </div>

                  {canCancelBooking(booking) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelingBookings.has(booking.id)}
                    >
                      {cancelingBookings.has(booking.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel ticket
                        </>
                      )}
                    </Button>
                  )}

                  {!canCancelBooking(booking) &&
                    booking.status === "CONFIRMED" && (
                      <div className="text-xs text-muted-foreground">
                        You can only cancel tickets within 24 hours after
                        booking
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
