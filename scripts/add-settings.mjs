import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function addNewSettings() {
  const newSettings = [
    // Navigation transparency
    { key: 'navBgOpacity', value: '0', type: 'size', category: 'global', label: 'Nav Background Opacity (0=transparent, 100=solid)' },
    // Hero text sizes
    { key: 'heroTitleSize', value: '52', type: 'size', category: 'hero', label: 'Hero Title Font Size (px)' },
    { key: 'heroDescSize', value: '20', type: 'size', category: 'hero', label: 'Hero Description Font Size (px)' },
    // Hero image positioning
    { key: 'heroBannerImagePosition', value: 'center center', type: 'text', category: 'hero', label: 'Hero Banner Image Position (e.g. center center, top center)' },
    { key: 'heroBannerImageSize', value: 'cover', type: 'text', category: 'hero', label: 'Hero Banner Image Size (cover, contain, 120%)' },
    // Hero CTA button text (these already exist but making sure)
    { key: 'heroCtaText', value: 'Get a Free Quote', type: 'text', category: 'hero', label: 'Hero CTA Button Text' },
    { key: 'heroCta2Text', value: 'Call Now', type: 'text', category: 'hero', label: 'Hero CTA 2 Button Text' },
  ];

  for (const s of newSettings) {
    await db.siteSetting.upsert({
      where: { key: s.key },
      update: { label: s.label, type: s.type, category: s.category },
      create: s,
    });
    console.log('upserted:', s.key);
  }
  console.log('Done!');
}

addNewSettings().catch(console.error).finally(() => db.$disconnect());
