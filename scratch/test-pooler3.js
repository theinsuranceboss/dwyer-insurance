const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgres://postgres:ZqfjKZ%21FW5pG8Pj@db.icnznvlgwkagaupnjlit.supabase.co:6543/postgres?pgbouncer=true'
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
