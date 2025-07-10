import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { getUserBookingsThunk } from "@/store/slices/bookingSlice";

// const userBookings = [
//   {
//     id: "ae330e5a-e52a-4842-8024-788a293d2170",
//     seats: [
//       {
//         id: "dc3baed5-9470-44bd-b555-aab5deb817b4",
//         row: "D",
//         type: "REGULAR",
//         price: 100000,
//         number: 4,
//         roomId: "99bc4f20-caf0-40f2-afab-91469d162729",
//       },
//     ],
//     totalPrice: 100000,
//     status: "PENDING",
//     createdAt: "2025-07-05T16:49:20.598Z",
//     userId: "6487fe2c-8ac9-43e1-b89e-2fe3076fc42f",
//     showtimeId: "8359257c-8f1a-488c-b0fd-40f4bd53a866",
//     showtime: {
//       id: "8359257c-8f1a-488c-b0fd-40f4bd53a866",
//       time: [
//         {
//           end: "2025-07-05T06:01:00.000Z",
//           start: "2025-07-05T03:00:00.000Z",
//         },
//       ],
//       seats: [
//         {
//           id: "dc3baed5-9470-44bd-b555-aab5deb817b4",
//           row: "D",
//           type: "REGULAR",
//           price: 100000,
//           number: 4,
//           roomId: "99bc4f20-caf0-40f2-afab-91469d162729",
//         },
//       ],
//       isActive: true,
//       createdAt: "2025-07-05T16:42:02.098Z",
//       movieId: "996d8f96-90a3-4d68-b0a0-5bfe9a6ca030",
//       roomId: "99bc4f20-caf0-40f2-afab-91469d162729",
//       movie: {
//         id: "996d8f96-90a3-4d68-b0a0-5bfe9a6ca030",
//         title: "Avengers: Endgame",
//         genre: "Action",
//         duration: 181,
//         description:
//           "After the devastating events of Avengers: Infinity War, the universe is in ruins. The Avengers assemble once more to reverse Thanos' actions.",
//         trailer_url: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
//         image:
//           "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
//         status: "now_showing",
//         createdAt: "2025-07-05T16:42:01.072Z",
//       },
//     },
//     payment: null,
//   },
//   {
//     id: "1971e531-bd14-4d42-9c64-03ce6d8f749c",
//     seats:
//       '[{"row":"A","number":1},{"row":"B","number":3},{"row":"C","number":5}]',
//     totalPrice: 150000,
//     status: "BOOKED",
//     createdAt: "2025-07-05T16:42:02.438Z",
//     userId: "6487fe2c-8ac9-43e1-b89e-2fe3076fc42f",
//     showtimeId: "756450db-8dd6-488e-a2e7-2eadf6bfae57",
//     showtime: {
//       id: "756450db-8dd6-488e-a2e7-2eadf6bfae57",
//       time: [
//         {
//           end: "2025-07-06T09:12:00.000Z",
//           start: "2025-07-06T07:00:00.000Z",
//         },
//       ],
//       seats: [],
//       isActive: true,
//       createdAt: "2025-07-05T16:42:02.374Z",
//       movieId: "7d0c05ae-80ad-40f4-af78-47730acd3848",
//       roomId: "99bc4f20-caf0-40f2-afab-91469d162729",
//       movie: {
//         id: "7d0c05ae-80ad-40f4-af78-47730acd3848",
//         title: "Parasite",
//         genre: "Thriller",
//         duration: 132,
//         description:
//           "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the Kim clan.",
//         trailer_url: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
//         image:
//           "https://images.unsplash.com/photo-1489599835382-957593cb2375?w=400&h=600&fit=crop",
//         status: "now_showing",
//         createdAt: "2025-07-05T16:42:01.072Z",
//       },
//     },
//     payment: {
//       id: "53cc2e86-da9f-448b-b04b-d2ea4530af61",
//       amount: 150000,
//       status: "PAID",
//       stripePaymentId: "pi_pwkgrbft9",
//       paidAt: "2025-07-05T16:42:02.453Z",
//       bookingId: "1971e531-bd14-4d42-9c64-03ce6d8f749c",
//     },
//   },
//   {
//     id: "e5a84560-bf2b-4b1f-9caf-8fe8a7ad3e42",
//     seats:
//       '[{"row":"A","number":1},{"row":"B","number":3},{"row":"C","number":5}]',
//     totalPrice: 150000,
//     status: "BOOKED",
//     createdAt: "2025-07-05T16:42:02.436Z",
//     userId: "6487fe2c-8ac9-43e1-b89e-2fe3076fc42f",
//     showtimeId: "dc2825d0-4781-415f-acc7-4e20642b7a6e",
//     showtime: {
//       id: "dc2825d0-4781-415f-acc7-4e20642b7a6e",
//       time: [
//         {
//           end: "2025-07-10T09:08:00.000Z",
//           start: "2025-07-10T07:00:00.000Z",
//         },
//       ],
//       seats: [],
//       isActive: true,
//       createdAt: "2025-07-05T16:42:02.334Z",
//       movieId: "165a3bdc-0d53-4fc2-b9d5-348b2fafb9f6",
//       roomId: "99bc4f20-caf0-40f2-afab-91469d162729",
//       movie: {
//         id: "165a3bdc-0d53-4fc2-b9d5-348b2fafb9f6",
//         title: "La La Land",
//         genre: "Musical",
//         duration: 128,
//         description:
//           "A jazz pianist falls for an aspiring actress in Los Angeles.",
//         trailer_url: "https://www.youtube.com/watch?v=0pdqf4P9MB8",
//         image:
//           "https://images.unsplash.com/photo-1489599835382-957593cb2375?w=400&h=600&fit=crop",
//         status: "now_showing",
//         createdAt: "2025-07-05T16:42:01.072Z",
//       },
//     },
//     payment: {
//       id: "4cd02979-a605-4245-b077-6cd453ba5dd4",
//       amount: 150000,
//       status: "PAID",
//       stripePaymentId: "pi_p89ubjrt1",
//       paidAt: "2025-07-05T16:42:02.450Z",
//       bookingId: "e5a84560-bf2b-4b1f-9caf-8fe8a7ad3e42",
//     },
//   },
//   {
//     id: "8a3c932e-1be3-4328-9c0b-16fee5c472e0",
//     seats:
//       '[{"row":"A","number":1},{"row":"B","number":3},{"row":"C","number":5}]',
//     totalPrice: 150000,
//     status: "BOOKED",
//     createdAt: "2025-07-05T16:42:02.433Z",
//     userId: "6487fe2c-8ac9-43e1-b89e-2fe3076fc42f",
//     showtimeId: "bfddf8dc-3d5f-4594-97d6-22b7479b0aad",
//     showtime: {
//       id: "bfddf8dc-3d5f-4594-97d6-22b7479b0aad",
//       time: [
//         {
//           end: "2025-07-09T09:12:00.000Z",
//           start: "2025-07-09T07:00:00.000Z",
//         },
//       ],
//       seats: [],
//       isActive: true,
//       createdAt: "2025-07-05T16:42:02.386Z",
//       movieId: "7d0c05ae-80ad-40f4-af78-47730acd3848",
//       roomId: "99bc4f20-caf0-40f2-afab-91469d162729",
//       movie: {
//         id: "7d0c05ae-80ad-40f4-af78-47730acd3848",
//         title: "Parasite",
//         genre: "Thriller",
//         duration: 132,
//         description:
//           "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the Kim clan.",
//         trailer_url: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
//         image:
//           "https://images.unsplash.com/photo-1489599835382-957593cb2375?w=400&h=600&fit=crop",
//         status: "now_showing",
//         createdAt: "2025-07-05T16:42:01.072Z",
//       },
//     },
//     payment: {
//       id: "062461d2-e7f9-4e6d-b0d3-873670b5b2e2",
//       amount: 150000,
//       status: "PAID",
//       stripePaymentId: "pi_abjy641jr",
//       paidAt: "2025-07-05T16:42:02.447Z",
//       bookingId: "8a3c932e-1be3-4328-9c0b-16fee5c472e0",
//     },
//   },
//   {
//     id: "63a5182a-5a3b-46b2-b0ff-c476238aab7e",
//     seats:
//       '[{"row":"A","number":1},{"row":"B","number":3},{"row":"C","number":5}]',
//     totalPrice: 150000,
//     status: "BOOKED",
//     createdAt: "2025-07-05T16:42:02.430Z",
//     userId: "6487fe2c-8ac9-43e1-b89e-2fe3076fc42f",
//     showtimeId: "580c1df1-bd84-41a1-9877-470efcf01426",
//     showtime: {
//       id: "580c1df1-bd84-41a1-9877-470efcf01426",
//       time: [
//         {
//           end: "2025-07-06T09:08:00.000Z",
//           start: "2025-07-06T07:00:00.000Z",
//         },
//       ],
//       seats: [],
//       isActive: true,
//       createdAt: "2025-07-05T16:42:02.346Z",
//       movieId: "165a3bdc-0d53-4fc2-b9d5-348b2fafb9f6",
//       roomId: "36aeed8e-b7c8-4e58-af96-92010d7f27f4",
//       movie: {
//         id: "165a3bdc-0d53-4fc2-b9d5-348b2fafb9f6",
//         title: "La La Land",
//         genre: "Musical",
//         duration: 128,
//         description:
//           "A jazz pianist falls for an aspiring actress in Los Angeles.",
//         trailer_url: "https://www.youtube.com/watch?v=0pdqf4P9MB8",
//         image:
//           "https://images.unsplash.com/photo-1489599835382-957593cb2375?w=400&h=600&fit=crop",
//         status: "now_showing",
//         createdAt: "2025-07-05T16:42:01.072Z",
//       },
//     },
//     payment: {
//       id: "a3ebf681-32be-42a0-82d6-56740cf80028",
//       amount: 150000,
//       status: "PAID",
//       stripePaymentId: "pi_jfg23hnkf",
//       paidAt: "2025-07-05T16:42:02.445Z",
//       bookingId: "63a5182a-5a3b-46b2-b0ff-c476238aab7e",
//     },
//   },
//   {
//     id: "4ab5b15d-7d8e-4204-bcaf-3cb4f3f46727",
//     seats:
//       '[{"row":"A","number":1},{"row":"B","number":3},{"row":"C","number":5}]',
//     totalPrice: 150000,
//     status: "BOOKED",
//     createdAt: "2025-07-05T16:42:02.427Z",
//     userId: "6487fe2c-8ac9-43e1-b89e-2fe3076fc42f",
//     showtimeId: "508e6646-e9b1-4be9-9109-3ceadcdfdd10",
//     showtime: {
//       id: "508e6646-e9b1-4be9-9109-3ceadcdfdd10",
//       time: [
//         {
//           end: "2025-07-06T13:32:00.000Z",
//           start: "2025-07-06T11:00:00.000Z",
//         },
//       ],
//       seats: [],
//       isActive: true,
//       createdAt: "2025-07-05T16:42:02.236Z",
//       movieId: "b638c7ea-da1d-4eec-b158-435851016689",
//       roomId: "36aeed8e-b7c8-4e58-af96-92010d7f27f4",
//       movie: {
//         id: "b638c7ea-da1d-4eec-b158-435851016689",
//         title: "The Dark Knight",
//         genre: "Action",
//         duration: 152,
//         description:
//           "Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice when the Joker causes chaos.",
//         trailer_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
//         image:
//           "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
//         status: "now_showing",
//         createdAt: "2025-07-05T16:42:01.072Z",
//       },
//     },
//     payment: {
//       id: "14c00979-04ab-4be1-97fe-2f2aac3bf4eb",
//       amount: 150000,
//       status: "PAID",
//       stripePaymentId: "pi_g8ckn4y0o",
//       paidAt: "2025-07-05T16:42:02.442Z",
//       bookingId: "4ab5b15d-7d8e-4204-bcaf-3cb4f3f46727",
//     },
//   },
//   {
//     id: "cd6ec1aa-b5bc-44d5-9c50-442a99637c85",
//     seats:
//       '[{"row":"A","number":1},{"row":"B","number":3},{"row":"C","number":5}]',
//     totalPrice: 150000,
//     status: "BOOKED",
//     createdAt: "2025-07-05T16:42:02.425Z",
//     userId: "6487fe2c-8ac9-43e1-b89e-2fe3076fc42f",
//     showtimeId: "6d57558c-cb92-4eda-af61-fa6ee5acad6b",
//     showtime: {
//       id: "6d57558c-cb92-4eda-af61-fa6ee5acad6b",
//       time: [
//         {
//           end: "2025-07-07T05:32:00.000Z",
//           start: "2025-07-07T03:00:00.000Z",
//         },
//       ],
//       seats: [],
//       isActive: true,
//       createdAt: "2025-07-05T16:42:02.211Z",
//       movieId: "b638c7ea-da1d-4eec-b158-435851016689",
//       roomId: "99bc4f20-caf0-40f2-afab-91469d162729",
//       movie: {
//         id: "b638c7ea-da1d-4eec-b158-435851016689",
//         title: "The Dark Knight",
//         genre: "Action",
//         duration: 152,
//         description:
//           "Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice when the Joker causes chaos.",
//         trailer_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
//         image:
//           "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
//         status: "now_showing",
//         createdAt: "2025-07-05T16:42:01.072Z",
//       },
//     },
//     payment: {
//       id: "3dd2ef80-9267-436b-88c3-28d31c046eff",
//       amount: 150000,
//       status: "PAID",
//       stripePaymentId: "pi_cog15ge8k",
//       paidAt: "2025-07-05T16:42:02.440Z",
//       bookingId: "cd6ec1aa-b5bc-44d5-9c50-442a99637c85",
//     },
//   },
// ];

