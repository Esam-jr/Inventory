import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default departments with descriptions
  const adminDepartment = await prisma.department.upsert({
    where: { name: "Administration" },
    update: {},
    create: {
      name: "Administration",
      description: "Central administration and management department",
    },
  });
  const auditDepartment = await prisma.department.upsert({
    where: { name: "Audit" },
    update: {},
    create: {
      name: "Audit",
      description: "Central Audit and management department",
    },
  });

  const publicWorksDept = await prisma.department.upsert({
    where: { name: "Public Works" },
    update: {},
    create: {
      name: "Public Works",
      description:
        "Responsible for infrastructure maintenance and public facilities",
    },
  });

  const healthDept = await prisma.department.upsert({
    where: { name: "Health Services" },
    update: {},
    create: {
      name: "Health Services",
      description: "Public health services and medical facilities management",
    },
  });

  const educationDept = await prisma.department.upsert({
    where: { name: "Education" },
    update: {},
    create: {
      name: "Education",
      description: "Educational institutions and learning resources management",
    },
  });

  // Create admin user
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
  const auditorPassword = await bcrypt.hash("auditor123", 12);

  const auditorUser = await prisma.user.upsert({
    where: { email: "auditor@city.gov" },
    update: {},
    create: {
      email: "auditor@city.gov",
      password: auditorPassword,
      firstName: "System",
      lastName: "Auditor",
      role: "AUDITOR",
      departmentId: auditDepartment.id,
    },
  });

  // Create storekeeper user
  const storekeeperPassword = await bcrypt.hash("store123", 12);
  const storekeeperUser = await prisma.user.upsert({
    where: { email: "storekeeper@city.gov" },
    update: {},
    create: {
      email: "storekeeper@city.gov",
      password: storekeeperPassword,
      firstName: "John",
      lastName: "Doe",
      role: "STOREKEEPER",
      departmentId: adminDepartment.id,
    },
  });

  // Create department head users
  const publicWorksHeadPassword = await bcrypt.hash("dept123", 12);
  const publicWorksHead = await prisma.user.upsert({
    where: { email: "head.publicworks@city.gov" },
    update: {},
    create: {
      email: "head.publicworks@city.gov",
      password: publicWorksHeadPassword,
      firstName: "Sarah",
      lastName: "Engineer",
      role: "DEPARTMENT_HEAD",
      departmentId: publicWorksDept.id,
    },
  });

  const healthHeadPassword = await bcrypt.hash("health123", 12);
  const healthHead = await prisma.user.upsert({
    where: { email: "head.health@city.gov" },
    update: {},
    create: {
      email: "head.health@city.gov",
      password: healthHeadPassword,
      firstName: "Dr. Michael",
      lastName: "Carewell",
      role: "DEPARTMENT_HEAD",
      departmentId: healthDept.id,
    },
  });

  // Create procurement officer user
  const procurementPassword = await bcrypt.hash("procure123", 12);
  const procurementUser = await prisma.user.upsert({
    where: { email: "procurement@city.gov" },
    update: {},
    create: {
      email: "procurement@city.gov",
      password: procurementPassword,
      firstName: "Lisa",
      lastName: "Purchaser",
      role: "PROCUREMENT_OFFICER",
      departmentId: adminDepartment.id,
    },
  });

  // Create some sample categories with descriptions
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
      where: { name: "Cleaning Supplies" },
      update: {},
      create: {
        name: "Cleaning Supplies",
        description: "Cleaning and sanitation materials",
      },
    }),
    prisma.category.upsert({
      where: { name: "Maintenance Tools" },
      update: {},
      create: {
        name: "Maintenance Tools",
        description: "Tools and equipment for facility maintenance",
      },
    }),
    prisma.category.upsert({
      where: { name: "Medical Supplies" },
      update: {},
      create: {
        name: "Medical Supplies",
        description: "Medical equipment and healthcare supplies",
      },
    }),
  ]);

  // Create some sample items with descriptions
  const items = await Promise.all([
    prisma.item.upsert({
      where: { name: "A4 Paper (500 sheets)" },
      update: {},
      create: {
        name: "A4 Paper (500 sheets)",
        description: "Standard A4 copy paper, 500 sheets per ream, 80gsm",
        quantity: 50,
        minQuantity: 10,
        unit: "ream",
        categoryId: categories[0].id,
      },
    }),
    prisma.item.upsert({
      where: { name: "Black Ballpoint Pens" },
      update: {},
      create: {
        name: "Black Ballpoint Pens",
        description: "Standard black ink ballpoint pens, box of 12",
        quantity: 200,
        minQuantity: 50,
        unit: "box",
        categoryId: categories[0].id,
      },
    }),
    prisma.item.upsert({
      where: { name: "Laptop Computer" },
      update: {},
      create: {
        name: "Laptop Computer",
        description:
          'Standard issue laptop for employees, 15.6" display, 8GB RAM',
        quantity: 15,
        minQuantity: 5,
        unit: "unit",
        categoryId: categories[1].id,
      },
    }),
    prisma.item.upsert({
      where: { name: "Disinfectant Spray" },
      update: {},
      create: {
        name: "Disinfectant Spray",
        description: "Surface disinfectant spray, 500ml bottle, citrus scent",
        quantity: 30,
        minQuantity: 15,
        unit: "bottle",
        categoryId: categories[2].id,
      },
    }),
    prisma.item.upsert({
      where: { name: "First Aid Kit" },
      update: {},
      create: {
        name: "First Aid Kit",
        description: "Comprehensive first aid kit for office use, 100 pieces",
        quantity: 25,
        minQuantity: 8,
        unit: "kit",
        categoryId: categories[4].id,
      },
    }),
    prisma.item.upsert({
      where: { name: "Printer Toner Cartridge" },
      update: {},
      create: {
        name: "Printer Toner Cartridge",
        description: "Black toner cartridge for HP LaserJet printers",
        quantity: 18,
        minQuantity: 6,
        unit: "cartridge",
        categoryId: categories[1].id,
      },
    }),
  ]);

  console.log("✅ Seed data created successfully!");
  console.log("\n=== Login Credentials ===");
  console.log("Admin: admin@city.gov / admin123");
  console.log("Storekeeper: storekeeper@city.gov / store123");
  console.log("Public Works Head: head.publicworks@city.gov / dept123");
  console.log("Health Head: head.health@city.gov / health123");
  console.log("Procurement Officer: procurement@city.gov / procure123");
  console.log("\n=== Created Data ===");
  console.log("- Departments:");
  console.log(`  • ${adminDepartment.name}: ${adminDepartment.description}`);
  console.log(`  • ${publicWorksDept.name}: ${publicWorksDept.description}`);
  console.log(`  • ${healthDept.name}: ${healthDept.description}`);
  console.log(`  • ${educationDept.name}: ${educationDept.description}`);
  console.log("- Categories:", categories.map((c) => c.name).join(", "));
  console.log("- Items:", items.map((i) => i.name).join(", "));
  console.log(
    "\nYou can now test all user roles with the provided credentials!"
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
