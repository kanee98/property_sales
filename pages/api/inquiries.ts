import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { companyName, contactPerson, email, phone, requirements, budget, attachment } = req.body;
      
      // Store inquiry in the database
      const inquiry = await prisma.inquiry.create({
        data: {
          companyName,
          contactPerson,
          email,
          phone,
          requirements,
          budget,
          attachment,
          status: "New",
        },
      });
      
      // Send admin notification
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: email,
        to: process.env.ADMIN_EMAIL,
        subject: "New Corporate Inquiry Received",
        text: `Company: ${companyName}\nContact: ${contactPerson}\nEmail: ${email}\nPhone: ${phone}\nRequirements: ${requirements}\nBudget: ${budget}`,
      });
      
      res.status(201).json({ message: "Inquiry submitted successfully", inquiry });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
