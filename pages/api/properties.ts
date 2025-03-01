import { NextApiRequest, NextApiResponse } from "next";

// Mock data for now (Replace with Database call)
let properties = [
  {
    id: 1,
    name: "Downtown Office",
    description: "Spacious corporate office in the heart of the city.",
    price: 500000,
    image: "https://via.placeholder.com/400",
    latitude: 40.7128,
    longitude: -74.006,
    type: "Corporate",
  },
  {
    id: 2,
    name: "Mall Retail Space",
    description: "Prime retail space inside a popular mall.",
    price: 300000,
    image: "https://via.placeholder.com/400",
    latitude: 34.0522,
    longitude: -118.2437,
    type: "Retail",
  },
  {
    id: 3,
    name: "Mall Retail Space",
    description: "Prime retail space inside a popular mall.",
    price: 300000,
    image: "https://via.placeholder.com/400",
    latitude: 34.0522,
    longitude: -118.2437,
    type: "Retail",
  },
  {
    id: 4,
    name: "Mall Retail Space",
    description: "Prime retail space inside a popular mall.",
    price: 300000,
    image: "https://via.placeholder.com/400",
    latitude: 34.0522,
    longitude: -118.2437,
    type: "Retail",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(properties);
  }

  if (req.method === "POST") {
    const { name, description, price, image, latitude, longitude, type } = req.body;
    const newProperty = { id: properties.length + 1, name, description, price, image, latitude, longitude, type };
    properties.push(newProperty);
    return res.status(201).json(newProperty);
  }

  if (req.method === "PUT") {
    const { id, name, description, price, image, latitude, longitude, type } = req.body;
    properties = properties.map((p) => (p.id === id ? { ...p, name, description, price, image, latitude, longitude, type } : p));
    return res.status(200).json({ id, name, description, price, type });
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    properties = properties.filter((p) => p.id !== id);
    return res.status(200).json({ message: "Property deleted" });
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}