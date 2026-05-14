import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const dbUrl = process.env.POSTGRES_PRISMA_URL || process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL || "NOT SET";
  const maskedUrl = dbUrl.replace(/:[^:@]+@/, ":****@");
  
  try {
    const prisma = new PrismaClient();
    const result = await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ success: true, result, dbUrl: maskedUrl });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message, 
      code: error.code,
      dbUrl: maskedUrl,
      envKeys: Object.keys(process.env).filter(k => k.includes('URL') || k.includes('KEY'))
    }, { status: 500 });
  }
}
