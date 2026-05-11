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
    const testimonials = await db.testimonial.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, rating, text, date, order, visible } = body as {
      name: string;
      rating?: number;
      text: string;
      date?: string;
      order?: number;
      visible?: boolean;
    };

    if (!name || !text) {
      return NextResponse.json(
        { error: "Name and text are required" },
        { status: 400 }
      );
    }

    const testimonial = await db.testimonial.create({
      data: {
        name,
        rating: rating ?? 5.0,
        text,
        date: date ?? "",
        order: order ?? 0,
        visible: visible ?? true,
      },
    });

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, name, rating, text, date, order, visible } = body as {
      id: string;
      name?: string;
      rating?: number;
      text?: string;
      date?: string;
      order?: number;
      visible?: boolean;
    };

    if (!id) {
      return NextResponse.json(
        { error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (rating !== undefined) data.rating = rating;
    if (text !== undefined) data.text = text;
    if (date !== undefined) data.date = date;
    if (order !== undefined) data.order = order;
    if (visible !== undefined) data.visible = visible;

    const testimonial = await db.testimonial.update({
      where: { id },
      data,
    });

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
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
        { error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    await db.testimonial.delete({ where: { id } });

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
