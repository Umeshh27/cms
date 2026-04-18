import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');
  
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.user.create({
    data: {
      email: 'test.user@example.com',
      password: 'Password123!', 
    },
  });

  for (let i = 1; i <= 20; i++) {
    await prisma.product.create({
      data: {
        cmsId: `cms-prod-${i}`,
        slug: `product-${i}`,
        name: `Incredible Product ${i}`,
        description: `This is a comprehensive description for product ${i}. It features amazing quality and performance.`,
        price: Number((Math.random() * 100 + 10).toFixed(2)),
        stock: Math.floor(Math.random() * 50) + 1,
        imageUrl: `https://via.placeholder.com/300?text=Product+${i}`,
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
