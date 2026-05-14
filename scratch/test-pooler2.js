const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgres://postgres.icnznvlgwkagaupnjlit:ZqfjKZ%21FW5pG8Pj@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
    }
  }
});
async function test() {
  try {
    const res = await prisma.$queryRawUnsafe('SELECT 1 as test');
    console.log('SUCCESS:', res);
  } catch(e) {
    console.log('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
