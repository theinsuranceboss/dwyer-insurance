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
    const faqs = await db.faqItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("Error fetching FAQ items:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { question, answer, order, visible } = body as {
      question: string;
      answer: string;
      order?: number;
      visible?: boolean;
    };

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    const faq = await db.faqItem.create({
      data: {
        question,
        answer,
        order: order ?? 0,
        visible: visible ?? true,
      },
    });

    return NextResponse.json({ faq }, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, question, answer, order, visible } = body as {
      id: string;
      question?: string;
      answer?: string;
      order?: number;
      visible?: boolean;
    };

    if (!id) {
      return NextResponse.json(
        { error: "FAQ item ID is required" },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (question !== undefined) data.question = question;
    if (answer !== undefined) data.answer = answer;
    if (order !== undefined) data.order = order;
    if (visible !== undefined) data.visible = visible;

    const faq = await db.faqItem.update({
      where: { id },
      data,
    });

    return NextResponse.json({ faq });
  } catch (error) {
    console.error("Error updating FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ item" },
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
        { error: "FAQ item ID is required" },
        { status: 400 }
      );
    }

    await db.faqItem.delete({ where: { id } });

    return NextResponse.json({ message: "FAQ item deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ item" },
      { status: 500 }
    );
  }
}
