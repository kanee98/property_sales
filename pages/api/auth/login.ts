import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { email, password } = req.body;
  const admin = await prisma.user.findUnique({ where: { email } });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  res.setHeader("Set-Cookie", serialize("adminToken", token, { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production" }));

  return res.status(200).json({ message: "Login successful" });
}
