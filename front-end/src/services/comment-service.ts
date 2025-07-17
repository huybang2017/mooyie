import { axiosAuth } from "@/services/axios";
import type {
  CreateCommentData,
  UpdateCommentData,
  Comment,
  FilterCommentRequest,
  CommentResponse,
} from "@/services/type";
import { io } from "socket.io-client";

export const getAllComments = (params: FilterCommentRequest) => {
  const { page, limit, movie, user, rating } = params;
  return axiosAuth.get<CommentResponse>(`/comments`, {
    params: { page, limit, movie, user, rating },
  });
};

export const deleteCommentById = (id: string) =>
  axiosAuth.delete<Comment>(`/comments/${id}`);

export const getAverageRating = (movieId: string) =>
  axiosAuth.get<{ averageRating: number }>(`/comments/rating/${movieId}`);

export class CommentWebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect() {
    if (this.socket && this.isConnected) {
      console.log("CommentWebSocket: Already connected");
      return;
    }

    console.log("CommentWebSocket: Connecting to WebSocket...");
    this.socket = io("http://localhost:3000/comments", {
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to comment WebSocket");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from comment WebSocket");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("Comment WebSocket connection error:", error);
      this.isConnected = false;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join a movie room to receive real-time updates
  joinMovieRoom(
    movieId: string,
    onCommentsLoaded?: (comments: Comment[]) => void
  ) {
    if (!this.socket) {
      this.connect();
    }

    if (this.socket) {
      this.socket.emit("joinMovieRoom", movieId);

      if (onCommentsLoaded) {
        this.socket.on("commentsLoadedSuccess", onCommentsLoaded);
      }
    }
  }

  // Leave a movie room
  leaveMovieRoom(movieId: string) {
    if (this.socket) {
      this.socket.emit("leaveMovieRoom", movieId);
    }
  }

  // Create a new comment
  createComment(
    commentData: CreateCommentData,
    onSuccess?: (comment: Comment) => void,
    onError?: (error: any) => void
  ) {
    if (!this.socket) {
      this.connect();
    }

    if (this.socket) {
      this.socket.emit("createComment", commentData);

      if (onSuccess) {
        this.socket.once("commentCreated", onSuccess);
      }

      if (onError) {
        this.socket.once("commentError", onError);
      }
    }
  }

  // Get all comments
  getAllComments(
    onSuccess?: (comments: Comment[]) => void,
    onError?: (error: any) => void
  ) {
    if (!this.socket) {
      this.connect();
    }

    if (this.socket) {
      this.socket.emit("findAllComments");

      if (onSuccess) {
        this.socket.once("commentsLoaded", onSuccess);
      }

      if (onError) {
        this.socket.once("commentError", onError);
      }
    }
  }

  // Get comments for a specific movie
  getCommentsByMovie(
    movieId: string,
    onSuccess?: (comments: Comment[]) => void,
    onError?: (error: any) => void
  ) {
    if (!this.socket) {
      this.connect();
    }

    if (this.socket) {
      this.socket.emit("findCommentsByMovie", movieId);

      if (onSuccess) {
        this.socket.once("commentsLoaded", onSuccess);
      }

      if (onError) {
        this.socket.once("commentError", onError);
      }
    }
  }

  // Update a comment
  updateComment(
    commentData: UpdateCommentData,
    onSuccess?: (comment: Comment) => void,
    onError?: (error: any) => void
  ) {
    if (!this.socket) {
      this.connect();
    }

    if (this.socket) {
      this.socket.emit("updateComment", commentData);

      if (onSuccess) {
        this.socket.once("commentUpdated", onSuccess);
      }

      if (onError) {
        this.socket.once("commentError", onError);
      }
    }
  }

  // Remove a comment
  removeComment(
    id: string,
    movieId: string,
    onSuccess?: (result: any) => void,
    onError?: (error: any) => void
  ) {
    if (!this.socket) {
      this.connect();
    }

    if (this.socket) {
      this.socket.emit("removeComment", { id, movieId });

      if (onSuccess) {
        this.socket.once("commentRemoved", onSuccess);
      }

      if (onError) {
        this.socket.once("commentError", onError);
      }
    }
  }

  // Listen for real-time comment events
  onCommentCreated(callback: (comment: Comment) => void) {
    if (this.socket) {
      this.socket.on("commentCreated", callback);
    }
  }

  onCommentUpdated(callback: (comment: Comment) => void) {
    if (this.socket) {
      this.socket.on("commentUpdated", callback);
    }
  }

  onCommentRemoved(callback: (data: { id: string }) => void) {
    if (this.socket) {
      this.socket.on("commentRemoved", callback);
    }
  }

  onCommentError(callback: (error: any) => void) {
    if (this.socket) {
      this.socket.on("commentError", callback);
    }
  }

  // Remove event listeners
  offCommentCreated() {
    if (this.socket) {
      this.socket.off("commentCreated");
    }
  }

  offCommentUpdated() {
    if (this.socket) {
      this.socket.off("commentUpdated");
    }
  }

  offCommentRemoved() {
    if (this.socket) {
      this.socket.off("commentRemoved");
    }
  }

  offCommentError() {
    if (this.socket) {
      this.socket.off("commentError");
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export a singleton instance
export const commentWebSocketService = new CommentWebSocketService();
