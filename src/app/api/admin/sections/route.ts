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
    const pageSections = await db.pageSection.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json({ pageSections });
  } catch (error) {
    console.error("Error fetching page sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch page sections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { section, title, subtitle, description, content, visible, order } = body;

    const pageSection = await db.pageSection.create({
      data: {
        section: section || "custom",
        title: title || "New Section",
        subtitle: subtitle || "",
        description: description || "",
        content: content || "{}",
        visible: visible !== undefined ? visible : true,
        order: order !== undefined ? order : 0,
      },
    });

    return NextResponse.json({ pageSection });
  } catch (error) {
    console.error("Error creating page section:", error);
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, title, subtitle, description, content, visible, order } = body as {
      id: string;
      title?: string;
      subtitle?: string;
      description?: string;
      content?: string;
      visible?: boolean;
      order?: number;
    };

    if (!id) {
      return NextResponse.json(
        { error: "Section ID is required" },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (subtitle !== undefined) data.subtitle = subtitle;
    if (description !== undefined) data.description = description;
    if (content !== undefined) data.content = content;
    if (visible !== undefined) data.visible = visible;
    if (order !== undefined) data.order = order;

    const pageSection = await db.pageSection.update({
      where: { id },
      data,
    });

    return NextResponse.json({ pageSection });
  } catch (error) {
    console.error("Error updating page section:", error);
    return NextResponse.json(
      { error: "Failed to update page section" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Section ID is required" },
        { status: 400 }
      );
    }

    await db.pageSection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page section:", error);
    return NextResponse.json(
      { error: "Failed to delete page section" },
      { status: 500 }
    );
  }
}
