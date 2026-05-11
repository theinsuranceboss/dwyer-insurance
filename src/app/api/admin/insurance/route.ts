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
    const insurancePages = await db.insurancePage.findMany({
      orderBy: { order: "asc" },
    });
    // Parse features JSON for each page
    const parsed = insurancePages.map((page) => ({
      ...page,
      features: JSON.parse(page.features) as string[],
    }));
    return NextResponse.json({ insurancePages: parsed });
  } catch (error) {
    console.error("Error fetching insurance pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch insurance pages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { slug, title, tagline, description, features, tip, iconColor, iconBgColor, iconName, order, visible, bannerImage, bannerColorFrom, bannerColorTo, backgroundColor, cardAccentColor, textColor } = body as {
      slug: string;
      title: string;
      tagline?: string;
      description?: string;
      features?: string[];
      tip?: string;
      iconColor?: string;
      iconBgColor?: string;
      iconName?: string;
      order?: number;
      visible?: boolean;
      bannerImage?: string;
      bannerColorFrom?: string;
      bannerColorTo?: string;
      backgroundColor?: string;
      cardAccentColor?: string;
      textColor?: string;
    };

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug and title are required" },
        { status: 400 }
      );
    }

    const insurancePage = await db.insurancePage.create({
      data: {
        slug,
        title,
        tagline: tagline ?? "",
        description: description ?? "",
        features: JSON.stringify(features ?? []),
        tip: tip ?? "",
        iconColor: iconColor ?? "#0033A0",
        iconBgColor: iconBgColor ?? "#e8edf5",
        iconName: iconName ?? "Shield",
        order: order ?? 0,
        visible: visible ?? true,
        bannerImage: bannerImage ?? "",
        bannerColorFrom: bannerColorFrom ?? "",
        bannerColorTo: bannerColorTo ?? "",
        backgroundColor: backgroundColor ?? "",
        cardAccentColor: cardAccentColor ?? "",
        textColor: textColor ?? "",
      },
    });

    return NextResponse.json(
      { insurancePage: { ...insurancePage, features: JSON.parse(insurancePage.features) } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating insurance page:", error);
    return NextResponse.json(
      { error: "Failed to create insurance page" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, slug, title, tagline, description, features, tip, iconColor, iconBgColor, iconName, order, visible, bannerImage, bannerColorFrom, bannerColorTo, backgroundColor, cardAccentColor, textColor } = body as {
      id: string;
      slug?: string;
      title?: string;
      tagline?: string;
      description?: string;
      features?: string[];
      tip?: string;
      iconColor?: string;
      iconBgColor?: string;
      iconName?: string;
      order?: number;
      visible?: boolean;
      bannerImage?: string;
      bannerColorFrom?: string;
      bannerColorTo?: string;
      backgroundColor?: string;
      cardAccentColor?: string;
      textColor?: string;
    };

    if (!id) {
      return NextResponse.json(
        { error: "Insurance page ID is required" },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (slug !== undefined) data.slug = slug;
    if (title !== undefined) data.title = title;
    if (tagline !== undefined) data.tagline = tagline;
    if (description !== undefined) data.description = description;
    if (features !== undefined) data.features = JSON.stringify(features);
    if (tip !== undefined) data.tip = tip;
    if (iconColor !== undefined) data.iconColor = iconColor;
    if (iconBgColor !== undefined) data.iconBgColor = iconBgColor;
    if (iconName !== undefined) data.iconName = iconName;
    if (order !== undefined) data.order = order;
    if (visible !== undefined) data.visible = visible;
    if (bannerImage !== undefined) data.bannerImage = bannerImage;
    if (bannerColorFrom !== undefined) data.bannerColorFrom = bannerColorFrom;
    if (bannerColorTo !== undefined) data.bannerColorTo = bannerColorTo;
    if (backgroundColor !== undefined) data.backgroundColor = backgroundColor;
    if (cardAccentColor !== undefined) data.cardAccentColor = cardAccentColor;
    if (textColor !== undefined) data.textColor = textColor;

    const insurancePage = await db.insurancePage.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      insurancePage: { ...insurancePage, features: JSON.parse(insurancePage.features) },
    });
  } catch (error) {
    console.error("Error updating insurance page:", error);
    return NextResponse.json(
      { error: "Failed to update insurance page" },
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
        { error: "Insurance page ID is required" },
        { status: 400 }
      );
    }

    await db.insurancePage.delete({ where: { id } });

    return NextResponse.json({ message: "Insurance page deleted successfully" });
  } catch (error) {
    console.error("Error deleting insurance page:", error);
    return NextResponse.json(
      { error: "Failed to delete insurance page" },
      { status: 500 }
    );
  }
}
