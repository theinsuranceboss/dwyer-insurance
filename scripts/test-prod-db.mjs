import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://postgres:ZqfjKZ!FW5pG8Pj@db.icnznvlgwkagaupnjlit.supabase.co:5432/postgres"
    }
  }
});

async function checkDb() {
  try {
    const count = await prisma.siteSetting.count();
    console.log(`SiteSetting count: ${count}`);
    const first = await prisma.siteSetting.findFirst();
    console.log(`First setting: ${JSON.stringify(first)}`);
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
