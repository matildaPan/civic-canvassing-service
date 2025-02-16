import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "hashedpassword",
      role: "ADMIN",
    },
  });

  await prisma.household.createMany({
    data: [
      { address: "123 Main St", completed: false },
      { address: "456 Oak St", completed: false },
    ],
  });

  console.log("✅ Database seeded!");
}

seed().finally(() => prisma.$disconnect());
