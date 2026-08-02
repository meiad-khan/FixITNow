import { Role } from "../prisma/generated/prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";


async function main() {
  const hashedPassword = await bcrypt.hash("1234", 10);

  // Users

  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "customer1@gmail.com" },
    update: {},
    create: {
      name: "Customer One",
      email: "customer1@gmail.com",
      password: hashedPassword,
      role: Role.CUSTOMER,
    },
  });

  await prisma.user.upsert({
    where: { email: "customer2@gmail.com" },
    update: {},
    create: {
      name: "Customer Two",
      email: "customer2@gmail.com",
      password: hashedPassword,
      role: Role.CUSTOMER,
    },
  });

  const technicianUser1 = await prisma.user.upsert({
    where: { email: "tech1@gmail.com" },
    update: {},
    create: {
      name: "John Technician",
      email: "tech1@gmail.com",
      password: hashedPassword,
      role: Role.TECHNICIAN,
    },
  });

  const technicianUser2 = await prisma.user.upsert({
    where: { email: "tech2@gmail.com" },
    update: {},
    create: {
      name: "Mike Technician",
      email: "tech2@gmail.com",
      password: hashedPassword,
      role: Role.TECHNICIAN,
    },
  });

  const technicianUser3 = await prisma.user.upsert({
    where: { email: "tech3@gmail.com" },
    update: {},
    create: {
      name: "David Technician",
      email: "tech3@gmail.com",
      password: hashedPassword,
      role: Role.TECHNICIAN,
    },
  });

  // Technician Profiles

  const tech1 = await prisma.technicianProfile.upsert({
    where: {
      userId: technicianUser1.id,
    },
    update: {},
    create: {
      userId: technicianUser1.id,
      bio: "Experienced Electrical Technician",
      experienceYears: 5,
      location: "Dhaka",
      availability: {
        saturday: "9AM-5PM",
        sunday: "9AM-5PM",
      },
    },
  });

  const tech2 = await prisma.technicianProfile.upsert({
    where: {
      userId: technicianUser2.id,
    },
    update: {},
    create: {
      userId: technicianUser2.id,
      bio: "Professional Plumbing Expert",
      experienceYears: 7,
      location: "Chattogram",
      availability: {
        monday: "10AM-6PM",
      },
    },
  });

  const tech3 = await prisma.technicianProfile.upsert({
    where: {
      userId: technicianUser3.id,
    },
    update: {},
    create: {
      userId: technicianUser3.id,
      bio: "Home Cleaning Specialist",
      experienceYears: 4,
      location: "Khulna",
      availability: {
        friday: "8AM-4PM",
      },
    },
  });

  // Categories

  const electrical = await prisma.category.upsert({
    where: {
      categoryName: "Electrical",
    },
    update: {},
    create: {
      categoryName: "Electrical",
      description: "Electrical repair and installation",
    },
  });

  const plumbing = await prisma.category.upsert({
    where: {
      categoryName: "Plumbing",
    },
    update: {},
    create: {
      categoryName: "Plumbing",
      description: "Pipe and plumbing services",
    },
  });

  const cleaning = await prisma.category.upsert({
    where: {
      categoryName: "Cleaning",
    },
    update: {},
    create: {
      categoryName: "Cleaning",
      description: "Home cleaning services",
    },
  });

  const painting = await prisma.category.upsert({
    where: {
      categoryName: "Painting",
    },
    update: {},
    create: {
      categoryName: "Painting",
      description: "Professional painting services",
    },
  });

  // Services

  await prisma.service.upsert({
    where: {
      technicianId_serviceName: {
        technicianId: tech1.id,
        serviceName: "Fan Installation",
      },
    },
    update: {},
    create: {
      serviceName: "Fan Installation",
      basePrice: 500,
      technicianId: tech1.id,
      categoryId: electrical.id,
    },
  });

  await prisma.service.upsert({
    where: {
      technicianId_serviceName: {
        technicianId: tech1.id,
        serviceName: "AC Repair",
      },
    },
    update: {},
    create: {
      serviceName: "AC Repair",
      basePrice: 2500,
      technicianId: tech1.id,
      categoryId: electrical.id,
    },
  });

  await prisma.service.upsert({
    where: {
      technicianId_serviceName: {
        technicianId: tech2.id,
        serviceName: "Pipe Repair",
      },
    },
    update: {},
    create: {
      serviceName: "Pipe Repair",
      basePrice: 1200,
      technicianId: tech2.id,
      categoryId: plumbing.id,
    },
  });

  await prisma.service.upsert({
    where: {
      technicianId_serviceName: {
        technicianId: tech2.id,
        serviceName: "House Painting",
      },
    },
    update: {},
    create: {
      serviceName: "House Painting",
      basePrice: 5000,
      technicianId: tech2.id,
      categoryId: painting.id,
    },
  });

  await prisma.service.upsert({
    where: {
      technicianId_serviceName: {
        technicianId: tech3.id,
        serviceName: "Bathroom Cleaning",
      },
    },
    update: {},
    create: {
      serviceName: "Bathroom Cleaning",
      basePrice: 900,
      technicianId: tech3.id,
      categoryId: cleaning.id,
    },
  });

  await prisma.service.upsert({
    where: {
      technicianId_serviceName: {
        technicianId: tech3.id,
        serviceName: "Kitchen Cleaning",
      },
    },
    update: {},
    create: {
      serviceName: "Kitchen Cleaning",
      basePrice: 1000,
      technicianId: tech3.id,
      categoryId: cleaning.id,
    },
  });

  const customer1 = await prisma.user.findUniqueOrThrow({
    where: {
      email: "customer1@gmail.com",
    },
  });

  const customer2 = await prisma.user.findUniqueOrThrow({
    where: {
      email: "customer2@gmail.com",
    },
  });
  const fanInstallation = await prisma.service.findUniqueOrThrow({
    where: {
      technicianId_serviceName: {
        technicianId: tech1.id,
        serviceName: "Fan Installation",
      },
    },
  });

  const acRepair = await prisma.service.findUniqueOrThrow({
    where: {
      technicianId_serviceName: {
        technicianId: tech1.id,
        serviceName: "AC Repair",
      },
    },
  });

  const bathroomCleaning = await prisma.service.findUniqueOrThrow({
    where: {
      technicianId_serviceName: {
        technicianId: tech3.id,
        serviceName: "Bathroom Cleaning",
      },
    },
  });
 

  // Bookings

  await prisma.booking.createMany({
    data: [
      {
        userId: customer1.id,
        serviceId: fanInstallation.id,
        price: 500,
        scheduledAt: new Date("2026-08-10T10:00:00Z"),
        customerNote: "Please come in the morning.",
      },
      {
        userId: customer2.id,
        serviceId: acRepair.id,
        price: 2500,
        scheduledAt: new Date("2026-08-12T02:00:00Z"),
        customerNote: "AC is not cooling properly.",
      },
      {
        userId: customer1.id,
        serviceId: bathroomCleaning.id,
        price: 900,
        scheduledAt: new Date("2026-08-15T09:30:00Z"),
        customerNote: "Deep cleaning required.",
      },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
