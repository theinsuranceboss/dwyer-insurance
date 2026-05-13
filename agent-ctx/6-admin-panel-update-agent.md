# Task 6 - Admin Panel Update Agent

## Task
Update the admin panel to support all the new editable fields (emoji, bannerTextPosition, CTA buttons, hero banner settings).

## Work Log

### 1. Updated `src/components/admin/shared.tsx`
- Added 8 new fields to InsurancePage interface: emoji, bannerTextPosition, bannerCta1Text, bannerCta1Color, bannerCta1Link, bannerCta2Text, bannerCta2Color, bannerCta2Link
- Added new "Hero Banner Text & Buttons" section to APPEARANCE_SECTIONS with keys: heroTextPosition, heroCtaColor, heroCtaLink, heroCta2Color, heroCta2Link

### 2. Updated `src/components/admin/AppearanceTab.tsx`
- Added Select component import from shadcn/ui
- Added AlignLeft, AlignCenter, AlignRight icon imports from lucide-react
- Added special rendering for `heroTextPosition` setting: Select dropdown with left/center/right options and alignment icons
- Added CTA button colors to the Live Color Preview grid (heroCtaColor, heroCta2Color)

### 3. Updated `src/components/admin/InsuranceTab.tsx`
- Added emoji field to the page list cards (shown next to the title)
- Added Emoji input with live preview in the form's top section (near title/tagline)
- Added "Banner Text & Buttons" sub-section inside the collapsible "Banner & Appearance" section:
  - Banner Text Position: Select dropdown (left/center/right)
  - CTA Button 1 Text & Link: Input fields
  - CTA Button 1 Color: Color picker with live button preview
  - CTA Button 2 Text & Link: Input fields
  - CTA Button 2 Color: Color picker with outline button preview (empty = outline style)
- Updated hasAppearanceValues check to include new CTA and bannerTextPosition fields

### 4. Refactored `src/app/admin/dashboard/page.tsx`
- Replaced 2271-line inline dashboard with clean 130-line version
- Removed all inline type definitions (now imported from shared.tsx)
- Removed all inline API helpers (now imported from shared.tsx)
- Removed all inline tab component definitions (now imported from component files)
- Dashboard now imports: SettingsTab, AppearanceTab, MenuTab, InsuranceTab, SectionsTab, AgentTab, TestimonialsTab, FaqsTab from their respective component files
- This eliminates all duplicate code and ensures the dashboard always uses the latest versions

### 5. Updated `src/app/api/admin/insurance/route.ts`
- Added 8 new fields to POST handler destructuring and type definition
- Added 8 new fields to db.insurancePage.create() data with defaults
- Added 8 new fields to PUT handler destructuring and type definition
- Added 8 new fields to conditional data assignments for updates

### 6. Verified `src/app/api/site-data/route.ts`
- Confirmed Prisma findMany returns all model columns by default
- The ...page spread in the map includes all fields including the new ones
- No changes needed - API already returns heroTextPosition, heroCtaColor, heroCtaLink, heroCta2Color, heroCta2Link from SiteSettings and emoji, bannerTextPosition, bannerCta1Text, etc. from InsurancePage

### 7. Fixed pre-existing bug in `src/app/page.tsx`
- Removed duplicate `import Footer from "@/components/Footer"` that conflicted with the inline Footer function definition

### Verification
- `bun run lint` passes with zero errors
- `bun run db:push` completes successfully
- Seed script runs and populates new settings
- `/api/site-data` returns all new fields (heroTextPosition, heroCtaColor, heroCtaLink, heroCta2Color, heroCta2Link in settings; emoji, bannerTextPosition, bannerCta1Text, etc. in insurancePages)
- `/api/admin/insurance` returns all new fields (verified: emoji, bannerTextPosition, bannerCta1Text, bannerCta1Color, bannerCta2Text present)
- All pages serve HTTP 200: /, /admin/dashboard, /insurance/auto
