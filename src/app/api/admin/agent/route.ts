import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function checkAuth(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (token !== "dwyer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const agentInfo = await db.agentInfo.findMany();
    return NextResponse.json({ agentInfo });
  } catch (error) {
    console.error("Error fetching agent info:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent info" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { items } = body as { items: { key: string; value: string }[] };

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      );
    }

    const updates = items.map((item) =>
      db.agentInfo.upsert({
        where: { key: item.key },
        update: { value: item.value },
        create: { key: item.key, value: item.value },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ message: "Agent info updated successfully" });
  } catch (error) {
    console.error("Error updating agent info:", error);
    return NextResponse.json(
      { error: "Failed to update agent info" },
      { status: 500 }
    );
  }
}
