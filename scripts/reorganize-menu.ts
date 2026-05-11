import { db } from '../src/lib/db';

async function main() {
  // Delete all existing menu items
  await db.menuItem.deleteMany({});

  // Create top-level items first (we need their IDs for children)
  const home = await db.menuItem.create({
    data: { label: 'Home', href: '/', order: 0, visible: true, isDropdown: false, parent: null },
  });

  const about = await db.menuItem.create({
    data: { label: 'About', href: '/#about', order: 1, visible: true, isDropdown: false, parent: null },
  });

  const personalInsurance = await db.menuItem.create({
    data: { label: 'Personal Insurance', href: '#', order: 2, visible: true, isDropdown: true, parent: null },
  });

  const specialtyInsurance = await db.menuItem.create({
    data: { label: 'Specialty Insurance', href: '#', order: 3, visible: true, isDropdown: true, parent: null },
  });

  const protectionMore = await db.menuItem.create({
    data: { label: 'Protection & More', href: '#', order: 4, visible: true, isDropdown: true, parent: null },
  });

  const testimonials = await db.menuItem.create({
    data: { label: 'Testimonials', href: '/#testimonials', order: 5, visible: true, isDropdown: false, parent: null },
  });

  const faq = await db.menuItem.create({
    data: { label: 'FAQ', href: '/#faq', order: 6, visible: true, isDropdown: false, parent: null },
  });

  const contact = await db.menuItem.create({
    data: { label: 'Contact', href: '/#contact', order: 7, visible: true, isDropdown: false, parent: null },
  });

  // Personal Insurance children
  await db.menuItem.createMany({
    data: [
      { label: 'Auto Insurance', href: '/insurance/auto', order: 0, visible: true, isDropdown: false, parent: personalInsurance.id },
      { label: 'Home Insurance', href: '/insurance/home', order: 1, visible: true, isDropdown: false, parent: personalInsurance.id },
      { label: 'Renters Insurance', href: '/insurance/renters', order: 2, visible: true, isDropdown: false, parent: personalInsurance.id },
      { label: 'Condo Insurance', href: '/insurance/condo', order: 3, visible: true, isDropdown: false, parent: personalInsurance.id },
      { label: 'Life Insurance', href: '/insurance/life', order: 4, visible: true, isDropdown: false, parent: personalInsurance.id },
    ],
  });

  // Specialty Insurance children
  await db.menuItem.createMany({
    data: [
      { label: 'Motorcycle', href: '/insurance/motorcycle', order: 0, visible: true, isDropdown: false, parent: specialtyInsurance.id },
      { label: 'Boat Insurance', href: '/insurance/boat', order: 1, visible: true, isDropdown: false, parent: specialtyInsurance.id },
      { label: 'ATV / Off-Road', href: '/insurance/atv', order: 2, visible: true, isDropdown: false, parent: specialtyInsurance.id },
    ],
  });

  // Protection & More children
  await db.menuItem.createMany({
    data: [
      { label: 'Business Insurance', href: '/insurance/business', order: 0, visible: true, isDropdown: false, parent: protectionMore.id },
      { label: 'Flood Insurance', href: '/insurance/flood', order: 1, visible: true, isDropdown: false, parent: protectionMore.id },
      { label: 'Identity Protection', href: '/insurance/identity-protection', order: 2, visible: true, isDropdown: false, parent: protectionMore.id },
      { label: 'Roadside Assistance', href: '/insurance/roadside', order: 3, visible: true, isDropdown: false, parent: protectionMore.id },
    ],
  });

  const count = await db.menuItem.count();
  console.log(`✅ Reorganized menu: ${count} items created`);
  console.log('Structure:');
  console.log('  Home | About | Personal Insurance ▾ | Specialty Insurance ▾ | Protection & More ▾ | Testimonials | FAQ | Contact');
  console.log('  Personal Insurance: Auto, Home, Renters, Condo, Life');
  console.log('  Specialty Insurance: Motorcycle, Boat, ATV/Off-Road');
  console.log('  Protection & More: Business, Flood, Identity Protection, Roadside');
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
