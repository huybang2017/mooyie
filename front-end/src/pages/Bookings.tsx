import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fakeBookings = [
  {
    id: "1",
    movieTitle: "Inception",
    showtimeDate: "2025-07-01T18:30:00",
    seats: ["A1", "A2", "A3"],
    totalAmount: 30,
    status: "confirmed",
  },
  {
    id: "2",
    movieTitle: "The Matrix",
    showtimeDate: "2025-07-05T20:00:00",
    seats: ["B4", "B5"],
    totalAmount: 20,
    status: "pending",
  },
  {
    id: "3",
    movieTitle: "Interstellar",
    showtimeDate: "2025-07-10T17:00:00",
    seats: ["C1"],
    totalAmount: 10,
    status: "cancelled",
  },
];

const statusColor = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabel = {
  confirmed: "Đã xác nhận",
  pending: "Đang chờ",
  cancelled: "Đã hủy",
};

const Bookings = () => {
  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold mb-6">My booking</h1>

      {fakeBookings.length === 0 ? (
        <p className="text-center text-muted-foreground">Không có vé nào</p>
      ) : (
        <div className="grid gap-4">
          {fakeBookings.map((booking) => (
            <Card key={booking.id} className="border shadow-sm">
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <div>
                  <CardTitle className="text-lg">
                    {booking.movieTitle}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.showtimeDate).toLocaleString("vi-VN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <Badge className={statusColor[booking.status]}>
                  {statusLabel[booking.status]}
                </Badge>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Ghế:</span>{" "}
                  {booking.seats.join(", ")}
                </p>
                <p>
                  <span className="font-medium">Tổng tiền:</span> $
                  {booking.totalAmount}
                </p>
                <Button asChild variant="link" className="px-0 text-sm mt-2">
                  <Link to={`/bookings/${booking.id}`}>Xem chi tiết</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
