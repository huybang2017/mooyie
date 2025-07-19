import io from "socket.io-client";

export interface Notification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

class NotificationService {
  private socket: any | null = null;
  private isConnected = false;
  private onNotification: ((data: any) => void) | null = null;

  connect(userId: string, onNotification?: (data: any) => void) {
    if (this.socket && this.isConnected) return;
    this.onNotification = onNotification || null;
    this.socket = io(`${import.meta.env.VITE_BASE_URL}/notifications`);
    this.socket.on("connect", () => {
      this.isConnected = true;
      this.socket?.emit("register", userId);
    });
    this.socket.on("disconnect", () => {
      this.isConnected = false;
    });
    this.socket.on("notification", (data: any) => {
      if (this.onNotification) {
        this.onNotification(data);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  async fetchNotifications(token: string): Promise<Notification[]> {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/notifications/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
  }
}

export const notificationService = new NotificationService();
