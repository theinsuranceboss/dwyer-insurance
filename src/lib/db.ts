import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Order of priority for connection strings:
// 1. Vercel Postgres (POSTGRES_PRISMA_URL) - DB is now synced!
// 2. Environment DATABASE_URL (for Netlify/local)
// 3. Verified Supabase pooler fallback (db domain, port 6543, properly encoded password)
const connectionString = 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.DATABASE_URL || 
  "postgres://postgres:ZqfjKZ%21FW5pG8Pj@db.icnznvlgwkagaupnjlit.supabase.co:6543/postgres?pgbouncer=true";

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