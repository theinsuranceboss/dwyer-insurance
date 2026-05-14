import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
  const data = {
    siteSettings: await prisma.siteSetting.findMany(),
    menuItems: await prisma.menuItem.findMany(),
    insurancePages: await prisma.insurancePage.findMany(),
    pageSections: await prisma.pageSection.findMany(),
    testimonials: await prisma.testimonial.findMany(),
    faqItems: await prisma.faqItem.findMany(),
    agentInfo: await prisma.agentInfo.findMany(),
  };

  fs.writeFileSync('./data-export.json', JSON.stringify(data, null, 2));
  console.log('Data exported to data-export.json');
}

exportData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
