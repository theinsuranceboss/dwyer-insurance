import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Order of priority for connection strings:
// Use the validated Supabase pooler URL (port 6543) on the db domain to bypass Vercel/Netlify port 5432 restrictions.
// The password is properly URL-encoded (%21 instead of !).
const connectionString = "postgres://postgres:ZqfjKZ%21FW5pG8Pj@db.icnznvlgwkagaupnjlit.supabase.co:6543/postgres?pgbouncer=true";


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