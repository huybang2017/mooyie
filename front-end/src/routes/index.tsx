import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/layout";
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import MovieDetail from "../pages/MovieDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Bookings from "../pages/Bookings";
import BookingDetail from "../pages/BookingDetail";
import Profile from "../pages/Profile";
import BookingSelect from "../pages/BookingSelect";
import AdminDashboard from "../pages/AdminDashboard";
import LayoutAdmin from "@/components/layout-admin";
import MovieManagement from "@/pages/MovieManagement";
import ShowtimeManagement from "@/pages/ShowtimeManagement";
import TheaterManagement from "@/pages/TheaterManagement";
import TicketManagement from "@/pages/TicketManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "movies",
        element: <Movies />,
      },
      {
        path: "movies/:id",
        element: <MovieDetail />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "bookings",
        element: <Bookings />,
      },
      {
        path: "bookings/:id",
        element: <BookingDetail />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "booking/select/:movieId",
        element: <BookingSelect />,
      },
    ],
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "movies",
        element: <MovieManagement />,
      },
      {
        path: "showtimes",
        element: <ShowtimeManagement />,
      },
      {
        path: "theaters",
        element: <TheaterManagement />,
      },
      {
        path: "tickets",
        element: <TicketManagement />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
