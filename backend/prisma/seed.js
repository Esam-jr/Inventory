import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminDepartment = await prisma.department.upsert({
    where: { name: "Administration" },
    update: {},
    create: {
      name: "Administration",
      description: "System administration department",
    },
  });

  const hashedPassword = await bcrypt.hash("admin123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@city.gov" },
    update: {},
    create: {
      email: "admin@city.gov",
      password: hashedPassword,
      firstName: "System",
      lastName: "Administrator",
      role: "ADMIN",
      departmentId: adminDepartment.id,
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Office Supplies" },
      update: {},
      create: {
        name: "Office Supplies",
        description: "General office stationery and supplies",
      },
    }),
    prisma.category.upsert({
      where: { name: "IT Equipment" },
      update: {},
      create: {
        name: "IT Equipment",
        description: "Computers, printers, and IT accessories",
      },
    }),
    prisma.category.upsert({
      where: { name: "Maintenance" },
      update: {},
      create: {
        name: "Maintenance",
        description: "Building and equipment maintenance supplies",
      },
    }),
  ]);

  console.log("Seed data created:");
  console.log("- Admin user: admin@city.gov / admin123");
  console.log("- Departments: Administration");
  console.log("- Categories:", categories.map((c) => c.name).join(", "));
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
