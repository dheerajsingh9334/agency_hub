import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding database...");

  // Check if admin exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "admin" },
  });
  if (existingAdmin) {
    console.log("Admin already exists, skipping seed.");
    return;
  }

  // Create admin
  const adminPassword = await bcrypt.hash("Admin2024!", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@dheeraj.com",
      password: adminPassword,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("Admin created:", admin.email);

  // Create sample employee
  const empPassword = await bcrypt.hash("Employee2024!", 10);
  const employee = await prisma.user.create({
    data: {
      email: "employee@dheeraj.com",
      password: empPassword,
      name: "John Employee",
      role: "employee",
    },
  });
  console.log("Employee created:", employee.email);

  // Create sample client
  const clientPassword = await bcrypt.hash("Client2024!", 10);
  const client = await prisma.user.create({
    data: {
      email: "client@dheeraj.com",
      password: clientPassword,
      name: "Jane Client",
      role: "client",
    },
  });
  console.log("Client created:", client.email);

  // Create a sample service
  const service = await prisma.service.create({
    data: {
      name: "Web Development",
      description: "Full-stack web application development",
    },
  });
  console.log("Service created:", service.name);

  // Create a sample company
  await prisma.clientCompany.create({
    data: {
      name: "TechCorp Ltd",
      createdBy: admin.id,
    },
  });
  console.log("Company created: TechCorp Ltd");

  console.log("\nSeed completed successfully!");
  console.log("\nTest Credentials:");
  console.log("  Admin:    admin@dheeraj.com / Admin2024!");
  console.log("  Employee: employee@dheeraj.com / Employee2024!");
  console.log("  Client:   client@dheeraj.com / Client2024!");
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
