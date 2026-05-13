# Task 3 - Homepage Rewrite Agent

## Task
Rewrite src/app/page.tsx homepage with critical HeroSection changes, shared nav/footer, editable CTA buttons, emoji support, and interface updates.

## Changes Made

### Interface Updates
- **Settings**: Added heroTextPosition, heroCtaColor, heroCtaLink, heroCta2Color, heroCta2Link
- **MenuItem**: Added iconName field
- **InsurancePage**: Added emoji, bannerTextPosition, bannerCta1Text, bannerCta1Color, bannerCta1Link, bannerCta2Text, bannerCta2Color, bannerCta2Link

### Navigation & Footer
- Removed inline Navigation function (~270 lines) → imported shared `Navigation` from `@/components/Navigation`
- Removed inline Footer function (~150 lines) → imported shared `Footer` from `@/components/Footer`

### HeroSection Changes
1. Badge: Removed Award icon, replaced `{agentInfo.badge} — Allstate` with `{heroSection?.subtitle || agentInfo.badge}`
2. Text Position: Added `heroTextPosition` support (left/center/right) controlling max-width, text-align, justify
3. CTA Buttons: Fully editable text/color/links from settings; removed Phone and MessageCircle icons
4. Quick Info: REMOVED entirely (Clock/Globe/MapPin section)

### ServicesSection
- Insurance card titles show `{page.emoji}` next to name when available

### Cleanup
- Removed unused imports: ChevronRight, Menu, X, ExternalLink, AnimatePresence
- File: ~1969 → ~1547 lines

## Verification
- `bun run lint` passes cleanly
- Dev server serves / with HTTP 200
- API /api/site-data returns all new fields
