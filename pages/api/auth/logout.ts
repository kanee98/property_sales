import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", serialize("adminToken", "", { path: "/", httpOnly: true, maxAge: 0 }));

  return res.status(200).json({ message: "Logged out" });
}
