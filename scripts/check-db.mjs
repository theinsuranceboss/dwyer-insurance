import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function check() {
  const sections = await db.pageSection.findMany();
  sections.forEach(s => console.log(s.section, '| subtitle:', s.subtitle, '| title:', s.title));
  
  const badge = await db.agentInfo.findUnique({ where: { key: 'badge' } });
  console.log('badge:', badge?.value);
  
  const heroSubtitle = await db.siteSetting.findUnique({ where: { key: 'heroSubtitle' } });
  console.log('heroSubtitle setting:', heroSubtitle?.value);
  
  // Fix hero section subtitle
  await db.pageSection.updateMany({
    where: { section: 'hero' },
    data: { subtitle: 'Dwyer Insurance Group' }
  });
  console.log('Fixed hero section subtitle');
}

check().catch(console.error).finally(() => db.$disconnect());
