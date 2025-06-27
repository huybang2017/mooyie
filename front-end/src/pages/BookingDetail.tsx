import { useParams } from "react-router-dom";

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

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const booking = fakeBookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="text-center text-red-500">Không tìm thấy đặt vé</div>
    );
  }

  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
      <div className="bg-card border rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Movie
            </label>
            <p className="text-lg">{booking.movieTitle}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Date
            </label>
            <p className="text-lg">
              {new Date(booking.showtimeDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Seats
            </label>
            <p className="text-lg">{booking.seats.join(", ")}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Total Amount
            </label>
            <p className="text-lg">${booking.totalAmount}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Status
            </label>
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${
                booking.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : booking.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
