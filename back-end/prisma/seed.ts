import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed rạp chiếu
  const theater = await prisma.theater.create({
    data: {
      name: 'Galaxy Cinema Nguyễn Du',
      location: '116 Nguyễn Du, Quận 1, TP.HCM',
    },
  });

  const room = await prisma.room.create({
    data: {
      name: 'Phòng 1',
      seatCount: 30,
      theaterId: theater.id,
    },
  });

  const rows = ['A', 'B', 'C', 'D', 'E'];
  for (const row of rows) {
    for (let number = 1; number <= 6; number++) {
      await prisma.seat.create({
        data: {
          row,
          number,
          roomId: room.id,
        },
      });
    }
  }

  // Seed phim
  await prisma.movie.createMany({
    data: [
      {
        title: 'Avengers: Endgame',
        genre: 'Action',
        duration: 180,
        description: 'Superheroes assemble to fight Thanos.',
        image: 'https://example.com/endgame.jpg',
      },
      {
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 150,
        description: 'A mind-bending thriller by Christopher Nolan.',
        image: 'https://example.com/inception.jpg',
      },
      {
        title: 'Inside Out',
        genre: 'Animation',
        duration: 100,
        description: 'An emotional adventure inside a girl’s mind.',
        image: 'https://example.com/insideout.jpg',
      },
    ],
  });

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect().then(() => {
      console.log('Disconnected');
    });
  });
