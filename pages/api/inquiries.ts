import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const inquiries = await prisma.inquiry.findMany();
      return res.status(200).json(inquiries);
    } catch (error) {
      console.error("GET error:", error);
      return res.status(500).json({ error: "Error fetching inquiries" });
    }
  }

  if (req.method === "POST") {
    const { companyName, contactPerson, email, phone, requirements, budget, attachments, status } = req.body;

    try {
      const newInquiry = await prisma.inquiry.create({
        data: {
          companyName,
          contactPerson,
          email,
          phone,
          requirements,
          budget: budget ?? null,
          attachments: attachments ? JSON.stringify(attachments) : null,
          status,
        },
      });
      return res.status(201).json(newInquiry);
    } catch (error) {
      console.error("POST error:", error);
      return res.status(500).json({ error: "Error creating inquiry" });
    }
  }

  if (req.method === "PUT") {
    const { id, companyName, contactPerson, email, phone, requirements, budget, attachments, status } = req.body;

    try {
      const updatedInquiry = await prisma.inquiry.update({
        where: { id },
        data: {
          companyName,
          contactPerson,
          email,
          phone,
          requirements,
          budget: budget ?? null,
          attachments: attachments ? JSON.stringify(attachments) : null,
          status,
        },
      });
      return res.status(200).json(updatedInquiry);
    } catch (error) {
      console.error("PUT error:", error);
      return res.status(500).json({ error: "Error updating inquiry" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      await prisma.inquiry.delete({ where: { id } });
      return res.status(200).json({ message: "Inquiry deleted" });
    } catch (error) {
      console.error("DELETE error:", error);
      return res.status(500).json({ error: "Error deleting inquiry" });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
