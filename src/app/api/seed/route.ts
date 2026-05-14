import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import data from '../../../../data-export.json';

export async function GET() {
  try {
    console.log('Clearing existing data...');
    // Clear in reverse order of dependencies
    await db.agentInfo.deleteMany();
    await db.faqItem.deleteMany();
    await db.testimonial.deleteMany();
    await db.pageSection.deleteMany();
    await db.insurancePage.deleteMany();
    await db.menuItem.deleteMany();
    await db.siteSetting.deleteMany();

    console.log('Importing siteSettings...');
    await db.siteSetting.createMany({ data: data.siteSettings });

    console.log('Importing menuItems...');
    await db.menuItem.createMany({ data: data.menuItems });

    console.log('Importing insurancePages...');
    await db.insurancePage.createMany({ data: data.insurancePages });

    console.log('Importing pageSections...');
    await db.pageSection.createMany({ data: data.pageSections });

    console.log('Importing testimonials...');
    await db.testimonial.createMany({ data: data.testimonials });

    console.log('Importing faqItems...');
    await db.faqItem.createMany({ data: data.faqItems });

    console.log('Importing agentInfo...');
    await db.agentInfo.createMany({ data: data.agentInfo });

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
