import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Order of priority for connection strings:
// Ignore Vercel's out-of-sync database and use the master Supabase database.
// The password is properly URL-encoded (%21 instead of !) to prevent connection parsing errors.
const connectionString = "postgres://postgres:ZqfjKZ%21FW5pG8Pj@db.icnznvlgwkagaupnjlit.supabase.co:5432/postgres";


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