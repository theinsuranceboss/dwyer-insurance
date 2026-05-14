import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function fixDescriptions() {
  const pages = await db.insurancePage.findMany();
  for (const page of pages) {
    if (page.description.toLowerCase().includes('allstate')) {
      const newDesc = page.description.replace(/allstate/gi, 'Dwyer Insurance Group');
      await db.insurancePage.update({
        where: { id: page.id },
        data: { description: newDesc }
      });
      console.log(`Updated ${page.title}`);
    }
  }
  console.log('Done fixing descriptions!');
}

fixDescriptions().catch(console.error).finally(() => db.$disconnect());
