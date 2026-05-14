import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Attempt a simple query using the centralized db client
    const result = await db.$queryRaw`SELECT 1 as connection_test`;
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful via centralized client",
      result
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Database connection failed",
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}


