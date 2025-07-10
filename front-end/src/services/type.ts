import { Comment } from "./type";
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  role: string;
  status: boolean;
  createdAt: string;
  bookings?: Booking[];
  bookmarks?: Bookmark[];
}

export interface PaginationResponse {
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  description: string;
  image: string;
  trailer_url?: string;
  status?: string;
  createdAt: string;
  showtimes?: Showtime[];
  comments?: Comment[];
  bookmarks?: Bookmark[];
}

export interface MovieResponse extends PaginationResponse {
  data: Movie[];
}

export interface BookingResponse extends PaginationResponse {
  data: Booking[];
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
}

export interface FilterUserRequest extends PaginationRequest {
  role?: string;
  email?: string;
  name?: string;
  status?: boolean;
}

export interface FilterCommentRequest extends PaginationRequest {
  movie?: string;
  user?: string;
  rating?: number;
}

export interface FilterMovieRequest extends PaginationRequest {
  genre?: string;
  title?: string;
  status?: string;
}

export interface FilterBookingRequest extends PaginationRequest {
  customerName?: string;
  theaterName?: string;
  movieName?: string;
  status?: BookingStatus;
}

export interface FilterTheatersRequest extends PaginationRequest {
  name?: string;
  location?: string;
  brand?: string;
  status?: "active" | "inactive";
}

export interface CreateMovieRequest {
  title: string;
  genre: string;
  duration: number;
  description: string;
  image: string;
  trailer_url?: string;
  status?: string;
}

export interface UpdateMovieRequest {
  title?: string;
  genre?: string;
  duration?: number;
  description?: string;
  image?: string;
  trailer_url?: string;
  status?: string;
}

export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  USED: "USED",
  EXPIRED: "EXPIRED",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export interface Showtime {
  id: string;
  time?: { start: string; end: string }[];
  seats?: [];
  isActive: boolean;
  createdAt: string;
  movieId: string;
  roomId: string;
  room?: Room;
  movie?: Movie;
}

export interface ShowtimeResponse extends PaginationResponse {
  data: Showtime[];
}

export interface FilterShowtimeRequest extends PaginationRequest {
  movie?: string;
  roomId?: string;
  time?: string;
  isActive?: boolean;
}

export interface CreateShowtimeRequest {
  movieId: string;
  roomId: string;
  startTimes: string[];
}

export interface UpdateShowtimeRequest {
  movieId?: string;
  roomId?: string;
  startTimes?: string[];
  seats?: Seat[];
  isActive?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  showtimeId: string;
  seats?: Seat[];
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  showtime?: Showtime;
  payment?: Payment;
  user?: ProfileResponse;
}

export interface CreateBookingRequest {
  showtimeId: string;
  seats: Seat[];
  totalPrice: number;
}

export interface Theater {
  id: string;
  name: string;
  brand: string;
  brandLogo?: string;
  location: string;
  status: "active" | "inactive";
  createdAt: string;
  rooms?: Room[];
}

export interface CreateTheaterRequest {
  name: string;
  location: string;
  brand: string;
  brandLogo?: string;
  status: "active" | "inactive";
}

export interface UpdateTheaterRequest {
  name?: string;
  location?: string;
  brand?: string;
  brandLogo?: string;
  status?: "active" | "inactive";
}

export interface TheaterResponse extends PaginationResponse {
  data: Theater[];
}

export interface Room {
  id: string;
  name: string;
  theaterId: string;
  seatCount: number;
  createdAt: string;
  seats?: Seat[];
  theater?: Theater;
}

export interface CreateRoomRequest {
  name: string;
  theaterId: string;
}

export interface RoomResponse {
  data: Room[];
}

export interface Seat {
  id: string;
  roomId: string;
  row: string;
  number: number;
  price: number;
  type: "REGULAR" | "PREMIUM";
}

export type GetRoomsByTheaterResponse = Room[];
export type GetRoomSeatsResponse = Seat[];

// Bookmark types
export interface Bookmark {
  id: string;
  userId: string;
  movieId: string;
  movie: Movie;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  userId: string;
  movieId: string;
  user?: ProfileResponse;
  movie?: Movie;
}

export interface CommentResponse extends PaginationResponse {
  data: Comment[];
}

export interface CreateBookmarkRequest {
  movieId: string;
}

export interface BookmarkResponse {
  data: Bookmark[];
}

// Payment types
export interface Payment {
  id: string;
  amount: number;
  status: string;
  stripePaymentId: string;
  paidAt: string;
  bookingId: string;
  booking?: Booking;
}

export interface CreatePaymentRequest {
  bookingId: string;
}

export interface PaymentResponse {
  data: Payment[];
}

export interface CreateIntentRequest {
  bookingId: string;
}

export interface CreateIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface CreateCommentData {
  content: string;
  rating: number;
  userId: string;
  movieId: string;
}

export interface UpdateCommentData {
  id: string;
  content?: string;
  rating?: number;
}
