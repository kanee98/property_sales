import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const passwordHash = await bcrypt.hash("password123", 10);
  await prisma.user.createMany({
    data: [
      {
        name: "Admin User",
        email: "admin@propwise.lk",
        password: passwordHash,
        role: "admin",
        status: 1,
      },
      {
        name: "Staff Member",
        email: "staff@propwise.lk",
        password: passwordHash,
        role: "staff",
        status: 1,
      },
    ],
  });

  // Seed Properties
  await prisma.property.createMany({
    data: [
      {
        title: "Corporate Office Space in Colombo",
        description: "Spacious office space with modern facilities in Colombo 7.",
        price: 350000.00,
        category: "Corporate",
        images: JSON.stringify(["/img/property1.jpg", "/img/property2.jpg"]),
        latitude: 6.9271,
        longitude: 79.8612,
        district: "Colombo",
        type: "For Sale",
        manager: "Mr. Fernando - 0771234567",
        status: 1,
      },
      {
        title: "Retail Storefront in Kandy",
        description: "Prime location for a retail shop in the heart of Kandy.",
        price: 120000.00,
        category: "Retail",
        images: JSON.stringify(["/img/kandy1.jpg"]),
        latitude: 7.2906,
        longitude: 80.6337,
        district: "Kandy",
        type: "For Rent",
        manager: "Ms. Silva - 0777654321",
        status: 1,
      },
    ],
  });

  // Seed Inquiries
  await prisma.inquiry.createMany({
    data: [
      {
        companyName: "ABC Holdings",
        contactPerson: "John Doe",
        email: "contact@abcholdings.com",
        phone: "0771122334",
        requirements: "Looking for 5000 sqft office space in Colombo.",
        budget: 500000.00,
        attachments: JSON.stringify([]),
        status: 1,
      },
      {
        companyName: "XYZ Enterprises",
        contactPerson: "Jane Smith",
        email: "jane@xyz.com",
        phone: "0766655443",
        requirements: "Need a showroom in Kandy for electronics.",
        budget: 150000.00,
        attachments: JSON.stringify([]),
        status: 1,
      },
    ],
  });

  console.log("Seeding completed ✅");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
