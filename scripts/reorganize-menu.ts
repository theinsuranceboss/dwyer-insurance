import { db } from "../src/lib/db";

async function reorganize() {
  console.log("🔄 Reorganizing menu items...");

  // Delete all existing menu items
  await db.menuItem.deleteMany({});
  console.log("  Deleted all existing menu items");

  // Create new menu structure:
  // Home | About | Insurance Types (dropdown) | Contact
  // Insurance Types dropdown contains:
  //   - Auto Insurance
  //   - Home Insurance
  //   - Life Insurance
  //   - Business Insurance
  //   - More Insurance (links to #services)

  const home = await db.menuItem.create({
    data: { label: "Home", href: "/", order: 0, visible: true, isDropdown: false, parent: null },
  });

  const about = await db.menuItem.create({
    data: { label: "About", href: "/#about", order: 1, visible: true, isDropdown: false, parent: null },
  });

  // "Insurance Types" dropdown parent
  const insuranceTypes = await db.menuItem.create({
    data: { label: "Insurance Types", href: "#", order: 2, visible: true, isDropdown: true, parent: null },
  });

  const contact = await db.menuItem.create({
    data: { label: "Contact", href: "/#contact", order: 3, visible: true, isDropdown: false, parent: null },
  });

  // Children of "Insurance Types"
  const auto = await db.menuItem.create({
    data: { label: "Auto Insurance", href: "/insurance/auto", order: 0, visible: true, isDropdown: false, parent: insuranceTypes.id },
  });

  const homeIns = await db.menuItem.create({
    data: { label: "Home Insurance", href: "/insurance/home", order: 1, visible: true, isDropdown: false, parent: insuranceTypes.id },
  });

  const life = await db.menuItem.create({
    data: { label: "Life Insurance", href: "/insurance/life", order: 2, visible: true, isDropdown: false, parent: insuranceTypes.id },
  });

  const business = await db.menuItem.create({
    data: { label: "Business Insurance", href: "/insurance/business", order: 3, visible: true, isDropdown: false, parent: insuranceTypes.id },
  });

  const moreInsurance = await db.menuItem.create({
    data: { label: "More Insurance", href: "/#services", order: 4, visible: true, isDropdown: false, parent: insuranceTypes.id },
  });

  console.log("  Created menu structure:");
  console.log(`    Home (${home.id})`);
  console.log(`    About (${about.id})`);
  console.log(`    Insurance Types (${insuranceTypes.id}) [dropdown]`);
  console.log(`      ├─ Auto Insurance (${auto.id})`);
  console.log(`      ├─ Home Insurance (${homeIns.id})`);
  console.log(`      ├─ Life Insurance (${life.id})`);
  console.log(`      ├─ Business Insurance (${business.id})`);
  console.log(`      └─ More Insurance (${moreInsurance.id})`);
  console.log(`    Contact (${contact.id})`);

  // Also add homepage banner settings to SiteSetting if they don't exist
  const bannerSettings = [
    { key: "heroBannerImage", value: "", type: "image", category: "hero", label: "Hero Banner Image URL" },
    { key: "heroBannerOverlay", value: "#001e60", type: "color", category: "hero", label: "Hero Banner Overlay Color" },
    { key: "heroBannerOverlayOpacity", value: "80", type: "size", category: "hero", label: "Hero Banner Overlay Opacity (0-100)" },
    { key: "aboutBgColor", value: "#ffffff", type: "color", category: "about", label: "About Section Background" },
    { key: "servicesBgColor", value: "#f8fafc", type: "color", category: "global", label: "Services Section Background" },
    { key: "footerBgColor", value: "#0e1941", type: "color", category: "footer", label: "Footer Background Color" },
  ];

  for (const setting of bannerSettings) {
    await db.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type, category: setting.category, label: setting.label },
      create: setting,
    });
  }
  console.log("  Added homepage banner/appearance settings");

  console.log("✅ Menu reorganization complete!");
}

reorganize()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