const statusColor = {
  BOOKED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabel = {
  BOOKED: "Đã xác nhận",
  PENDING: "Đang chờ",
  CANCELLED: "Đã hủy",
};

const Bookings = () => {
  const dispatch = useAppDispatch();
  const { userBookings } = useAppSelector((state) => state.booking);
  useEffect(() => {
    dispatch(getUserBookingsThunk())
      .unwrap()
      .catch((err) => {
        console.error("Failed to fetch user bookings:", err);
      });
  }, [dispatch]);
  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-bold mb-6">My booking</h1>

      {userBookings.length === 0 ? (
        <p className="text-center text-muted-foreground">Không có vé nào</p>
      ) : (
        <div className="grid gap-4">
          {userBookings?.map((booking) => (
            <Card key={booking.id} className="border shadow-sm">
              <CardHeader className="flex flex-row justify-between items-center pb-2">
                <div>
                  <CardTitle className="text-lg">
                    {booking.showtime.movie.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.showtime.time[0].start).toLocaleString(
                      "vi-VN",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </p>
                </div>
                <Badge
                  className={
                    statusColor[booking.status as keyof typeof statusColor]
                  }
                >
                  {statusLabel[booking.status as keyof typeof statusLabel]}
                </Badge>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Ghế:</span>{" "}
                  {(() => {
                    try {
                      const seats =
                        typeof booking.seats === "string"
                          ? JSON.parse(booking.seats)
                          : booking.seats;

                      if (!Array.isArray(seats)) return "Không xác định";

                      return seats
                        .map(
                          (seat: { row: string; number: number }) =>
                            `${seat.row}${seat.number}`
                        )
                        .join(", ");
                    } catch (error) {
                      return "Không xác định";
                    }
                  })()}
                </p>

                <p>
                  <span className="font-medium">Tổng tiền:</span> $
                  {booking.totalPrice}
                </p>
                <Button asChild variant="link" className="px-0 text-sm mt-2">
                  <Link to={`/bookings/${booking.id}`}>Xem chi tiết</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
