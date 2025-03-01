import { NextApiRequest, NextApiResponse } from "next";

// Mock data for now (Replace with Database call)
const properties = [
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
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(properties);
}
