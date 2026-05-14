import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importData() {
  const data = JSON.parse(fs.readFileSync('./data-export.json', 'utf8'));

  console.log('Clearing existing data...');
  // Clear in reverse order of dependencies
  await prisma.agentInfo.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.pageSection.deleteMany();
  await prisma.insurancePage.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.siteSetting.deleteMany();

  console.log('Importing siteSettings...');
  await prisma.siteSetting.createMany({ data: data.siteSettings });

  console.log('Importing menuItems...');
  await prisma.menuItem.createMany({ data: data.menuItems });

  console.log('Importing insurancePages...');
  await prisma.insurancePage.createMany({ data: data.insurancePages });

  console.log('Importing pageSections...');
  await prisma.pageSection.createMany({ data: data.pageSections });

  console.log('Importing testimonials...');
  await prisma.testimonial.createMany({ data: data.testimonials });

  console.log('Importing faqItems...');
  await prisma.faqItem.createMany({ data: data.faqItems });

  console.log('Importing agentInfo...');
  await prisma.agentInfo.createMany({ data: data.agentInfo });

  console.log('Data migration complete!');
}

importData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
