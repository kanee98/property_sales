import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const properties = await prisma.property.findMany();
      return res.status(200).json(properties);
    } catch (error) {
      const err = error as Error;

      console.error("Error fetching properties", err);
      return res.status(500).json({ err: "Error fetching properties", message: err.message,
      stack: err.stack, });
    }
  }

  if (req.method === "POST") {
    const { title, description, price, category, images, latitude, longitude, district, type, manager, contact, status } = req.body;

    try {
      const newProperty = await prisma.property.create({
        data: {
          title,
          description,
          price: price ?? null, // Handle nullable price
          category,
          images: JSON.stringify(images), // Store images as JSON
          latitude,
          longitude,
          district,
          type,
          manager,
          contact,
          status,
        },
      });
      return res.status(201).json(newProperty);
    } catch (error) {
      console.error("Error creating property", error);
      return res.status(500).json({ error: "Error creating property" });
    }
  }

  if (req.method === "PUT") {
    const { id, title, description, price, category, images, latitude, longitude, district, type, manager, contact, status } = req.body;

    try {
      const updatedProperty = await prisma.property.update({
        where: { id },
        data: {
          title,
          description,
          price: price ?? null,
          category,
          images: JSON.stringify(images),
          latitude,
          longitude,
          district,
          type,
          manager,
          contact,
          status,
        },
      });
      return res.status(200).json(updatedProperty);
    } catch (error) {
      console.error("Error updating property", error);
      return res.status(500).json({ error: "Error updating property" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      await prisma.property.delete({
        where: { id },
      });
      return res.status(200).json({ message: "Property deleted" });
    } catch (error) {
      console.error("Error deleting property", error);
      return res.status(500).json({ error: "Error deleting property" });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}