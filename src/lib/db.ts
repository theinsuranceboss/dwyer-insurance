import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Default fallback to the verified Supabase direct connection
const DEFAULT_URL = "postgres://postgres:ZqfjKZ!FW5pG8Pj@db.icnznvlgwkagaupnjlit.supabase.co:5432/postgres";

// Prioritize connection strings: 
// 1. Vercel Postgres (POSTGRES_PRISMA_URL) 
// 2. Standard DATABASE_URL 
// 3. Hardcoded fallback
const connectionString = 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.DATABASE_URL || 
  process.env.SUPABASE_DATABASE_URL || 
  DEFAULT_URL;

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

