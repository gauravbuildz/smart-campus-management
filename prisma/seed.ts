import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  // Clean existing data
  await prisma.lostAndFound.deleteMany({});
  await prisma.issue.deleteMany({});
  await prisma.notice.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@campus.edu',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Seed Student user
  const student = await prisma.user.create({
    data: {
      name: 'Student User',
      email: 'student@campus.edu',
      password: studentPassword,
      role: 'STUDENT',
    },
  });

  console.log('Seeded Users:');
  console.log(`- Admin: ${admin.email} (password: admin123)`);
  console.log(`- Student: ${student.email} (password: student123)`);

  // Seed sample Notices
  await prisma.notice.create({
    data: {
      title: 'Annual College Tech Fest 2026',
      description: 'The annual tech festival is scheduled from June 15th to June 18th. Register for events now!',
      category: 'EVENT',
      authorId: admin.id,
    },
  });

  await prisma.notice.create({
    data: {
      title: 'WiFi Upgrade in Hostel Block B',
      description: 'Hostel Block B will experience temporary WiFi outage on May 28th from 10 AM to 2 PM for routine hardware upgrades.',
      category: 'NOTICE',
      authorId: admin.id,
    },
  });

  // Seed sample Issues
  await prisma.issue.create({
    data: {
      title: 'No internet connection in room 302',
      description: 'The WiFi router on the 3rd floor of Hostel Block A is not responding, and there is no internet in rooms 301-305.',
      category: 'WIFI',
      status: 'PENDING',
      studentId: student.id,
    },
  });

  await prisma.issue.create({
    data: {
      title: 'Broken desk in LH-204',
      description: 'One of the front row desks in Lecture Hall 204 has a loose board and needs fixing.',
      category: 'CLASSROOM',
      status: 'RESOLVED',
      studentId: student.id,
    },
  });

  // Seed sample Lost and Found items
  await prisma.lostAndFound.create({
    data: {
      itemName: 'Black Leather Wallet',
      description: 'Found a black leather wallet containing a college ID and some keys near the cafeteria tables.',
      type: 'FOUND',
      status: 'REPORTED',
      location: 'College Cafeteria',
      reporterId: student.id,
    },
  });

  await prisma.lostAndFound.create({
    data: {
      itemName: 'Apple AirPods Pro',
      description: 'Lost my AirPods Pro with a red silicone case yesterday afternoon. Might have left it in the central library reading room.',
      type: 'LOST',
      status: 'REPORTED',
      location: 'Central Library',
      reporterId: student.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
