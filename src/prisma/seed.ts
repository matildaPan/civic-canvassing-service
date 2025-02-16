import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: "admin@example.com",
          password: "hashedpassword",
          role: "ADMIN",
        },
      });
      console.log("✅ Admin user created");
    } else {
      console.log("⚠️ Admin user already exists, skipping...");
    }

    await prisma.household.createMany({
      data: [
        { address: "123 Main St", completed: false },
        { address: "456 Oak St", completed: false },
      ],
      skipDuplicates: true, // Prevents duplicate errors
    });

    console.log("✅ Households seeded!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
