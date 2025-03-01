import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("adminpassword", 10);
  
  await prisma.admin.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  console.log("Admin created!");
}

createAdmin();