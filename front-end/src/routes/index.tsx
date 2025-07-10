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
import BookingManagement from "@/pages/BookingManagement";
import RoleGuard from "@/routes/RoleGuard";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Bookmarks from "@/pages/Bookmarks";
import UserManagement from "@/pages/UserManagement";
import CommentManagement from "@/pages/CommentManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "movies",
        element: <Movies />,
      },
      {
        path: "movies/:id",
        element: (
          <RoleGuard requiredRoles={["USER"]}>
            <MovieDetail />
          </RoleGuard>
        ),
      },
      { path: "login", element: <Login /> },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "bookings",
        element: (
          <RoleGuard requiredRoles={["USER"]}>
            <Bookings />
          </RoleGuard>
        ),
      },
      {
        path: "bookings/:id",
        element: (
          <RoleGuard requiredRoles={["USER"]}>
            <BookingDetail />
          </RoleGuard>
        ),
      },
      {
        path: "profile",
        element: (
          <RoleGuard requiredRoles={["USER"]}>
            <Profile />
          </RoleGuard>
        ),
      },
      {
        path: "booking/select/:showtimeId",
        element: (
          <RoleGuard requiredRoles={["USER"]}>
            <BookingSelect />
          </RoleGuard>
        ),
      },
      {
        path: "bookmarks",
        element: (
          <RoleGuard requiredRoles={["USER"]}>
            <Bookmarks />
          </RoleGuard>
        ),
      },
      {
        path: "/payment-success",
        element: (
          <RoleGuard requiredRoles={["USER"]}>
            <PaymentSuccess />
          </RoleGuard>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <RoleGuard requiredRoles={["ADMIN"]}>
        <LayoutAdmin />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "movies", element: <MovieManagement /> },
      { path: "showtimes", element: <ShowtimeManagement /> },
      { path: "theaters", element: <TheaterManagement /> },
      { path: "bookings", element: <BookingManagement /> },
      { path: "users", element: <UserManagement /> },
      { path: "comments", element: <CommentManagement /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
