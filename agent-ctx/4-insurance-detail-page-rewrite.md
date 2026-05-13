# Task 4 - Insurance Detail Page Rewrite Agent

## Task
Rewrite `src/app/insurance/[slug]/page.tsx` with critical changes for the insurance detail page.

## Work Summary
Completely rewrote the insurance detail page with the following changes:

### InsurancePageData Interface
- Added 8 new fields: emoji, bannerTextPosition, bannerCta1Text, bannerCta1Color, bannerCta1Link, bannerCta2Text, bannerCta2Color, bannerCta2Link
- MenuItemData: added iconName field

### Hero Banner Cleanup
- Removed entire "Right - Large Icon Card" section (floating icon + decorative circles)
- Removed "Allstate Insurance" Badge with Award icon - replaced with page.tagline Badge
- Removed grid layout (lg:grid-cols-2) → single column full-width
- Added bannerTextPosition support: left/center/right with appropriate max-width and alignment
- CTA buttons use page.bannerCta1*/bannerCta2* fields, icons removed
- Second button uses outline style when bannerCta2Color is empty

### Shared Components
- Replaced inline Navigation with shared Navigation from @/components/Navigation
- Replaced inline Footer with shared Footer from @/components/Footer
- Replaced inline DynamicIcon with shared DynamicIcon from @/components/DynamicIcon
- Replaced inline AnimatedSection with shared AnimatedSection from @/components/AnimatedSection

### Dynamic Colors
- Removed ALL hardcoded "allstate-" color classes
- All colors now come from settings (primaryColor, darkColor, accentColor) and page data (iconColor, cardAccentColor, textColor)
- CTA Section uses page.bannerCta1*/bannerCta2* for button styling

### Emoji Support
- Other Insurance Types cards show emoji next to title if page.emoji exists

### Results
- Lint passes cleanly
- Dev server compiles and serves /insurance/auto with HTTP 200
- All changes backward-compatible with sensible defaults
