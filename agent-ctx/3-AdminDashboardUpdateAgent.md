# Task 3: Update Admin Dashboard - Work Record

## Summary
Added "Page Appearance" tab to admin dashboard and updated InsuranceForm with banner/appearance fields.

## Changes Made

### 1. Seed Data (`prisma/seed.ts`)
- Added 6 new SiteSetting entries for appearance management:
  - `heroBannerImage` (category: hero, type: image) - Hero banner background image URL
  - `heroBannerOverlay` (category: hero, type: color) - Hero overlay color, default #001e60
  - `heroBannerOverlayOpacity` (category: hero, type: size) - Hero overlay opacity 0-100, default 70
  - `aboutBgColor` (category: about, type: color) - About section background, default #ffffff
  - `servicesBgColor` (category: services, type: color) - Services section background, default #f8fafc
  - `footerBgColor` (category: footer, type: color) - Footer background, default #001e60

### 2. Admin Dashboard (`src/app/admin/dashboard/page.tsx`)
- **Imports**: Added Palette, ChevronsUpDown, Eye from lucide-react
- **TabId type**: Added 'appearance' to union type
- **TABS array**: Added `{ id: 'appearance', label: 'Page Appearance', icon: <Palette /> }` as 2nd tab
- **Dashboard rendering**: Added `{activeTab === 'appearance' && <AppearanceTab />}`
- **InsurancePage interface**: Added 6 new fields (bannerImage, bannerColorFrom, bannerColorTo, backgroundColor, cardAccentColor, textColor)
- **AppearanceTab component**: New component with Homepage Banner section (image URL input w/ preview, overlay color picker, opacity slider w/ presets and live preview) and Section Backgrounds section (3 color pickers w/ swatches), plus Live Color Preview card
- **InsuranceForm component**: Added collapsible "Banner & Appearance" section with toggle button, "Customized" badge indicator, banner image URL w/ preview, gradient color pickers w/ gradient preview bar, background/accent/text color pickers w/ preview swatches

## Verification
- `bun run lint` passes with zero errors
- Dev server compiles and serves /admin/dashboard with HTTP 200
- Settings API returns all 25 settings including 6 new appearance entries
