import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Order of priority for connection strings:
// 1. Vercel Postgres (if available)
// 2. Environment DATABASE_URL (if set)
// 3. Hardcoded Supabase pooler fallback (Port 6543 is safer for serverless)
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