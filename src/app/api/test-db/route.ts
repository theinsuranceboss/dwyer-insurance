import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const envInfo = {
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? "DEFINED" : "UNDEFINED",
    DATABASE_URL: process.env.DATABASE_URL ? "DEFINED" : "UNDEFINED",
    SUPABASE_DATABASE_URL: process.env.SUPABASE_DATABASE_URL ? "DEFINED" : "UNDEFINED",
  };
  
  try {
    // Perform a simple query to verify connection
    const result = await db.$queryRaw`SELECT 1 as connection_test`;
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      result, 
      env: envInfo 
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Database connection failed",
      error: error.message, 
      code: error.code,
      env: envInfo,
      stack: error.stack
    }, { status: 500 });
  }
}

