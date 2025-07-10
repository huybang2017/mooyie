import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import movieReducer from "./slices/movieSlice";
import bookingReducer from "./slices/bookingSlice";
import bookmarkReducer from "./slices/bookmarkSlice";
import showtimeReducer from "./slices/showtimeSlice";
import paymentReducer from "./slices/paymentSlice";
import roomReducer from "./slices/roomSlice";
import theaterReducer from "./slices/theaterSlice";
import commentReducer from "./slices/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    movie: movieReducer,
    booking: bookingReducer,
    bookmark: bookmarkReducer,
    showtime: showtimeReducer,
    payment: paymentReducer,
    room: roomReducer,
    theater: theaterReducer,
    comment: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
