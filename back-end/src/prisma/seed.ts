import {
  Booking,
  BookingStatus,
  PaymentStatus,
  PrismaClient,
  Role,
  Room,
  Showtime,
} from '../../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.room.deleteMany();
  await prisma.theater.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Cleared existing data');

  // Seed Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2a$10$LaSmxWB2b68y1gvb77AbhOePyG3Qp5KJl9cL2YktBNLoZc1sQnf6S', // password: admin123
      role: Role.ADMIN,
      phone: '0123456789',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: '$2a$10$LaSmxWB2b68y1gvb77AbhOePyG3Qp5KJl9cL2YktBNLoZc1sQnf6S', // password: user123
      role: Role.USER,
      phone: '0987654321',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: '$2a$10$LaSmxWB2b68y1gvb77AbhOePyG3Qp5KJl9cL2YktBNLoZc1sQnf6S', // password: user123
      role: Role.USER,
      phone: '0123456780',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
  });

  console.log('👥 Created users');

  // Seed Movies
  const movies = await prisma.movie.createMany({
    data: [
      {
        title: 'Avengers: Endgame',
        genre: 'Action',
        duration: 181,
        description:
          "After the devastating events of Avengers: Infinity War, the universe is in ruins. The Avengers assemble once more to reverse Thanos' actions.",
        trailer_url: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        image:
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        status: 'now_showing',
      },
      {
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 148,
        description:
          'A thief who steals corporate secrets through dream-sharing technology is given a task to plant an idea into the mind of a CEO.',
        trailer_url: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        image:
          'https://images.unsplash.com/photo-1489599835382-957593cb2375?w=400&h=600&fit=crop',
        status: 'now_showing',
      },
      {
        title: 'The Dark Knight',
        genre: 'Action',
        duration: 152,
        description:
          'Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice when the Joker causes chaos.',
        trailer_url: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        image:
          'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        status: 'now_showing',
      },
      {
        title: 'Interstellar',
        genre: 'Sci-Fi',
        duration: 169,
        description:
          "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        trailer_url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        image:
          'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
        status: 'now_showing',
      },
      {
        title: 'La La Land',
        genre: 'Musical',
        duration: 128,
        description:
          'A jazz pianist falls for an aspiring actress in Los Angeles.',
        trailer_url: 'https://www.youtube.com/watch?v=0pdqf4P9MB8',
        image:
          'https://images.unsplash.com/photo-1489599835382-957593cb2375?w=400&h=600&fit=crop',
        status: 'now_showing',
      },
      {
        title: 'Parasite',
        genre: 'Thriller',
        duration: 132,
        description:
          'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the Kim clan.',
        trailer_url: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
        image:
          'https://images.unsplash.com/photo-1489599835382-957593cb2375?w=400&h=600&fit=crop',
        status: 'now_showing',
      },
      {
        title: 'Spider-Man: No Way Home',
        genre: 'Action',
        duration: 148,
        description:
          "With Spider-Man's identity revealed, Peter asks Doctor Strange for help. But when a spell goes wrong, foes from other worlds appear.",
        trailer_url: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
        image:
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        status: 'coming_soon',
      },
      {
        title: 'Dune',
        genre: 'Sci-Fi',
        duration: 155,
        description:
          "A noble family's son must protect the most valuable asset and vital element in the galaxy.",
        trailer_url: 'https://www.youtube.com/watch?v=n9xhJrPXop4',
        image:
          'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
        status: 'coming_soon',
      },
    ],
  });

  const createdMovies = await prisma.movie.findMany();
  console.log('🎬 Created movies');

  // Seed Theaters
  const theaters = await prisma.theater.createMany({
    data: [
      {
        name: 'CGV Aeon Mall',
        location: '30 Bo Bao Tan Thang, District 7, Ho Chi Minh City',
        brand: 'CGV',
        brandLogo:
          'https://upload.wikimedia.org/wikipedia/commons/3/32/CGV_logo.svg',
        status: 'active',
      },
      {
        name: 'Lotte Cinema',
        location: '469 Nguyen Huu Tho, District 7, Ho Chi Minh City',
        brand: 'Lotte',
        brandLogo:
          'https://upload.wikimedia.org/wikipedia/en/thumb/1/19/Lotte_logo.svg/2560px-Lotte_logo.svg.png',
        status: 'active',
      },
      {
        name: 'Galaxy Cinema',
        location: '116 Nguyen Du, District 1, Ho Chi Minh City',
        brand: 'Galaxy',
        brandLogo:
          'https://upload.wikimedia.org/wikipedia/vi/2/28/Galaxy_Cinema_logo.png',
        status: 'active',
      },
      {
        name: 'BHD Star',
        location: '191 Hai Ba Trung, District 3, Ho Chi Minh City',
        brand: 'BHD',
        brandLogo:
          'https://upload.wikimedia.org/wikipedia/vi/thumb/f/f3/BHD_Star_Cineplex_logo.svg/2560px-BHD_Star_Cineplex_logo.svg.png',
        status: 'active',
      },
    ],
  });

  const createdTheaters = await prisma.theater.findMany();
  console.log('🏢 Created theaters');

  // Seed Rooms for each theater
  const rooms: Room[] = [];
  for (const theater of createdTheaters) {
    for (let i = 1; i <= 3; i++) {
      const room = await prisma.room.create({
        data: {
          name: `Room ${i}`,
          seatCount: 50,
          theaterId: theater.id,
        },
      });
      rooms.push(room);
    }
  }

  console.log('🎭 Created rooms');

  for (const room of rooms) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    for (const row of rows) {
      const type = ['A', 'B', 'C', 'D'].includes(row) ? 'REGULAR' : 'PREMIUM';
      const price = type === 'REGULAR' ? 100000 : 150000;

      for (let number = 1; number <= 8; number++) {
        await prisma.seat.create({
          data: {
            row,
            number,
            price,
            type,
            roomId: room.id,
          },
        });
      }
    }
  }

  console.log('💺 Created seats');

  const showtimes: Showtime[] = [];
  const now = new Date();

  for (const movie of createdMovies.slice(0, 6)) {
    for (const room of rooms.slice(0, 2)) {
      for (let day = 0; day < 7; day++) {
        for (let time = 0; time < 3; time++) {
          const start = new Date(now);
          start.setDate(now.getDate() + day);
          start.setHours(10 + time * 4, 0, 0, 0);

          const end = new Date(start.getTime() + movie.duration * 60000);

          const timeArray = [
            {
              start: start.toISOString(),
              end: end.toISOString(),
            },
          ];

          const showtime = await prisma.showtime.create({
            data: {
              time: timeArray,
              seats: [],
              isActive: true,
              movieId: movie.id,
              roomId: room.id,
            },
          });

          showtimes.push(showtime);
        }
      }
    }
  }

  console.log('🎫 Created showtimes');

  // Seed Bookings
  const bookings: Booking[] = [];
  for (let i = 0; i < 10; i++) {
    const showtime = showtimes[Math.floor(Math.random() * showtimes.length)];
    const user = [regularUser, user2][Math.floor(Math.random() * 2)];
    const seats = [
      { row: 'A', number: 1 },
      { row: 'B', number: 3 },
      { row: 'C', number: 5 },
    ];

    const booking = await prisma.booking.create({
      data: {
        seats: JSON.stringify(seats),
        totalPrice: 150000, // 150k VND
        status: BookingStatus.CONFIRMED,
        userId: user.id,
        showtimeId: showtime.id,
      },
    });
    bookings.push(booking);
  }

  console.log('📅 Created bookings');

  // Seed Payments
  for (const booking of bookings) {
    await prisma.payment.create({
      data: {
        amount: booking.totalPrice,
        status: PaymentStatus.PAID,
        stripePaymentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
        bookingId: booking.id,
      },
    });
  }

  console.log('💳 Created payments');

  // Seed Bookmarks
  for (const user of [regularUser, user2]) {
    const randomMovies = createdMovies
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    for (const movie of randomMovies) {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          movieId: movie.id,
        },
      });
    }
  }

  console.log('🔖 Created bookmarks');

  // Seed Comments
  for (const movie of createdMovies.slice(0, 4)) {
    for (const user of [regularUser, user2]) {
      await prisma.comment.create({
        data: {
          content: `Great movie! I really enjoyed watching ${movie.title}. The storyline was engaging and the acting was superb.`,
          rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
          userId: user.id,
          movieId: movie.id,
        },
      });
    }
  }

  console.log('💬 Created comments');

  // Seed Notifications
  for (const user of [regularUser, user2]) {
    await prisma.notification.createMany({
      data: [
        {
          message: 'Welcome to our movie booking platform!',
          type: 'welcome',
          isRead: false,
          userId: user.id,
        },
        {
          message: 'New movies are now available for booking!',
          type: 'new_movies',
          isRead: false,
          userId: user.id,
        },
        {
          message: 'Your booking has been confirmed.',
          type: 'booking_confirmed',
          isRead: true,
          userId: user.id,
        },
      ],
    });
  }

  console.log('🔔 Created notifications');

  console.log('✅ Seed completed successfully!');
  console.log('📊 Summary:');
  console.log(`- Users: 3 (1 admin, 2 regular)`);
  console.log(`- Movies: ${createdMovies.length}`);
  console.log(`- Theaters: ${createdTheaters.length}`);
  console.log(`- Rooms: ${rooms.length}`);
  console.log(`- Showtimes: ${showtimes.length}`);
  console.log(`- Bookings: ${bookings.length}`);
  console.log(`- Payments: ${bookings.length}`);
  console.log(`- Bookmarks: 6`);
  console.log(`- Comments: 8`);
  console.log(`- Notifications: 6`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
