import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import showtimeReducer from './slices/showtimeSlice';
import bookingReducer from './slices/bookingSlice';
import commentReducer from './slices/commentSlice';
import userReducer from './slices/userSlice';
import bookmarkReducer from './slices/bookmarkSlice';
import paymentReducer from './slices/paymentSlice';
import roomReducer from './slices/roomSlice';
import theaterReducer from './slices/theaterSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
    showtime: showtimeReducer,
    booking: bookingReducer,
    comment: commentReducer,
    user: userReducer,
    bookmark: bookmarkReducer,
    payment: paymentReducer,
    room: roomReducer,
    theater: theaterReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
