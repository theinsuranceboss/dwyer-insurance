"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
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
import { Separator } from "@/components/ui/separator";
import DynamicIcon from "@/components/DynamicIcon";
import AnimatedSection from "@/components/AnimatedSection";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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

// ─── Helper Components ─────────────────────────────────────────────

// ─── AnimatedSection is now imported from @/components/AnimatedSection

// ─── Navigation is now imported from @/components/Navigation ─────

// ─── Insurance Hero ────────────────────────────────────────────────

function InsuranceHero({
  page,
  agentInfo,
  settings,
}: {
  page: InsurancePageData;
  agentInfo: Record<string, string>;
  settings: Record<string, string>;
}) {
  const color = page.iconColor || settings.primaryColor || "#0033A0";
  const accentColor = settings.accentColor || "#ff9e16";
  const phone = agentInfo.phone || "(610) 649-0500";
  const phoneLink = agentInfo.phoneLink || phone.replace(/[^\d+]/g, "");

  // Determine banner gradient: custom fields override iconColor-based default
  const gradientFrom = page.bannerColorFrom || color;
  const gradientTo = page.bannerColorTo || settings.secondaryColor || "#001e60";
  const hasCustomGradient = !!(page.bannerColorFrom || page.bannerColorTo);
  const hasBannerImage = !!page.bannerImage;

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Banner image background */}
      {hasBannerImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${page.bannerImage})` }}
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: hasBannerImage
            ? `linear-gradient(135deg, ${gradientFrom}cc 0%, ${gradientTo}cc 100%)`
            : hasCustomGradient
              ? `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientFrom}cc 40%, ${gradientTo}cc 70%, ${gradientTo} 100%)`
              : `linear-gradient(135deg, ${color} 0%, ${color}cc 40%, ${color}99 70%, ${gradientTo} 100%)`,
        }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${gradientFrom}40` }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}15` }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: `${gradientFrom}20` }}
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2 text-sm font-semibold">
                <Award className="w-4 h-4 mr-2" />
                Dwyer Insurance Group
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              {page.title}
              <span className="block mt-2" style={{ color: `${gradientFrom}80` }}>
                {page.tagline}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-white/80 max-w-lg"
            >
              Protect what matters most with personalized coverage from Dwyer Insurance Group, serving PA, NY, and DE.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <a href={`tel:${phoneLink}`}>
                <Button
                  size="lg"
                  className="text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  style={{ backgroundColor: accentColor }}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call for a Quote
                </Button>
              </a>
              <a href="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 bg-transparent"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Request Online
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Right - Large Icon Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div
                className="w-48 h-48 rounded-3xl flex items-center justify-center shadow-2xl"
                style={{ backgroundColor: `${gradientFrom}90` }}
              >
                <DynamicIcon name={page.iconName} size={80} className="text-white" />
              </div>
              {/* Decorative circles */}
              <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30"
                style={{ backgroundColor: gradientFrom }}
              />
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20"
                style={{ backgroundColor: gradientFrom }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Description Section ───────────────────────────────────────────

function DescriptionSection({
  page,
  agentInfo,
  settings,
}: {
  page: InsurancePageData;
  agentInfo: Record<string, string>;
  settings: Record<string, string>;
}) {
  const color = page.iconColor || settings.primaryColor || "#0033A0";
  const accentColor = page.cardAccentColor || color;
  const textOverride = page.textColor || "";
  const phone = agentInfo.phone || "(610) 649-0500";
  const phoneLink = agentInfo.phoneLink || phone.replace(/[^\d+]/g, "");
  const darkColor = settings.darkColor || "#001e60";

  return (
    <section
      className="py-20 lg:py-28"
      style={page.backgroundColor ? { backgroundColor: page.backgroundColor } : { backgroundColor: "#ffffff" }}
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
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: accentColor }}
                  >
                    <DynamicIcon name={page.iconName} size={40} className="text-white" />
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
              {page.title}
            </Badge>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-6"
              style={textOverride ? { color: textOverride } : { color: darkColor }}
            >
              {page.tagline}
            </h2>
            <p
              className="text-lg mb-6 leading-relaxed text-muted-foreground"
              style={textOverride ? { color: textOverride } : undefined}
            >
              {page.description}
            </p>
            <p
              className="mb-8 text-muted-foreground"
              style={textOverride ? { color: textOverride } : undefined}
            >
              As an Elite Agent, National Award Winner at Dwyer Insurance Group, our team takes the time to understand your unique situation and find the right coverage at the right price. With in-person and virtual appointments available, getting the protection you need has never been easier.
            </p>

            <a href={`tel:${phoneLink}`}>
              <Button
                className="font-semibold shadow-lg hover:shadow-xl transition-all text-white"
                style={{ backgroundColor: accentColor }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Get a Free Quote
              </Button>
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ─── Features Grid ─────────────────────────────────────────────────

function FeaturesGrid({
  page,
  settings,
}: {
  page: InsurancePageData;
  settings: Record<string, string>;
}) {
  const color = page.iconColor || settings.primaryColor || "#0033A0";
  const accentColor = page.cardAccentColor || color;
  const textOverride = page.textColor || "";
  const darkColor = settings.darkColor || "#001e60";
  const primaryColor = settings.primaryColor || "#0033A0";

  // Determine section background
  const sectionBg = page.backgroundColor
    ? page.backgroundColor
    : "linear-gradient(180deg, #f8fafc 0%, #e8edf5 100%)";

  return (
    <section
      className="py-20 lg:py-28"
      style={page.backgroundColor
        ? { backgroundColor: sectionBg }
        : { background: sectionBg }
      }
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
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={textOverride ? { color: textOverride } : { color: darkColor }}
          >
            What&apos;s <span style={{ color: accentColor }}>Covered</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto text-muted-foreground"
            style={textOverride ? { color: textOverride } : undefined}
          >
            {page.title} provides comprehensive protection. Here&apos;s what your policy includes:
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {page.features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default border-gray-200 h-full">
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
                    <p
                      className="font-medium text-sm leading-relaxed"
                      style={textOverride ? { color: textOverride } : { color: darkColor }}
                    >
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

function ProTipCallout({
  page,
  settings,
}: {
  page: InsurancePageData;
  settings: Record<string, string>;
}) {
  const color = page.iconColor || settings.primaryColor || "#0033A0";
  const accentColor = page.cardAccentColor || color;
  const textOverride = page.textColor || "";

  if (!page.tip) return null;

  return (
    <section
      className="py-16"
      style={page.backgroundColor ? { backgroundColor: page.backgroundColor } : { backgroundColor: "#ffffff" }}
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
                  Pro Tip from Dwyer Insurance Group
                </h3>
                <p
                  className="text-lg leading-relaxed text-muted-foreground"
                  style={textOverride ? { color: textOverride } : undefined}
                >
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
  const darkColor = settings.darkColor || "#001e60";

  return (
    <section
      className="py-20 lg:py-28"
      style={{ background: "linear-gradient(180deg, #f8fafc 0%, #e8edf5 100%)" }}
    >
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: darkColor }}>
            Other Insurance <span style={{ color: primaryColor }}>Options</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dwyer Insurance Group offers a full range of insurance products. Explore other coverage types to protect every aspect of your life.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {otherPages.map((page, i) => {
            const color = page.iconColor || primaryColor;
            const bgColor = page.iconBgColor || `${color}15`;

            return (
              <AnimatedSection key={page.id} delay={i * 0.05}>
                <a href={`/insurance/${page.slug}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-gray-200 h-full">
                    <CardHeader className="pb-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: bgColor }}
                      >
                        <DynamicIcon name={page.iconName} size={28} style={{ color }} />
                      </div>
                      <CardTitle
                        className="text-lg transition-colors"
                        style={{ color: darkColor }}
                      >
                        {page.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground text-sm">
                        {page.tagline}
                      </CardDescription>
                      <div
                        className="mt-4 flex items-center font-medium text-sm group-hover:gap-2 transition-all"
                        style={{ color: primaryColor }}
                      >
                        Learn More <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ───────────────────────────────────────────────────

function CTASection({
  page,
  agentInfo,
  settings,
}: {
  page: InsurancePageData;
  agentInfo: Record<string, string>;
  settings: Record<string, string>;
}) {
  const color = page.iconColor || settings.primaryColor || "#0033A0";
  const accentColor = settings.accentColor || "#ff9e16";
  const phone = agentInfo.phone || "(610) 649-0500";
  const phoneLink = agentInfo.phoneLink || phone.replace(/[^\d+]/g, "");
  const secondaryColor = settings.secondaryColor || "#001e60";

  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 50%, ${secondaryColor} 100%)` }}
    >
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
            Get a personalized {page.title.toLowerCase()} quote from Dwyer Insurance Group today. Bundle and save up to 25% on your premiums!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${phoneLink}`}>
              <Button
                size="lg"
                className="text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                style={{ backgroundColor: accentColor }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {phone}
              </Button>
            </a>
            <a href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 bg-transparent"
              >
                <FileText className="w-5 h-5 mr-2" />
                Request a Quote Online
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Footer is now imported from @/components/Footer

