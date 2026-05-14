const { PrismaClient } = require('@prisma/client');

const regions = [
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-east-2.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-us-west-2.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-ap-northeast-1.pooler.supabase.com',
  'aws-0-ca-central-1.pooler.supabase.com'
];

async function testRegion(region) {
  const url = `postgres://postgres.icnznvlgwkagaupnjlit:ZqfjKZ%21FW5pG8Pj@${region}:6543/postgres?pgbouncer=true`;
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    const res = await prisma.$queryRawUnsafe('SELECT 1 as test');
    console.log(`SUCCESS [${region}]`);
    return true;
  } catch(e) {
    console.log(`FAILED [${region}]:`, e.message.split('\n')[0]);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  for (const r of regions) {
    const success = await testRegion(r);
    if (success) break;
  }
}
run();
