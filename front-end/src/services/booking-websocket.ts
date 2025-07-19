import io from "socket.io-client";
import type { Booking, CreateBookingRequest } from "./type";

export interface BookingEvent {
  bookingId: string;
}

export interface PaymentEvent {
  paymentId: string;
  bookingId: string;
  status: string;
}

export interface SeatsUpdatedEvent {
  showtimeId: string;
  seats: string[];
  status: "pending" | "released";
}

export class BookingWebSocketService {
  private socket: any = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventCallbacks = new Map<string, Array<(data: any) => void>>();

  connect(userId: string) {
    if (this.socket && this.isConnected) {
      console.log("BookingWebSocket: Already connected");
      return;
    }

    console.log("BookingWebSocket: Connecting to WebSocket...");
    this.socket = io(`${import.meta.env.VITE_BASE_URL}/bookings`, {
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to booking WebSocket");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.send("register-user", { userId });
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from booking WebSocket");
      this.isConnected = false;
      this.handleReconnect();
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("Booking WebSocket connection error:", error);
      this.isConnected = false;
      this.handleReconnect();
    });

    // Handle booking events
    this.socket.on("booking-created", (data: Booking) => {
      this.handleMessage("booking-created", data);
    });
    this.socket.on("booking-paid", (data: BookingEvent) => {
      this.handleMessage("booking-paid", data);
    });
    this.socket.on("booking-failed", (data: BookingEvent) => {
      this.handleMessage("booking-failed", data);
    });
    this.socket.on("booking-timeout", (data: BookingEvent) => {
      this.handleMessage("booking-timeout", data);
    });
    this.socket.on("booking-cancelled", (data: BookingEvent) => {
      this.handleMessage("booking-cancelled", data);
    });
    this.socket.on("booking-expired", (data: BookingEvent) => {
      this.handleMessage("booking-expired", data);
    });
    this.socket.on("booking-error", (data: { message: string }) => {
      this.handleMessage("booking-error", data);
    });
    // Handle payment events
    this.socket.on("payment-created", (data: PaymentEvent) => {
      this.handleMessage("payment-created", data);
    });
    // Handle seats update events
    this.socket.on("seats-updated", (data: SeatsUpdatedEvent) => {
      this.handleMessage("seats-updated", data);
    });
    // Handle bookingUpdate events (realtime payment/booking status)
    this.socket.on("bookingUpdate", (data: any) => {
      this.handleMessage("bookingUpdate", data);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }
    this.reconnectAttempts++;
    setTimeout(() => {
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      this.connect("");
    }, 1000 * this.reconnectAttempts);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  private send(event: string, data: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn("WebSocket not connected, cannot send message");
    }
  }

  private handleMessage(event: string, data: any) {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  private on(event: string, callback: (data: any) => void) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)!.push(callback);
  }

  // Booking events
  onBookingCreated(callback: (data: Booking) => void) {
    this.on("booking-created", callback);
  }
  onBookingPaid(callback: (data: BookingEvent) => void) {
    this.on("booking-paid", callback);
  }
  onBookingFailed(callback: (data: BookingEvent) => void) {
    this.on("booking-failed", callback);
  }
  onBookingTimeout(callback: (data: BookingEvent) => void) {
    this.on("booking-timeout", callback);
  }
  onBookingCancelled(callback: (data: BookingEvent) => void) {
    this.on("booking-cancelled", callback);
  }
  onBookingExpired(callback: (data: BookingEvent) => void) {
    this.on("booking-expired", callback);
  }
  onBookingError(callback: (data: { message: string }) => void) {
    this.on("booking-error", callback);
  }
  // Payment events
  onPaymentCreated(callback: (data: PaymentEvent) => void) {
    this.on("payment-created", callback);
  }
  // Seats update events
  onSeatsUpdated(callback: (data: SeatsUpdatedEvent) => void) {
    this.on("seats-updated", callback);
  }
  // Booking update events (realtime payment/booking status)
  onBookingUpdate(callback: (data: any) => void) {
    this.on("bookingUpdate", callback);
  }
  // Create booking via WebSocket
  createBooking(userId: string, bookingData: CreateBookingRequest) {
    this.send("create-booking", {
      userId,
      dto: bookingData,
    });
  }
  // Cancel booking via WebSocket
  cancelBooking(bookingId: string) {
    this.send("cancel-booking", { bookingId });
  }
  // Remove event listeners
  offBookingCreated() {
    this.eventCallbacks.delete("booking-created");
  }
  offBookingPaid() {
    this.eventCallbacks.delete("booking-paid");
  }
  offBookingFailed() {
    this.eventCallbacks.delete("booking-failed");
  }
  offBookingTimeout() {
    this.eventCallbacks.delete("booking-timeout");
  }
  offBookingCancelled() {
    this.eventCallbacks.delete("booking-cancelled");
  }
  offBookingExpired() {
    this.eventCallbacks.delete("booking-expired");
  }
  offBookingError() {
    this.eventCallbacks.delete("booking-error");
  }
  offPaymentCreated() {
    this.eventCallbacks.delete("payment-created");
  }
  offSeatsUpdated() {
    this.eventCallbacks.delete("seats-updated");
  }
  // Remove bookingUpdate event listeners
  offBookingUpdate() {
    this.eventCallbacks.delete("bookingUpdate");
  }
  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

export const bookingWebSocket = new BookingWebSocketService();
