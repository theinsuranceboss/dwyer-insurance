import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function fixMenu() {
  // Delete all existing menu items and recreate with proper structure
  await db.menuItem.deleteMany();
  console.log('Cleared menu items');
  
  // Create a clean menu: Home, About, Services, Insurance (dropdown), Testimonials, Contact
  const items = [
    { label: 'Home', href: '/', order: 0 },
    { label: 'Services', href: '/#services', order: 1 },
    { label: 'Testimonials', href: '/#testimonials', order: 2 },
    { label: 'About', href: '/about', order: 3 },
    { label: 'Contact', href: '/#contact', order: 4 },
  ];
  
  for (const item of items) {
    await db.menuItem.create({ data: item });
    console.log('Created:', item.label);
  }
  
  console.log('Menu fixed!');
}

fixMenu().catch(console.error).finally(() => db.$disconnect());
