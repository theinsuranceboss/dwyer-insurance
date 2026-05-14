import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const result = await db.$queryRaw`SELECT 1 as connection_test`;
    return NextResponse.json({ success: true, message: "Database connection successful", result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Database connection failed", error: error.message }, { status: 500 });
  }
}


