import { useState } from "react";
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
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  ArrowLeft,
  CreditCard,
} from "lucide-react";

// Fake movie data
const fakeMovie = {
  id: "1",
  title: "Inception",
  description: "A mind-bending thriller by Christopher Nolan.",
  genre: "Sci-Fi",
  duration: 148,
  rating: 8.8,
  poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
  releaseDate: "2010-07-16",
};

// Fake showtimes data
const fakeShowtimes = [
  {
    id: "1",
    date: "2024-01-20",
    time: "10:00 AM",
    price: 12.0,
    availableSeats: 45,
    theater: "Theater 1",
  },
  {
    id: "2",
    date: "2024-01-20",
    time: "1:30 PM",
    price: 12.0,
    availableSeats: 32,
    theater: "Theater 1",
  },
  {
    id: "3",
    date: "2024-01-20",
    time: "4:15 PM",
    price: 14.0,
    availableSeats: 28,
    theater: "Theater 2",
  },
  {
    id: "4",
    date: "2024-01-20",
    time: "7:00 PM",
    price: 16.0,
    availableSeats: 15,
    theater: "Theater 1",
  },
  {
    id: "5",
    date: "2024-01-20",
    time: "9:45 PM",
    price: 16.0,
    availableSeats: 38,
    theater: "Theater 2",
  },
];

// Fake seat layout
const fakeSeatLayout = {
  rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
  columns: 12,
  occupiedSeats: [
    "A1",
    "A2",
    "B5",
    "B6",
    "C3",
    "D8",
    "E1",
    "E2",
    "F4",
    "G7",
    "H3",
    "I9",
    "J5",
  ],
  premiumSeats: [
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "A9",
    "A10",
    "B3",
    "B4",
    "B7",
    "B8",
    "B9",
    "B10",
  ],
  price: {
    regular: 12.0,
    premium: 16.0,
  },
};

