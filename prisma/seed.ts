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
        price: 350000.0,
        category: "Corporate",
        images: JSON.stringify(["/img/property1.jpg", "/img/property2.jpg"]),
        area: 5000,
        latitude: 6.9271,
        longitude: 79.8612,
        district: "Colombo",
        type: "For Sale",
        manager: "Mr. Fernando",
        contact: "0771234567",
        status: 1,
      },
      {
        title: "Retail Storefront in Kandy",
        description: "Prime location for a retail shop in the heart of Kandy.",
        price: 120000.0,
        category: "Retail",
        images: JSON.stringify(["/img/kandy1.jpg"]),
        area: 5000,
        latitude: 7.2906,
        longitude: 80.6337,
        district: "Kandy",
        type: "For Rent",
        manager: "Ms. Silva",
        contact: "0777654321",
        status: 1,
      },
      {
        title: "Wanted: Small Retail Space in Galle",
        description: "Looking for a 500-700 sqft retail space in Galle Fort area.",
        price: null,
        category: "Retail",
        images: JSON.stringify([]),
        area: 5000,
        latitude: 6.0367,
        longitude: 80.2170,
        district: "Galle",
        type: "Wanted",
        manager: "Mr. Perera",
        contact: "0773332211",
        status: 1,
      },
      {
        title: "For Sale: Commercial Land in Kurunegala",
        description: "Ideal for warehouse or industrial purposes.",
        price: 2200000.0,
        category: "Corporate",
        images: JSON.stringify(["/img/land1.jpg"]),
        area: 5000,
        latitude: 7.4863,
        longitude: 80.3647,
        district: "Kurunegala",
        type: "For Sale",
        manager: "Mr. Gunasekara",
        contact: "0714567890",
        status: 1,
      },
      {
        title: "For Rent: Rooftop Cafe Setup in Nuwara Eliya",
        description: "Ready-to-run cafe with stunning mountain views.",
        price: 150000.0,
        category: "Retail",
        images: JSON.stringify(["/img/cafe1.jpg"]),
        area: 5000,
        latitude: 6.9497,
        longitude: 80.7891,
        district: "Nuwara Eliya",
        type: "For Rent",
        manager: "Ms. Lakmali", 
        contact: "0764455223",
        status: 1,
      },
      {
        title: "Wanted: Warehouse in Gampaha",
        description: "Looking for a 10000 sqft warehouse for logistics business.",
        price: null,
        category: "Corporate",
        images: JSON.stringify([]),
        area: 5000,
        latitude: 7.0873,
        longitude: 79.9998,
        district: "Gampaha",
        type: "Wanted",
        manager: "Mr. Bandara",
        contact: "0778899221",
        status: 1,
      },
      {
        title: "Retail Space for Sale in Matara",
        description: "High footfall zone, perfect for grocery or retail store.",
        price: 950000.0,
        category: "Retail",
        images: JSON.stringify(["/img/matara1.jpg"]),
        area: 5000,
        latitude: 5.9549,
        longitude: 80.5549,
        district: "Matara",
        type: "For Sale",
        manager: "Ms. Jayasinghe",
        contact: "0783344556",
        status: 1,
      },
      {
        title: "For Rent: Office Space in Anuradhapura",
        description: "Central air-conditioned office suitable for a team of 25.",
        price: 175000.0,
        category: "Corporate",
        images: JSON.stringify(["/img/office_apura.jpg"]),
        area: 5000,
        latitude: 8.3114,
        longitude: 80.4037,
        district: "Anuradhapura",
        type: "For Rent",
        manager: "Mr. Dissanayake",
        contact: "0751234567",
        status: 1,
      },
      {
        title: "Wanted: Office Floor in Jaffna",
        description: "IT company looking for a full floor to set up operations.",
        price: null,
        category: "Corporate",
        images: JSON.stringify([]),
        area: 5000,
        latitude: 9.6615,
        longitude: 80.0255,
        district: "Jaffna",
        type: "Wanted",
        manager: "Ms. Suganthi",
        contact: "0745678923",
        status: 1,
      },
      {
        title: "For Sale: Boutique Hotel in Ella",
        description: "Well-maintained 10-room property with scenic views.",
        price: 12500000.0,
        category: "Corporate",
        images: JSON.stringify(["/img/ella_hotel.jpg"]),
        area: 5000,
        latitude: 6.8753,
        longitude: 81.0467,
        district: "Badulla",
        type: "For Sale",
        manager: "Mr. Rathnayake",
        contact: "0721239876",
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
