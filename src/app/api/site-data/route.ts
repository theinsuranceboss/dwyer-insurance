import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [settings, menuItems, agentInfo, insurancePages, pageSections, testimonials, faqs] =
      await Promise.all([
        db.siteSetting.findMany(),
        db.menuItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
        db.agentInfo.findMany(),
        db.insurancePage.findMany({
          where: { visible: true },
          orderBy: { order: "asc" },
        }),
        db.pageSection.findMany({ where: { visible: true } }),
        db.testimonial.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
        db.faqItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      ]);

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

    // Parse features JSON for insurance pages
    const parsedInsurancePages = insurancePages.map((page) => ({
      ...page,
      features: JSON.parse(page.features) as string[],
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
      { error: "Failed to fetch site data" },
      { status: 500 }
    );
  }
}
