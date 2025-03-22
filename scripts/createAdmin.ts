import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
  // Hash the password
  const hashedPassword = await bcrypt.hash("adminpassword", 10);

  // Create the admin user
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "Admin",
      status: 1, 
    },
  });

  console.log("Admin created!");
}

createAdmin();