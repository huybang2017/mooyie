import { Link } from "react-router-dom";

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

const Bookings = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {fakeBookings.length === 0 ? (
        <p className="text-center text-muted-foreground">No bookings found</p>
      ) : (
        <div className="space-y-4">
          {fakeBookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{booking.movieTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(booking.showtimeDate).toLocaleDateString()}
              </p>
              <p className="text-sm">Seats: {booking.seats.join(", ")}</p>
              <p className="text-sm">Total: ${booking.totalAmount}</p>
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

              {/* Optional: Link to detail page */}
              <div className="mt-2">
                <Link
                  to={`/bookings/${booking.id}`}
                  className="text-blue-500 text-sm underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
