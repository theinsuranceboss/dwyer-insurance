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
    const menuItems = await db.menuItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ menuItems });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { label, href, order, visible, isDropdown, parent } = body as {
      label: string;
      href: string;
      order?: number;
      visible?: boolean;
      isDropdown?: boolean;
      parent?: string;
    };

    if (!label || !href) {
      return NextResponse.json(
        { error: "Label and href are required" },
        { status: 400 }
      );
    }

    const menuItem = await db.menuItem.create({
      data: {
        label,
        href,
        order: order ?? 0,
        visible: visible ?? true,
        isDropdown: isDropdown ?? false,
        parent: parent ?? null,
      },
    });

    return NextResponse.json({ menuItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, label, href, order, visible, isDropdown, parent } = body as {
      id: string;
      label?: string;
      href?: string;
      order?: number;
      visible?: boolean;
      isDropdown?: boolean;
      parent?: string;
    };

    if (!id) {
      return NextResponse.json(
        { error: "Menu item ID is required" },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (label !== undefined) data.label = label;
    if (href !== undefined) data.href = href;
    if (order !== undefined) data.order = order;
    if (visible !== undefined) data.visible = visible;
    if (isDropdown !== undefined) data.isDropdown = isDropdown;
    if (parent !== undefined) data.parent = parent;

    const menuItem = await db.menuItem.update({
      where: { id },
      data,
    });

    return NextResponse.json({ menuItem });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id } = body as { id: string };

    if (!id) {
      return NextResponse.json(
        { error: "Menu item ID is required" },
        { status: 400 }
      );
    }

    await db.menuItem.delete({ where: { id } });

    return NextResponse.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
