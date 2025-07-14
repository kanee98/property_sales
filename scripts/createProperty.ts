import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createProperties() {
  const properties = [
    {
      title: "Downtown Office",
      description: "Spacious corporate office in the heart of the city.",
      price: 500000,
      category: "Corporate",
      images: ["https://via.placeholder.com/400"],
      latitude: 40.7128,
      longitude: -74.006,
      type: "Corporate",
      manager: "John Doe",
      contact: "+1 234 567 890",
      district: "Colombo",
      status: 1,
    },
    {
      title: "Mall Retail Space",
      description: "Prime retail space inside a popular mall.",
      price: 300000,
      category: "Retail",
      images: ["https://via.placeholder.com/400"],
      latitude: 34.0522,
      longitude: -118.2437,
      type: "Retail",
      manager: "Jane Smith",
      contact: "+1 987 654 321",
      district: "Gampaha",
      status: 1,
    },
    {
      title: "Luxury Apartment",
      description: "A beautiful apartment in the city center.",
      price: 750000,
      category: "Residential",
      images: ["https://via.placeholder.com/400"],
      latitude: 51.5074,
      longitude: -0.1278,
      type: "Residential",
      manager: "Alice Johnson",
      contact: "+44 123 456 789",
      district: "Kandy",
      status: 1,
    },
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: {
        ...property,
        images: JSON.stringify(property.images), // Ensuring proper JSON format
      },
    });
  }

  console.log("Properties created!");
}

createProperties()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
