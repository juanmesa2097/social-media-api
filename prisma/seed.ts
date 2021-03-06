import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      password: '$2b$10$1XVF0bILGrFGHPMQbtp/betn.OojId7b1omrrqNp1el8AEcBSXquO', // FirstPassword123
      role: 'USER',
      profile: {
        create: {
          firstName: 'Alice',
          lastName: 'Parker',
          bio: `This is Alice's bio`,
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      password: '$2b$10$EpreVGbl.d0qzfmGZwWb3.gdiDD4biBMs4kP5PJWCt3wveclHzoV2', // SecondPassword123
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'Bob',
          lastName: 'Jones',
        },
      },
    },
  });

  console.log({ alice, bob });

  await prisma.tag.deleteMany();

  const tags = await prisma.tag.createMany({
    data: [
      { name: 'Featured' },
      { name: 'Sports' },
      { name: 'Music' },
      { name: 'Movies' },
      { name: 'Traveling' },
      { name: 'Food' },
      { name: 'LifeStyle' },
      { name: 'Health' },
      { name: 'Science' },
      { name: 'Nature' },
      { name: 'Web' },
      { name: 'Engineering' },
      { name: 'Art' },
      { name: 'Fashion' },
    ],
  });

  console.log(tags);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
