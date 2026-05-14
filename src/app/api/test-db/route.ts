import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL || "NOT SET"
  });
}


