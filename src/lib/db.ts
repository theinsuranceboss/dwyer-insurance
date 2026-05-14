import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use the verified working Supabase connection directly
const DB_URL = process.env.DATABASE_URL || 
               "postgres://postgres:ZqfjKZ!FW5pG8Pj@db.icnznvlgwkagaupnjlit.supabase.co:5432/postgres"

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: DB_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db