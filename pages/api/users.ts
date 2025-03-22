import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  status: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Fetch users from the database
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          status: true,
        },
      });

      // Return the users data as JSON
      return res.status(200).json(users);
    } catch (error) {
      // Handle any errors that occur while fetching data
      return res.status(500).json({ error: "Error fetching users" });
    }
  } else {
    // Handle unsupported request methods
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}