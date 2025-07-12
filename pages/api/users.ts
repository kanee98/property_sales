import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  status: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          createdAt: true,
          status: true,
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Error fetching users" });
    }
  }

  if (req.method === "PUT") {
    const { id, name, email, role, status } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          name,
          email,
          role,
          status,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({ error: "Error updating user" });
    }
  }

  if (req.method === "POST") {
    const { name, email, password, role, status } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const hashedPassword = await hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          status: Number(status),
        },
      });

      return res.status(201).json(newUser);
    } catch (error: any) {
      console.error("Create error:", error);

      // Handle Prisma duplicate email error
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        (error.meta?.target as string[])?.includes("email")
      ) {
        return res.status(409).json({ error: "Email already in use" });
      }

      return res.status(500).json({ error: "Error creating user" });
    }
  }

if (req.method === "DELETE") {
  const id = Number(req.query.id);

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status: 0 },
    });

    return res.status(200).json({ message: "User status updated to inactive", user: updatedUser });
  } catch (error) {
    console.error("Soft delete error:", error);
    return res.status(500).json({ error: "Error updating user status" });
  }
}

  return res.status(405).json({ error: "Method Not Allowed" });
}