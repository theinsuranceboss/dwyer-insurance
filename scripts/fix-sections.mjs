import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function fixAll() {
  // Fix services section description
  await db.pageSection.updateMany({
    where: { section: 'services' },
    data: {
      description: 'From auto and home to life and business, Dwyer Insurance Group offers a full range of insurance products to protect every aspect of your life.',
    }
  });
  
  // Fix why choose us section
  await db.pageSection.updateMany({
    where: { section: 'whyChooseUs' },
    data: {
      title: 'Why Families Trust Dwyer Insurance Group',
      description: 'Choosing the right insurance agent makes all the difference. Here\'s why hundreds of families trust Suzanne Dwyer with their protection.',
    }
  });
  
  // Fix ctaBanner
  await db.pageSection.updateMany({
    where: { section: 'ctaBanner' },
    data: {
      description: 'Get a personalized insurance quote from Dwyer Insurance Group today. Bundle and save up to 25% on your premiums!',
    }
  });
  
  // Fix contact section
  await db.pageSection.updateMany({
    where: { section: 'contact' },
    data: {
      description: 'Ready to protect what matters most? Contact Suzanne Dwyer today for a free, no-obligation insurance consultation and quote.',
    }
  });
  
  console.log('All sections updated!');
}

fixAll().catch(console.error).finally(() => db.$disconnect());
