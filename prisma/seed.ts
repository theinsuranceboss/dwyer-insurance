import { db } from "../src/lib/db";

async function seed() {
  console.log("🌱 Seeding database...");

  // ─── Agent Info ────────────────────────────────────────────
  const agentInfo = [
    { key: "name", value: "Suzanne Dwyer", label: "Agent Name", type: "text" },
    { key: "title", value: "Insurance Agent", label: "Title", type: "text" },
    { key: "badge", value: "Elite Agent, National Award Winner", label: "Badge", type: "text" },
    { key: "phone", value: "(610) 725-9900", label: "Phone", type: "phone" },
    { key: "phoneLink", value: "tel:+16107259900", label: "Phone Link", type: "url" },
    { key: "textNumber", value: "6107258137", label: "Text Number", type: "phone" },
    { key: "email", value: "suzane@dwyerinsurance.com", label: "Email", type: "email" },
    { key: "address", value: "Wynnewood, PA 19096", label: "Address", type: "text" },
    { key: "states", value: "Pennsylvania, New York, Delaware", label: "Licensed States", type: "text" },
    { key: "languages", value: "English, Spanish", label: "Languages", type: "text" },
    { key: "rating", value: "4.3", label: "Rating", type: "text" },
    { key: "reviewCount", value: "273", label: "Review Count", type: "text" },
    { key: "photo", value: "https://dynl.mktgcdn.com/p/eGJ6ZxW0vXZm01JyMezqui2G48EjpS9dbRdrfygmKvw/450x450.jpg", label: "Agent Photo URL", type: "image" },
    { key: "tagline", value: "Protecting what matters most", label: "Tagline", type: "text" },
  ];

  for (const info of agentInfo) {
    await db.agentInfo.upsert({
      where: { key: info.key },
      update: { value: info.value, label: info.label, type: info.type },
      create: info,
    });
  }

  // ─── Site Settings ─────────────────────────────────────────
  const settings = [
    // Global
    { key: "primaryColor", value: "#0033A0", type: "color", category: "global", label: "Primary Color" },
    { key: "secondaryColor", value: "#001e60", type: "color", category: "global", label: "Secondary Color" },
    { key: "accentColor", value: "#ff9e16", type: "color", category: "global", label: "Accent Color" },
    { key: "lightColor", value: "#57b6ff", type: "color", category: "global", label: "Light Accent Color" },
    { key: "darkColor", value: "#0e1941", type: "color", category: "global", label: "Dark Color" },
    { key: "headingFont", value: "Geist, sans-serif", type: "font", category: "global", label: "Heading Font" },
    { key: "bodyFont", value: "Geist, sans-serif", type: "font", category: "global", label: "Body Font" },
    { key: "baseFontSize", value: "16", type: "size", category: "global", label: "Base Font Size (px)" },
    { key: "headingFontSize", value: "48", type: "size", category: "global", label: "Hero Heading Size (px)" },
    { key: "borderRadius", value: "12", type: "size", category: "global", label: "Border Radius (px)" },
    { key: "siteName", value: "Dwyer Insurance Group", type: "text", category: "global", label: "Site Name" },
    { key: "siteDescription", value: "Home, Life and Car Insurance from Suzanne Dwyer at Dwyer Insurance Group, serving PA, NY, and DE", type: "text", category: "global", label: "Site Description" },
    // Logo & Branding
    { key: "logoUrl", value: "/logo.png", type: "image", category: "branding", label: "Logo Image URL" },
    { key: "logoText", value: "Dwyer Insurance Group", type: "text", category: "branding", label: "Logo Main Text" },
    { key: "logoSubtext", value: "Insurance Agency", type: "text", category: "branding", label: "Logo Sub Text" },
    // Hero
    { key: "heroTitle", value: "Suzanne Dwyer", type: "text", category: "hero", label: "Hero Title" },
    { key: "heroSubtitle", value: "Dwyer Insurance Group", type: "text", category: "hero", label: "Hero Subtitle" },
    { key: "heroDescription", value: "Protecting what matters most to you across Pennsylvania, New York, and Delaware.", type: "text", category: "hero", label: "Hero Description" },
    { key: "heroCtaText", value: "Get a Free Quote", type: "text", category: "hero", label: "Hero CTA Text" },
    { key: "heroCta2Text", value: "Call Now", type: "text", category: "hero", label: "Hero CTA 2 Text" },
    // Hero Appearance
    { key: "heroBannerImage", value: "/hero-family.png", type: "image", category: "hero", label: "Hero Banner Image URL" },
    { key: "heroBannerOverlay", value: "#001e60", type: "color", category: "hero", label: "Hero Banner Overlay Color" },
    { key: "heroBannerOverlayOpacity", value: "70", type: "size", category: "hero", label: "Hero Overlay Opacity (0-100)" },
    // Section Backgrounds
    { key: "aboutBgColor", value: "#ffffff", type: "color", category: "about", label: "About Section Background" },
    { key: "servicesBgColor", value: "#f8fafc", type: "color", category: "services", label: "Services Section Background" },
    { key: "footerBgColor", value: "#001e60", type: "color", category: "footer", label: "Footer Background Color" },
    // Footer
    { key: "footerText", value: "Protecting what matters most — Dwyer Insurance Group", type: "text", category: "footer", label: "Footer Tagline" },
    { key: "footerCopyright", value: "Dwyer Insurance Group. All Rights Reserved.", type: "text", category: "footer", label: "Footer Copyright" },
    // Footer Items (JSON array of {label, href, iconName})
    { key: "footerColumn1Title", value: "Insurance", type: "text", category: "footer", label: "Footer Column 1 Title" },
    { key: "footerColumn2Title", value: "More Services", type: "text", category: "footer", label: "Footer Column 2 Title" },
    { key: "footerColumn3Title", value: "Contact", type: "text", category: "footer", label: "Footer Column 3 Title" },
  ];

  for (const setting of settings) {
    await db.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type, category: setting.category, label: setting.label },
      create: setting,
    });
  }

  // ─── Menu Items (with icons) ───────────────────────────────
  // First clear existing menu items
  await db.menuItem.deleteMany({});

  const menuItems = [
    { label: "Home", href: "/", order: 0, iconName: "" },
    { label: "About", href: "/about", order: 1, iconName: "" },
    { label: "Insurance Types", href: "#", order: 2, isDropdown: true, iconName: "Shield" },
    { label: "Auto Insurance", href: "/insurance/auto", order: 0, parent: " Insurance Types placeholder", iconName: "Car" },
    { label: "Home Insurance", href: "/insurance/home", order: 1, parent: " Insurance Types placeholder", iconName: "Home" },
    { label: "Life Insurance", href: "/insurance/life", order: 2, parent: " Insurance Types placeholder", iconName: "Heart" },
    { label: "Business Insurance", href: "/insurance/business", order: 3, parent: " Insurance Types placeholder", iconName: "Briefcase" },
    { label: "Testimonials", href: "/#testimonials", order: 4, iconName: "" },
    { label: "FAQ", href: "/#faq", order: 5, iconName: "" },
    { label: "Contact", href: "/#contact", order: 6, iconName: "" },
  ];

  // Create parent items first, then children with proper parent IDs
  const parentItems = menuItems.filter(item => !item.parent);
  const childItems = menuItems.filter(item => item.parent);

  const createdParents: Record<string, string> = {};
  for (const item of parentItems) {
    const { parent: _p, ...data } = item;
    const created = await db.menuItem.create({ data });
    createdParents[item.label] = created.id;
  }

  // Create children with proper parent reference
  for (const item of childItems) {
    const parentId = createdParents["Insurance Types"];
    if (parentId) {
      const { parent: _p, ...data } = item;
      await db.menuItem.create({ data: { ...data, parent: parentId } });
    }
  }

  // ─── Insurance Pages ───────────────────────────────────────
  const insurancePages = [
    {
      slug: "auto", title: "Auto Insurance", tagline: "Protection for the road ahead",
      description: "Get comprehensive auto insurance coverage that protects you, your passengers, and your vehicle. From fender benders to major collisions, Dwyer Insurance Group auto insurance has you covered with customizable policies tailored to your needs.",
      features: JSON.stringify(["Liability coverage for bodily injury & property damage", "Collision coverage for vehicle damage", "Comprehensive coverage for non-collision events", "Uninsured/underinsured motorist protection", "Medical payments coverage", "Roadside assistance add-on", "Rental reimbursement coverage"]),
      tip: "Bundle auto with home insurance and save up to 25% on your premium!", iconColor: "#0033A0", iconBgColor: "#e8edf5", iconName: "Car", order: 0,
    },
    {
      slug: "home", title: "Home Insurance", tagline: "Your home, your haven — we protect both",
      description: "Your home is likely your biggest investment. Dwyer Insurance Group homeowners insurance helps protect your home and belongings against covered losses like fire, theft, and severe weather. Suzanne will help you find the right coverage at the right price.",
      features: JSON.stringify(["Dwelling coverage for your home's structure", "Personal property protection", "Liability protection if someone is injured on your property", "Additional living expenses if your home is unlivable", "Other structures coverage (garages, sheds, fences)", "Medical payments to others", "Claims support and guidance"]),
      tip: "Ask about bundling home and auto for maximum savings on your premiums.", iconColor: "#001e60", iconBgColor: "#e0e7f5", iconName: "Home", order: 1,
    },
    {
      slug: "life", title: "Life Insurance", tagline: "Secure your family's future today",
      description: "Life insurance provides financial protection for your loved ones when they need it most. Whether you're looking for term life, whole life, or universal life insurance, Suzanne can help you find a policy that fits your budget and provides peace of mind.",
      features: JSON.stringify(["Term life insurance for affordable, temporary coverage", "Whole life insurance with cash value accumulation", "Universal life insurance with flexible premiums", "Convertible term policies", "Death benefit protection for your beneficiaries", "Tax-advantaged cash value growth", "Estate planning support"]),
      tip: "Term life insurance can be 5-15x more affordable than whole life — perfect for young families!", iconColor: "#c74e10", iconBgColor: "#fef3e8", iconName: "Heart", order: 2,
    },
    {
      slug: "renters", title: "Renters Insurance", tagline: "Your landlord's insurance won't cover your stuff",
      description: "Even if you don't own your home, your personal belongings still need protection. Renters insurance covers your possessions against theft, fire, and other covered perils — often for less than you might think.",
      features: JSON.stringify(["Personal property coverage for belongings", "Liability protection if someone is injured in your home", "Additional living expenses if your rental is damaged", "Medical payments to others", "Coverage for theft, fire, vandalism, and more", "Off-premises theft coverage", "Affordable monthly premiums"]),
      tip: "Renters insurance can cost as little as $15-30/month — less than a streaming subscription!", iconColor: "#0e7490", iconBgColor: "#e6f7fa", iconName: "Building2", order: 3,
    },
    {
      slug: "condo", title: "Condo Insurance", tagline: "Tailored coverage for condo living",
      description: "Condo insurance is different from homeowners insurance because your condo association's master policy covers the building's exterior and common areas. Suzanne will help you understand what's covered and fill in the gaps for your unit.",
      features: JSON.stringify(["Coverage for interior walls and fixtures", "Personal property protection", "Liability coverage", "Loss assessment coverage for shared areas", "Additional living expenses", "Improvements and betterments coverage", "Medical payments to others"]),
      tip: "Review your condo association's master policy to understand exactly what you need to cover.", iconColor: "#7c3aed", iconBgColor: "#f0e8ff", iconName: "Landmark", order: 4,
    },
    {
      slug: "motorcycle", title: "Motorcycle Insurance", tagline: "Ride with confidence and protection",
      description: "Whether you ride a cruiser, sport bike, touring motorcycle, or scooter, Dwyer Insurance Group motorcycle insurance provides the coverage you need. From liability to comprehensive protection, ride knowing you're covered.",
      features: JSON.stringify(["Liability coverage for bodily injury & property damage", "Collision and comprehensive coverage", "Uninsured motorist protection", "Custom parts and equipment coverage", "Roadside assistance for motorcycles", "Guest passenger liability", "Multiple motorcycle discounts"]),
      tip: "Store your bike in the off-season? Ask about lay-up periods to reduce your premium.", iconColor: "#dc2626", iconBgColor: "#fef2f2", iconName: "Bike", order: 5,
    },
    {
      slug: "business", title: "Business Insurance", tagline: "Protect what you've built",
      description: "From small businesses to larger operations, Suzanne offers a range of commercial insurance solutions. Protect your business property, employees, and bottom line with customized coverage that grows with your business.",
      features: JSON.stringify(["General liability insurance", "Commercial property insurance", "Business owner's policy (BOP)", "Workers' compensation", "Commercial auto insurance", "Professional liability / Errors & Omissions", "Cyber liability coverage"]),
      tip: "A Business Owner's Policy (BOP) bundles property and liability coverage at a reduced rate.", iconColor: "#059669", iconBgColor: "#ecfdf5", iconName: "Briefcase", order: 6,
    },
    {
      slug: "boat", title: "Boat Insurance", tagline: "Smooth sailing, insured",
      description: "Enjoy the water with peace of mind. Dwyer Insurance Group boat insurance covers your vessel, motor, trailer, and equipment against a wide range of risks, both on and off the water.",
      features: JSON.stringify(["Physical damage coverage for your boat", "Liability protection on the water", "Medical payments coverage", "Uninsured watercraft coverage", "Personal effects coverage", "Emergency assistance & towing", "Wreck removal coverage"]),
      tip: "Many boat policies include discounts for completing boating safety courses.", iconColor: "#0284c7", iconBgColor: "#e8f4fd", iconName: "Ship", order: 7,
    },
    {
      slug: "atv", title: "ATV / Off-Road Insurance", tagline: "Adventure protected, on and off the trail",
      description: "ATVs, UTVs, and off-road vehicles need specialized insurance. Whether you're hitting the trails or working the land, Suzanne can get you covered for the unexpected.",
      features: JSON.stringify(["Collision and comprehensive coverage", "Liability protection", "Uninsured motorist coverage", "Custom parts and accessories coverage", "Medical payments", "Trailer coverage", "Multiple vehicle discounts"]),
      tip: "Some homeowners policies offer limited ATV coverage — but a dedicated policy provides full protection.", iconColor: "#65a30d", iconBgColor: "#f0fce4", iconName: "TreePine", order: 8,
    },
    {
      slug: "flood", title: "Flood Insurance", tagline: "Standard policies don't cover floods — we do",
      description: "Flooding is the most common and costly natural disaster in the U.S. — and it's not covered by standard homeowners insurance. Suzanne can help you get the flood protection you need through the National Flood Insurance Program (NFIP).",
      features: JSON.stringify(["Building property coverage up to $250,000", "Personal property coverage up to $100,000", "Coverage for flood damage to your home's structure", "Protection for furnace, water heater, and appliances", "Coverage for debris removal", "NFIP-backed policies", "Preferred risk policies for low-to-moderate risk areas"]),
      tip: "There's typically a 30-day waiting period before a new flood policy takes effect — don't wait for storm season!", iconColor: "#0d9488", iconBgColor: "#e6faf8", iconName: "Umbrella", order: 9,
    },
    {
      slug: "identity", title: "Identity Protection", tagline: "Your identity, your fortress",
      description: "Identity theft can happen to anyone. Identity Protection monitors your personal information and helps you recover if your identity is compromised. Get proactive monitoring and expert restoration support.",
      features: JSON.stringify(["Dark web monitoring for your personal information", "Social media account monitoring", "Credit monitoring and alerts", "Identity theft insurance up to $1 million", "Dedicated restoration specialists", "Lost wallet protection", "Financial account takeover monitoring"]),
      tip: "Over 14 million Americans were victims of identity theft last year — protect yourself proactively.", iconColor: "#9333ea", iconBgColor: "#faf0ff", iconName: "Fingerprint", order: 10,
    },
    {
      slug: "roadside", title: "Roadside Assistance", tagline: "Help when you need it, 24/7",
      description: "Never get stranded again. Roadside Assistance provides 24/7 help for common roadside emergencies, from flat tires and dead batteries to lockouts and towing. Available as an add-on to your auto policy or as a standalone plan.",
      features: JSON.stringify(["Towing service up to your coverage limit", "Jump-starts for dead batteries", "Flat tire changes", "Lockout service", "Fuel delivery", "24/7 nationwide coverage", "No deductible or copay"]),
      tip: "Adding roadside assistance to your auto policy is often more affordable than a standalone plan.", iconColor: "#ea580c", iconBgColor: "#fff5eb", iconName: "Wrench", order: 11,
    },
  ];

  for (const page of insurancePages) {
    await db.insurancePage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }

  // ─── Page Sections ─────────────────────────────────────────
  const sections = [
    {
      section: "hero", title: "Suzanne Dwyer", subtitle: "Dwyer Insurance Group",
      description: "Protecting what matters most to you across Pennsylvania, New York, and Delaware.",
      content: JSON.stringify({ ctaText: "Get a Free Quote", cta2Text: "Call Now", showRating: true }),
    },
    {
      section: "about", title: "Your Trusted Insurance Partner", subtitle: "About Suzanne",
      description: "As an Elite Agent, National Award Winner serving the community, Suzanne Dwyer brings dedication, expertise, and a personal touch to every client relationship. She understands that insurance isn't just about policies — it's about protecting the people and things that matter most to you.\n\nWhether you're purchasing your first home, starting a business, or looking to protect your family's future, Suzanne takes the time to understand your unique situation and find the right coverage at the right price.",
      content: JSON.stringify({ stats: [{ number: "273+", label: "Happy Clients" }, { number: "4.3", label: "Star Rating" }, { number: "3", label: "States Licensed" }, { number: "12+", label: "Insurance Types" }] }),
    },
    {
      section: "services", title: "Comprehensive Insurance Solutions", subtitle: "Our Services",
      description: "From auto and home to life and business, Dwyer Insurance Group offers a full range of insurance products to protect every aspect of your life.",
    },
    {
      section: "whyChooseUs", title: "Why Families Trust Suzanne Dwyer", subtitle: "Why Choose Us",
      description: "Choosing the right insurance agent makes all the difference. Here's why hundreds of families trust Suzanne with their protection.",
    },
    {
      section: "testimonials", title: "What Our Clients Say", subtitle: "Testimonials",
      description: "Don't just take our word for it — hear from the families and individuals who trust Suzanne Dwyer with their insurance needs.",
    },
    {
      section: "faq", title: "Frequently Asked Questions", subtitle: "FAQ",
      description: "Have questions? We have answers. If you don't see what you're looking for, feel free to contact us directly.",
    },
    {
      section: "contact", title: "Get in Touch", subtitle: "Contact Us",
      description: "Ready to protect what matters most? Contact Suzanne today for a free, no-obligation insurance consultation and quote.",
    },
    {
      section: "ctaBanner", title: "Ready to Protect What Matters Most?", subtitle: "",
      description: "Get a personalized insurance quote from Dwyer Insurance Group today. Bundle and save up to 25% on your premiums!",
    },
  ];

  for (const sec of sections) {
    await db.pageSection.upsert({
      where: { section: sec.section },
      update: sec,
      create: sec,
    });
  }

  // ─── Testimonials ──────────────────────────────────────────
  // Clear existing and recreate
  await db.testimonial.deleteMany({});

  const testimonials = [
    { name: "Jennifer T.", rating: 5.0, text: "Suzanne is absolutely wonderful! She took the time to explain all my options and helped me save money by bundling my policies. I couldn't be happier with the service!", date: "May 2025", order: 0 },
    { name: "Keith M.", rating: 4.5, text: "Very professional and knowledgeable agent. Suzanne helped me find the right coverage for my home and auto. The claims process was smooth and hassle-free.", date: "May 2025", order: 1 },
    { name: "Michael T.", rating: 5.0, text: "Outstanding service! Suzanne goes above and beyond for her clients. She's always available to answer questions and genuinely cares about getting you the best coverage.", date: "May 2025", order: 2 },
    { name: "Moses B.", rating: 5.0, text: "I switched to Dwyer Insurance Group because of Suzanne and I'm so glad I did. She found me better coverage at a lower price than my previous insurer. Highly recommend!", date: "April 2025", order: 3 },
    { name: "Sarah K.", rating: 5.0, text: "Suzanne made the insurance process so easy to understand. She patiently answered all my questions and helped me choose the perfect policy for my family's needs.", date: "April 2025", order: 4 },
    { name: "Robert L.", rating: 4.5, text: "Great experience working with Suzanne. She's responsive, thorough, and genuinely cares about her clients' well-being. My family has been with her for years.", date: "March 2025", order: 5 },
  ];

  for (const t of testimonials) {
    await db.testimonial.create({ data: t });
  }

  // ─── FAQ Items ─────────────────────────────────────────────
  await db.faqItem.deleteMany({});

  const faqs = [
    { question: "Can I text your agency with questions?", answer: "Yes! We have text messaging services available. You can reach us at (610) 725-8137 for quick questions, policy updates, or to schedule an appointment.", order: 0 },
    { question: "What languages do you speak?", answer: "We have staff members available who speak English and Spanish. We're committed to serving our diverse community in their preferred language.", order: 1 },
    { question: "What states are you licensed in?", answer: "Suzanne Dwyer is insurance licensed in Pennsylvania, New York, and Delaware.", order: 2 },
    { question: "How can I save money on my insurance?", answer: "We offer multiple discounts including multi-policy bundling (save up to 25%), safe driver discounts, claim-free discounts, good student discounts, and more. Contact us for a personalized quote and savings review.", order: 3 },
    { question: "Do you offer virtual appointments?", answer: "Yes! We offer both in-person and virtual appointments for your convenience. Schedule an appointment that works for you — evenings and weekends available by request.", order: 4 },
    { question: "What happens after I file a claim?", answer: "Once you file a claim, you'll be assigned a dedicated claims adjuster who will guide you through the process. We ensure you're satisfied with the outcome.", order: 5 },
    { question: "How do I know if I need flood insurance?", answer: "Flood damage is not covered by standard homeowners insurance. If you live in a flood zone or near water, flood insurance is essential. Even in low-risk areas, about 25% of flood claims come from outside high-risk zones. We can assess your risk and help you decide.", order: 6 },
    { question: "Can I bundle different types of insurance?", answer: "Absolutely! Bundling your policies (like auto + home) can save you up to 25% on your premiums. We also offer multi-car discounts, safe driving bonuses, and loyalty rewards.", order: 7 },
  ];

  for (const f of faqs) {
    await db.faqItem.create({ data: f });
  }

  console.log("✅ Seeding completed!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