// ─── Main Page Component ──────────────────────────────────────────

export default function InsuranceSlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-data")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-gray-200 border-t-[#0033A0] rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Page</h2>
          <p className="text-muted-foreground mb-4">Unable to load page data.</p>
          <a href="/">
            <Button>Return Home</Button>
          </a>
        </div>
      </div>
    );
  }

  const page = data.insurancePages.find((p) => p.slug === slug);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold mb-2">Insurance Type Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The insurance page you&apos;re looking for doesn&apos;t exist.
          </p>
          <a href="/">
            <Button>Return Home</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation
        menuItems={data.menuItems}
        agentInfo={data.agentInfo}
        settings={data.settings}
      />
      <InsuranceHero page={page} agentInfo={data.agentInfo} settings={data.settings} />
      <DescriptionSection page={page} agentInfo={data.agentInfo} settings={data.settings} />
      <FeaturesGrid page={page} settings={data.settings} />
      <ProTipCallout page={page} settings={data.settings} />
      <OtherInsuranceTypes allPages={data.insurancePages} currentSlug={slug} settings={data.settings} />
      <CTASection page={page} agentInfo={data.agentInfo} settings={data.settings} />
      <Footer agentInfo={data.agentInfo} insurancePages={data.insurancePages} settings={data.settings} />
    </main>
  );
}
