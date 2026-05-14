const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgres://postgres.icnznvlgwkagaupnjlit:ZqfjKZ!FW5pG8Pj@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
    }
  }
});

async function test() {
  try {
    const count = await prisma.siteSetting.count();
    console.log('SUCCESS: Count is', count);
  } catch (e) {
    console.error('FAILURE:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
