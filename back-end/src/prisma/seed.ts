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
      {
        title: 'Interstellar',
        genre: 'Sci-Fi',
        duration: 169,
        description: 'Explorers travel through a wormhole in space.',
        image: 'https://example.com/interstellar.jpg',
      },
      {
        title: 'The Dark Knight',
        genre: 'Action',
        duration: 152,
        description: 'Batman faces off against the Joker.',
        image: 'https://example.com/darkknight.jpg',
      },
      {
        title: 'Finding Nemo',
        genre: 'Animation',
        duration: 100,
        description: 'A clownfish searches for his missing son.',
        image: 'https://example.com/nemo.jpg',
      },
      {
        title: 'Titanic',
        genre: 'Romance',
        duration: 195,
        description: 'A love story unfolds on the doomed ship.',
        image: 'https://example.com/titanic.jpg',
      },
      {
        title: 'Shrek',
        genre: 'Comedy',
        duration: 90,
        description: 'An ogre rescues a princess.',
        image: 'https://example.com/shrek.jpg',
      },
      {
        title: 'The Matrix',
        genre: 'Sci-Fi',
        duration: 136,
        description: 'A hacker learns about the true nature of reality.',
        image: 'https://example.com/matrix.jpg',
      },
      {
        title: 'Coco',
        genre: 'Animation',
        duration: 105,
        description: 'A boy explores the Land of the Dead.',
        image: 'https://example.com/coco.jpg',
      },
      {
        title: 'Gladiator',
        genre: 'Action',
        duration: 155,
        description: 'A general becomes a gladiator in Rome.',
        image: 'https://example.com/gladiator.jpg',
      },
      {
        title: 'The Lion King',
        genre: 'Animation',
        duration: 88,
        description: 'A lion cub becomes king.',
        image: 'https://example.com/lionking.jpg',
      },
      {
        title: 'La La Land',
        genre: 'Musical',
        duration: 128,
        description: 'A jazz pianist falls for an aspiring actress.',
        image: 'https://example.com/lalaland.jpg',
      },
      {
        title: 'Parasite',
        genre: 'Thriller',
        duration: 132,
        description:
          'A poor family schemes to become employed by a wealthy one.',
        image: 'https://example.com/parasite.jpg',
      },
      {
        title: 'Avengers: Infinity War',
        genre: 'Action',
        duration: 149,
        description: 'Superheroes battle the powerful Thanos.',
        image: 'https://example.com/infinitywar.jpg',
      },
    ],
  });

  console.log({ theater, room });
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