const BookingSelect = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<
    "showtime" | "seats" | "review"
  >("showtime");

  const handleShowtimeSelect = (showtimeId: string) => {
    setSelectedShowtime(showtimeId);
    setCurrentStep("seats");
  };

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((seat) => seat !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleContinueToReview = () => {
    if (selectedSeats.length > 0) {
      setCurrentStep("review");
    }
  };

  const handleBackToSeats = () => {
    setCurrentStep("seats");
  };

  const handleBackToShowtimes = () => {
    setCurrentStep("showtime");
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  const handleConfirmBooking = () => {
    // Here you would typically make an API call to create the booking
    console.log("Creating booking:", {
      movieId,
      showtimeId: selectedShowtime,
      seats: selectedSeats,
      totalAmount: calculateTotal(),
    });

    // Navigate to booking confirmation
    navigate("/bookings");
  };

  const calculateTotal = () => {
    if (!selectedShowtime || selectedSeats.length === 0) return 0;

    const showtime = fakeShowtimes.find((s) => s.id === selectedShowtime);
    if (!showtime) return 0;

    const total = selectedSeats.reduce((sum, seatId) => {
      const isPremium = fakeSeatLayout.premiumSeats.includes(seatId);
      return (
        sum +
        (isPremium
          ? fakeSeatLayout.price.premium
          : fakeSeatLayout.price.regular)
      );
    }, 0);

    return total;
  };

  const getSeatStatus = (seatId: string) => {
    if (fakeSeatLayout.occupiedSeats.includes(seatId)) {
      return "occupied";
    }
    if (selectedSeats.includes(seatId)) {
      return "selected";
    }
    if (fakeSeatLayout.premiumSeats.includes(seatId)) {
      return "premium";
    }
    return "available";
  };

  const getSeatPrice = (seatId: string) => {
    return fakeSeatLayout.premiumSeats.includes(seatId)
      ? fakeSeatLayout.price.premium
      : fakeSeatLayout.price.regular;
  };

  const renderSeatGrid = () => {
    return (
      <div className="space-y-4">
        {/* Screen */}
        <div className="text-center">
          <div className="bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full mx-auto max-w-md mb-2"></div>
          <p className="text-sm text-muted-foreground">SCREEN</p>
        </div>

        {/* Seat Grid */}
        <div className="flex flex-col items-center space-y-2">
          {fakeSeatLayout.rows.map((row) => (
            <div key={row} className="flex items-center space-x-1">
              <span className="text-xs font-medium w-4 text-center">{row}</span>
              {Array.from({ length: fakeSeatLayout.columns }, (_, i) => {
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
                        status !== "selected" &&
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

        {/* Legend */}
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

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold">Book Tickets</h1>
            <p className="text-muted-foreground">
              Select showtime and seats for {fakeMovie.title}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-start space-x-8">
          <div
            className={`flex items-center space-x-2 ${
              currentStep === "showtime"
                ? "text-green-600"
                : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "showtime"
                  ? "bg-green-600 text-white"
                  : "bg-neutral-200 dark:bg-neutral-700"
              }`}
            >
              1
            </div>
            <span>Showtime</span>
          </div>
          <div
            className={`flex items-center space-x-2 ${
              currentStep === "seats"
                ? "text-green-600"
                : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "seats"
                  ? "bg-green-600 text-white"
                  : "bg-neutral-200 dark:bg-neutral-700"
              }`}
            >
              2
            </div>
            <span>Seats</span>
          </div>
          <div
            className={`flex items-center space-x-2 ${
              currentStep === "review"
                ? "text-green-600"
                : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "review"
                  ? "bg-green-600 text-white"
                  : "bg-neutral-200 dark:bg-neutral-700"
              }`}
            >
              3
            </div>
            <span>Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Showtime Selection */}
            {currentStep === "showtime" && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Showtime</CardTitle>
                  <CardDescription>
                    Choose your preferred date and time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fakeShowtimes.map((showtime) => (
                      <div
                        key={showtime.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                        onClick={() => handleShowtimeSelect(showtime.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {new Date(showtime.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Date
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {showtime.time}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Time
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {showtime.theater}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Theater
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${showtime.price}</p>
                          <p className="text-xs text-muted-foreground">
                            {showtime.availableSeats} seats left
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seat Selection */}
            {currentStep === "seats" && selectedShowtime && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Seats</CardTitle>
                  <CardDescription>Choose your preferred seats</CardDescription>
                </CardHeader>
                <CardContent>{renderSeatGrid()}</CardContent>
              </Card>
            )}

            {/* Review Booking */}
            {currentStep === "review" && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Booking</CardTitle>
                  <CardDescription>
                    Confirm your booking details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={fakeMovie.poster}
                        alt={fakeMovie.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{fakeMovie.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {fakeMovie.genre} • {fakeMovie.duration} min
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{fakeMovie.rating}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Showtime Details</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {
                              fakeShowtimes.find(
                                (s) => s.id === selectedShowtime
                              )?.date
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {
                              fakeShowtimes.find(
                                (s) => s.id === selectedShowtime
                              )?.time
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {
                              fakeShowtimes.find(
                                (s) => s.id === selectedShowtime
                              )?.theater
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

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
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Movie Info */}
            <Card>
              <CardHeader>
                <CardTitle>Movie Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <img
                    src={fakeMovie.poster}
                    alt={fakeMovie.title}
                    className="w-full rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{fakeMovie.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {fakeMovie.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span>{fakeMovie.genre}</span>
                      <span>•</span>
                      <span>{fakeMovie.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{fakeMovie.rating}/10</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            {(currentStep === "seats" || currentStep === "review") && (
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
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>$2.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${(calculateTotal() + 2.0).toFixed(2)}</span>
                    </div>

                    {currentStep === "seats" && (
                      <Button
                        className="w-full"
                        onClick={handleContinueToReview}
                        disabled={selectedSeats.length === 0}
                      >
                        Continue to Review
                      </Button>
                    )}

                    {currentStep === "review" && (
                      <Button className="w-full" onClick={handleConfirmBooking}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Confirm Booking
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            {currentStep === "seats" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleBackToShowtimes}
              >
                Back to Showtimes
              </Button>
            )}

            {currentStep === "review" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleBackToSeats}
              >
                Back to Seats
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSelect;
