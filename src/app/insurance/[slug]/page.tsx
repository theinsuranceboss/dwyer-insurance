"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

// ─── Types ─────────────────────────────────────────────────────────

interface InsurancePageData {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  tip: string;
  iconColor: string;
  iconBgColor: string;
  iconName: string;
  order: number;
  visible: boolean;
  bannerImage: string;
  bannerColorFrom: string;
  bannerColorTo: string;
  backgroundColor: string;
  cardAccentColor: string;
  textColor: string;
  emoji: string;
  bannerTextPosition: string;
  bannerCta1Text: string;
  bannerCta1Color: string;
  bannerCta1Link: string;
  bannerCta2Text: string;
  bannerCta2Color: string;
  bannerCta2Link: string;
  bannerImagePosition: string;
  bannerImageSize: string;
  bannerTitleSize: number;
}

interface MenuItemData {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  isDropdown: boolean;
  parent: string | null;
  iconName: string;
}

interface SiteData {
  settings: Record<string, string>;
  menuItems: MenuItemData[];
  agentInfo: Record<string, string>;
  insurancePages: InsurancePageData[];
}

// ─── Insurance Hero ────────────────────────────────────────────────

function InsuranceHero({ page, settings }: { page: InsurancePageData; settings: Record<string, string> }) {
  const color = page.iconColor || settings.primaryColor || "#0033A0";
  const darkColor = settings.darkColor || "#001e60";

  // Determine banner gradient: custom fields override iconColor-based default
  const gradient_from = page.bannerColorFrom || color;
  const gradient_to = page.bannerColorTo || darkColor;
  const hasCustomGradient = !!(page.bannerColorFrom || page.bannerColorTo);
  const hasBannerImage = !!page.bannerImage;

  // Banner text position (default "left")
  const textPosition = page.bannerTextPosition || "left";
  const positionClasses =
    textPosition === "center"
      ? "text-center max-w-4xl mx-auto"
      : textPosition === "right"
        ? "text-right max-w-2xl ml-auto"
        : "text-left max-w-2xl";

  // CTA button fields
  const cta1Text = page.bannerCta1Text || "Call for a Quote";
  const cta1Color = page.bannerCta1Color || "#ff9e16";
  const cta1Link = page.bannerCta1Link || "tel:+16107259900";
  const cta2Text = page.bannerCta2Text || "Request Online";
  const cta2Color = page.bannerCta2Color; // empty = outline style
  const cta2Link = page.bannerCta2Link || "/";

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Banner image background */}
      {hasBannerImage && (
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{ 
            backgroundImage: `url(${page.bannerImage})`,
            backgroundPosition: page.bannerImagePosition || "center center",
            backgroundSize: page.bannerImageSize || "cover"
          }}
        />
      )}

      {/* Gradient overlay — covers full section; doubles as overlay when image is present */}
      <div
        className="absolute inset-0"
        style={{
          background: hasBannerImage
            ? `linear-gradient(135deg, ${gradient_from}cc 0%, ${gradient_to}cc 100%)`
            : hasCustomGradient
              ? `linear-gradient(135deg, ${gradient_from} 0%, ${gradient_from}cc 40%, ${gradient_to}cc 70%, ${gradient_to} 100%)`
              : `linear-gradient(135deg, ${color} 0%, ${color}cc 40%, ${color}99 70%, ${darkColor} 100%)`,
        }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${gradient_from}40` }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${gradient_from}10` }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: `${gradient_from}20` }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 w-full">
        <div className={positionClasses}>
          {page.tagline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2 text-sm font-semibold">
                {page.tagline}
              </Badge>
            </motion.div>
          )}

          {/* Large prominent emoji before title */}
          {page.emoji && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-6xl sm:text-7xl lg:text-8xl mb-4"
            >
              {page.emoji}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-bold text-white leading-tight"
            style={{ fontSize: `${page.bannerTitleSize || 52}px` }}
          >
            {page.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-white/80"
          >
            {page.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`mt-8 flex flex-col sm:flex-row gap-4 ${textPosition === "center" ? "justify-center" : textPosition === "right" ? "justify-end" : "justify-start"}`}
          >
            <a href={cta1Link}>
              <Button
                size="lg"
                className="text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                style={{ backgroundColor: cta1Color }}
              >
                {cta1Text}
              </Button>
            </a>
            {cta2Color ? (
              <a href={cta2Link}>
                <Button
                  size="lg"
                  className="text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  style={{ backgroundColor: cta2Color }}
                >
                  {cta2Text}
                </Button>
              </a>
            ) : (
              <a href={cta2Link}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 bg-transparent"
                >
                  {cta2Text}
                </Button>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Description Section ───────────────────────────────────────────

function DescriptionSection({ page, settings }: { page: InsurancePageData; settings: Record<string, string> }) {
  const color = page.iconColor || settings.primaryColor || "#0033A0";
  const accentColor = page.cardAccentColor || color;
  const textOverride = page.textColor || "";

  return (
    <section
      className={`py-20 lg:py-28 ${!page.backgroundColor ? "bg-white" : ""}`}
      style={page.backgroundColor ? { backgroundColor: page.backgroundColor } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side */}
          <AnimatedSection>
            <div className="relative">
              <div
                className="rounded-3xl p-8 lg:p-10 relative overflow-hidden"
                style={{ backgroundColor: `${accentColor}10` }}
              >
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/2"
                  style={{ backgroundColor: `${accentColor}15` }}
                />
                <div
                  className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/2"
                  style={{ backgroundColor: `${accentColor}10` }}
                />

                <div className="relative z-10">
                  {/* Large prominent emoji instead of icon circle */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-6xl lg:text-7xl mb-6"
                  >
                    {page.emoji || "🛡️"}
                  </motion.div>

                  <h3
                    className="text-2xl lg:text-3xl font-bold mb-3"
                    style={{ color: accentColor }}
                  >
                    {page.title}
                  </h3>
                  <p className="text-lg font-medium" style={{ color: `${accentColor}cc` }}>
                    {page.tagline}
                  </p>

                  {/* Quick stats */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {[
                      { number: "273+", label: "Happy Clients" },
                      { number: "4.3", label: "Star Rating" },
                      { number: "3", label: "States Licensed" },
                      { number: "25%", label: "Bundle Savings" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl p-4 text-center"
                        style={{ backgroundColor: `${accentColor}12` }}
                      >
                        <p className="text-2xl font-bold" style={{ color: accentColor }}>{stat.number}</p>
                        <p className="text-sm" style={{ color: `${accentColor}aa` }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Content Side */}
          <AnimatedSection delay={0.2}>
            <Badge
              className="mb-4"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
                borderColor: `${accentColor}30`,
              }}
            >
              {page.emoji && <span className="mr-1">{page.emoji}</span>}
              {page.title}
            </Badge>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${!textOverride ? "text-gray-900" : ""}`} style={textOverride ? { color: textOverride } : undefined}>
              {page.tagline}
            </h2>
            <p className={`text-lg mb-6 leading-relaxed ${!textOverride ? "text-muted-foreground" : ""}`} style={textOverride ? { color: textOverride } : undefined}>
              {page.description}
            </p>
            <p className={`mb-8 ${!textOverride ? "text-muted-foreground" : ""}`} style={textOverride ? { color: textOverride } : undefined}>
              At Dwyer Insurance Group, we take the time to understand your unique situation and find the right coverage at the right price. With in-person and virtual appointments available, getting the protection you need has never been easier.
            </p>

            <a href={page.bannerCta1Link || "tel:+16107259900"}>
              <Button
                className="font-semibold shadow-lg hover:shadow-xl transition-all text-white"
                style={{ backgroundColor: page.bannerCta1Color || accentColor }}
              >
                {page.bannerCta1Text || "Get a Free Quote"}
              </Button>
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ─── Features Grid ─────────────────────────────────────────────────

function FeaturesGrid({ page, settings }: { page: InsurancePageData; settings: Record<string, string> }) {
  const color = page.iconColor || settings.primaryColor || "#0033A0";
  const accentColor = page.cardAccentColor || color;
  const textOverride = page.textColor || "";

  return (
    <section
      className={`py-20 lg:py-28 ${!page.backgroundColor ? "bg-gray-50" : ""}`}
      style={page.backgroundColor ? { backgroundColor: page.backgroundColor } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge
            className="mb-4"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
              borderColor: `${accentColor}30`,
            }}
          >
            Coverage Details
          </Badge>
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${!textOverride ? "text-gray-900" : ""}`} style={textOverride ? { color: textOverride } : undefined}>
            What&apos;s <span style={{ color: accentColor }}>Covered</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${!textOverride ? "text-muted-foreground" : ""}`} style={textOverride ? { color: textOverride } : undefined}>
            {page.title} provides comprehensive protection. Here&apos;s what your policy includes:
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {page.features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default border-gray-200/60 h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${accentColor}15` }}
                    >
                      <CheckCircle2
                        size={20}
                        className="flex-shrink-0"
                        style={{ color: accentColor }}
                      />
                    </div>
                    <p className={`font-medium text-sm leading-relaxed ${!textOverride ? "text-gray-900" : ""}`} style={textOverride ? { color: textOverride } : undefined}>
                      {feature}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pro Tip Callout ───────────────────────────────────────────────

function ProTipCallout({ page, settings }: { page: InsurancePageData; settings: Record<string, string> }) {
  const color = page.iconColor || settings.primaryColor || "#0033A0";
  const accentColor = page.cardAccentColor || color;
  const textOverride = page.textColor || "";

  if (!page.tip) return null;

  return (
    <section
      className={`py-16 ${!page.backgroundColor ? "bg-white" : ""}`}
      style={page.backgroundColor ? { backgroundColor: page.backgroundColor } : undefined}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-3xl p-8 lg:p-10 border-l-4 shadow-lg"
            style={{
              backgroundColor: `${accentColor}08`,
              borderColor: accentColor,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <Sparkles size={28} style={{ color: accentColor }} />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2" style={{ color: accentColor }}>
                  Pro Tip
                </h3>
                <p className={`text-lg leading-relaxed ${!textOverride ? "text-muted-foreground" : ""}`} style={textOverride ? { color: textOverride } : undefined}>
                  {page.tip}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Other Insurance Types ─────────────────────────────────────────

function OtherInsuranceTypes({
  allPages,
  currentSlug,
  settings,
}: {
  allPages: InsurancePageData[];
  currentSlug: string;
  settings: Record<string, string>;
}) {
  const otherPages = allPages.filter((p) => p.slug !== currentSlug);
  const primaryColor = settings.primaryColor || "#0033A0";
  const secondaryColor = settings.secondaryColor || "#001e60";

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge
            className="mb-4"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
              borderColor: `${primaryColor}30`,
            }}
          >
            Explore More
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: secondaryColor }}>
            Other Insurance <span style={{ color: primaryColor }}>Options</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We offer a full range of insurance products. Explore other coverage types to protect every aspect of your life.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {otherPages.map((page, i) => (
            <AnimatedSection key={page.id} delay={i * 0.05}>
              <a href={`/insurance/${page.slug}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-gray-200/60 h-full">
                  <CardHeader className="pb-3">
                    {/* Emoji only — no icon circle */}
                    <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">
                      {page.emoji || "🛡️"}
                    </span>
                    <CardTitle className="text-lg group-hover:transition-colors" style={{ color: secondaryColor }}>
                      {page.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-sm">
                      {page.tagline}
                    </CardDescription>
                    <div className="mt-4 flex items-center font-medium text-sm group-hover:gap-2 transition-all" style={{ color: primaryColor }}>
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ───────────────────────────────────────────────────

function CTASection({ page, agentInfo, settings }: { page: InsurancePageData; agentInfo: Record<string, string>; settings: Record<string, string> }) {
  const color = page.iconColor || settings.primaryColor || "#0033A0";
  const darkColor = settings.darkColor || "#001e60";

  // CTA button fields
  const cta1Text = page.bannerCta1Text || "Call for a Quote";
  const cta1Color = page.bannerCta1Color || settings.accentColor || "#ff9e16";
  const cta1Link = page.bannerCta1Link || `tel:${(agentInfo.phone || "(610) 725-9900").replace(/[^\d+]/g, "")}`;
  const cta2Text = page.bannerCta2Text || "Request Online";
  const cta2Color = page.bannerCta2Color; // empty = outline style
  const cta2Link = page.bannerCta2Link || "/";

  return (
    <section className="py-16 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 50%, ${darkColor} 100%)` }}>
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl"
        style={{ backgroundColor: `${color}40` }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get {page.title}?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Get a personalized {page.title.toLowerCase()} quote today. Bundle and save up to 25% on your premiums!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={cta1Link}>
              <Button
                size="lg"
                className="text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                style={{ backgroundColor: cta1Color }}
              >
                {cta1Text}
              </Button>
            </a>
            {cta2Color ? (
              <a href={cta2Link}>
                <Button
                  size="lg"
                  className="text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  style={{ backgroundColor: cta2Color }}
                >
                  {cta2Text}
                </Button>
              </a>
            ) : (
              <a href={cta2Link}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 bg-transparent"
                >
                  {cta2Text}
                </Button>
              </a>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── 404 Not Found ─────────────────────────────────────────────────

function NotFoundPage({ settings }: { settings: Record<string, string> }) {
  const primaryColor = settings.primaryColor || "#0033A0";
  const secondaryColor = settings.secondaryColor || "#001e60";

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-md"
      >
        <div className="text-6xl mb-6">🛡️</div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: secondaryColor }}>
          Insurance Type Not Found
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Sorry, we couldn&apos;t find the insurance type you&apos;re looking for. Please check the URL or browse our available insurance options.
        </p>
        <a href="/">
          <Button
            size="lg"
            className="text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
            Back to Homepage
          </Button>
        </a>
      </motion.div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function InsuranceSlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/site-data");
        if (!res.ok) throw new Error("Failed to fetch site data");
        const data: SiteData = await res.json();
        setSiteData(data);
      } catch (error) {
        console.error("Error loading site data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-4 animate-pulse">🛡️</div>
          <p className="text-gray-900 font-semibold text-lg">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // No data
  if (!siteData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation
          menuItems={[]}
          settings={{}}
          agentInfo={{}}
        />
        <NotFoundPage settings={{}} />
        <Footer
          settings={{}}
          agentInfo={{}}
          insurancePages={[]}
        />
      </div>
    );
  }

  const currentPage = siteData.insurancePages.find(
    (p) => p.slug === slug
  );

  // 404 if slug not found
  if (!currentPage) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation
          menuItems={siteData.menuItems}
          settings={siteData.settings}
          agentInfo={siteData.agentInfo}
          insurancePages={siteData.insurancePages}
        />
        <NotFoundPage settings={siteData.settings} />
        <Footer
          settings={siteData.settings}
          agentInfo={siteData.agentInfo}
          insurancePages={siteData.insurancePages}
          className="mt-auto"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        menuItems={siteData.menuItems}
        settings={siteData.settings}
        agentInfo={siteData.agentInfo}
        insurancePages={siteData.insurancePages}
      />
      <main className="flex-1">
        <InsuranceHero page={currentPage} settings={siteData.settings} />
        <DescriptionSection page={currentPage} settings={siteData.settings} />
        <FeaturesGrid page={currentPage} settings={siteData.settings} />
        <ProTipCallout page={currentPage} settings={siteData.settings} />
        <OtherInsuranceTypes
          allPages={siteData.insurancePages}
          currentSlug={slug}
          settings={siteData.settings}
        />
        <CTASection page={currentPage} agentInfo={siteData.agentInfo} settings={siteData.settings} />
      </main>
      <Footer
        settings={siteData.settings}
        agentInfo={siteData.agentInfo}
        insurancePages={siteData.insurancePages}
        className="mt-auto"
      />
    </div>
  );
}
