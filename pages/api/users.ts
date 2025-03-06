import { NextApiRequest, NextApiResponse } from "next";

export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
  };

let users:  User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "User" },
    { id: 2, name: "Admin User", email: "admin@example.com", role: "Admin" },
  ];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(users);
  }
}