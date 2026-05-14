import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [settings, allMenuItems, agentInfo, insurancePages, pageSections, testimonials, faqs] =
      await Promise.all([
        db.siteSetting.findMany(),
        db.menuItem.findMany({ orderBy: { order: "asc" } }),
        db.agentInfo.findMany(),
        db.insurancePage.findMany({
          where: { visible: true },
          orderBy: { order: "asc" },
        }),
        db.pageSection.findMany({ orderBy: { order: 'asc' } }),
        db.testimonial.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
        db.faqItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      ]);

    // Filter menu items: hide invisible items and children of invisible parents
    const invisibleParentIds = new Set(
      allMenuItems.filter((item) => !item.visible && !item.parent).map((item) => item.id)
    );
    const menuItems = allMenuItems.filter((item) => {
      if (!item.visible) return false;
      // If this is a child item, check if its parent is visible
      if (item.parent && invisibleParentIds.has(item.parent)) return false;
      return true;
    });

    // Convert settings array to key-value map
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    // Convert agentInfo array to key-value map
    const agentInfoMap: Record<string, string> = {};
    for (const a of agentInfo) {
      agentInfoMap[a.key] = a.value;
    }

    // Parse features and custom sections JSON for insurance pages
    const parsedInsurancePages = insurancePages.map((page) => ({
      ...page,
      features: JSON.parse(page.features || "[]") as string[],
      customSections: JSON.parse((page as any).customSections || "[]") as any[],
    }));

    return NextResponse.json({
      settings: settingsMap,
      menuItems,
      agentInfo: agentInfoMap,
      insurancePages: parsedInsurancePages,
      pageSections,
      testimonials,
      faqs,
    });
  } catch (error) {
    console.error("Error fetching site data:", error);
    return NextResponse.json(
      { error: "Failed to fetch site data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
