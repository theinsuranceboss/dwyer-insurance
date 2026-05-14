import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Hardcoded verified direct connection — bypasses Netlify/Vercel env var overrides
// The dashboard DATABASE_URL uses a broken pooler; this uses the direct host
const SUPABASE_DIRECT = "postgres://postgres:ZqfjKZ!FW5pG8Pj@db.icnznvlgwkagaupnjlit.supabase.co:5432/postgres"

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: SUPABASE_DIRECT,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
