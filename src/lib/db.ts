import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use the transaction pooler (port 6543) which is more reliable in serverless environments
// We prioritize Vercel's native Postgres (Neon) if available, then fallback to Supabase Pooler
const connectionString = 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.DATABASE_URL || 
  "postgres://postgres.icnznvlgwkagaupnjlit:ZqfjKZ%21FW5pG8Pj@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db


