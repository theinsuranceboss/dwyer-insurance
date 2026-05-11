"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Shield,
  Car,
  Home,
  Heart,
  Building2,
  Bike,
  Ship,
  TreePine,
  Umbrella,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Menu,
  X,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Fingerprint,
  Wrench,
  Landmark,
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

// ─── Icon Mapping ──────────────────────────────────────────────────

// ─── Dynamic Icon Component ───────────────────────────────────────
// Static component that renders the correct Lucide icon by name.
// This avoids the ESLint react-hooks/static-components error that
// occurs when a component reference is created dynamically during render.

function DynamicIcon({
  name,
  size,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const props = { size, className, style };
  switch (name) {
    case "Car": return <Car {...props} />;
    case "Home": return <Home {...props} />;
    case "Heart": return <Heart {...props} />;
    case "Building2": return <Building2 {...props} />;
    case "Landmark": return <Landmark {...props} />;
    case "Bike": return <Bike {...props} />;
    case "Ship": return <Ship {...props} />;
    case "TreePine": return <TreePine {...props} />;
    case "Umbrella": return <Umbrella {...props} />;
    case "Fingerprint": return <Fingerprint {...props} />;
    case "Wrench": return <Wrench {...props} />;
    case "Briefcase": return <Building2 {...props} />; // Building2 as fallback for "Briefcase"
    default: return <Shield {...props} />;
  }
}

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
}

interface MenuItemData {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  isDropdown: boolean;
  parent: string | null;
}

interface SiteData {
  settings: Record<string, string>;
  menuItems: MenuItemData[];
  agentInfo: Record<string, string>;
  insurancePages: InsurancePageData[];
}

// ─── Helper Components ─────────────────────────────────────────────

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : i - 0.5 <= rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

// ─── Navigation ────────────────────────────────────────────────────

function Navigation({
  menuItems,
  agentInfo,
  currentPageTitle,
}: {
  menuItems: MenuItemData[];
  agentInfo: Record<string, string>;
  currentPageTitle: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phone = agentInfo.phone || "(610) 725-9900";
  const agentName = agentInfo.name || "Suzanne Dwyer";
  const agentTitle = agentInfo.title || "Allstate Insurance Agent";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-allstate-gray/30"
          : "bg-allstate-dark/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-allstate-blue flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className={`font-bold text-lg leading-tight ${scrolled ? "text-allstate-navy" : "text-white"}`}>
                {agentName}
              </p>
              <p className={`text-xs leading-tight ${scrolled ? "text-allstate-blue" : "text-allstate-light"}`}>
                {agentTitle}
              </p>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {menuItems.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`nav-link text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-allstate-navy hover:text-allstate-blue"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
              <Button
                size="sm"
                className="bg-allstate-orange hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Phone className="w-4 h-4 mr-2" />
                Get a Quote
              </Button>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className={scrolled ? "text-allstate-navy" : "text-white"} size={24} />
            ) : (
              <Menu className={scrolled ? "text-allstate-navy" : "text-white"} size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white shadow-xl border-t border-allstate-gray/30"
          >
            <div className="px-4 py-4 space-y-1">
              {menuItems.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-allstate-navy hover:bg-allstate-light/10 hover:text-allstate-blue rounded-lg transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="block pt-2">
                <Button className="w-full bg-allstate-orange hover:bg-orange-600 text-white font-semibold">
                  <Phone className="w-4 h-4 mr-2" />
                  Get a Quote: {phone}
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Insurance Hero ────────────────────────────────────────────────

function InsuranceHero({ page }: { page: InsurancePageData }) {
  const color = page.iconColor || "#0033A0";

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}cc 40%, ${color}99 70%, #001e60 100%)`,
        }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${color}40` }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-allstate-orange/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: `${color}20` }}
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
                Allstate Insurance
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              {page.title}
              <span className="block mt-2" style={{ color: `${color}50` }}>
                {page.tagline}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-white/80 max-w-lg"
            >
              Protect what matters most with personalized coverage from Suzanne Dwyer, your local Allstate agent in Wynnewood, PA.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <a href={`tel:16107259900`}>
                <Button
                  size="lg"
                  className="bg-allstate-orange hover:bg-orange-600 text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
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
                style={{ backgroundColor: `${color}90` }}
              >
                <DynamicIcon name={page.iconName} size={80} className="text-white" />
              </div>
              {/* Decorative circles */}
              <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30"
                style={{ backgroundColor: color }}
              />
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-20"
                style={{ backgroundColor: color }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Description Section ───────────────────────────────────────────

function DescriptionSection({ page }: { page: InsurancePageData }) {
  const color = page.iconColor || "#0033A0";

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side */}
          <AnimatedSection>
            <div className="relative">
              <div
                className="rounded-3xl p-8 lg:p-10 relative overflow-hidden"
                style={{ backgroundColor: `${color}10` }}
              >
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/2"
                  style={{ backgroundColor: `${color}15` }}
                />
                <div
                  className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/2"
                  style={{ backgroundColor: `${color}10` }}
                />

                <div className="relative z-10">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: color }}
                  >
                    <DynamicIcon name={page.iconName} size={40} className="text-white" />
                  </motion.div>

                  <h3
                    className="text-2xl lg:text-3xl font-bold mb-3"
                    style={{ color }}
                  >
                    {page.title}
                  </h3>
                  <p className="text-lg font-medium" style={{ color: `${color}cc` }}>
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
                        style={{ backgroundColor: `${color}12` }}
                      >
                        <p className="text-2xl font-bold" style={{ color }}>{stat.number}</p>
                        <p className="text-sm" style={{ color: `${color}aa` }}>{stat.label}</p>
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
                backgroundColor: `${color}15`,
                color,
                borderColor: `${color}30`,
              }}
            >
              {page.title}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-allstate-navy mb-6">
              {page.tagline}
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              {page.description}
            </p>
            <p className="text-muted-foreground mb-8">
              As an Allstate Elite Agent, Suzanne Dwyer takes the time to understand your unique situation and find the right coverage at the right price. With in-person and virtual appointments available, getting the protection you need has never been easier.
            </p>

            <a href="tel:16107259900">
              <Button
                className="font-semibold shadow-lg hover:shadow-xl transition-all text-white"
                style={{ backgroundColor: color }}
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

function FeaturesGrid({ page }: { page: InsurancePageData }) {
  const color = page.iconColor || "#0033A0";

  return (
    <section className="py-20 lg:py-28 bg-allstate-light-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge
            className="mb-4"
            style={{
              backgroundColor: `${color}15`,
              color,
              borderColor: `${color}30`,
            }}
          >
            Coverage Details
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-allstate-navy mb-4">
            What&apos;s <span style={{ color }}>Covered</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {page.title} from Allstate provides comprehensive protection. Here&apos;s what your policy includes:
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {page.features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default border-allstate-gray/30 h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <CheckCircle2
                        size={20}
                        className="flex-shrink-0"
                        style={{ color }}
                      />
                    </div>
                    <p className="text-allstate-navy font-medium text-sm leading-relaxed">
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

function ProTipCallout({ page }: { page: InsurancePageData }) {
  const color = page.iconColor || "#0033A0";

  if (!page.tip) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-3xl p-8 lg:p-10 border-l-4 shadow-lg"
            style={{
              backgroundColor: `${color}08`,
              borderColor: color,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                <Sparkles size={28} style={{ color }} />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2" style={{ color }}>
                  Pro Tip from Suzanne
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
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
}: {
  allPages: InsurancePageData[];
  currentSlug: string;
}) {
  const otherPages = allPages.filter((p) => p.slug !== currentSlug);

  return (
    <section className="py-20 lg:py-28 bg-allstate-light-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="bg-allstate-blue/10 text-allstate-blue border-allstate-blue/20 mb-4">
            Explore More
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-allstate-navy mb-4">
            Other Insurance <span className="text-allstate-blue">Options</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Suzanne Dwyer offers a full range of Allstate insurance products. Explore other coverage types to protect every aspect of your life.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {otherPages.map((page, i) => {
            const color = page.iconColor || "#0033A0";
            const bgColor = page.iconBgColor || `${color}15`;

            return (
              <AnimatedSection key={page.id} delay={i * 0.05}>
                <a href={`/insurance/${page.slug}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-allstate-gray/30 h-full">
                    <CardHeader className="pb-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: bgColor }}
                      >
                        <DynamicIcon name={page.iconName} size={28} style={{ color }} />
                      </div>
                      <CardTitle className="text-lg text-allstate-navy group-hover:text-allstate-blue transition-colors">
                        {page.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground text-sm">
                        {page.tagline}
                      </CardDescription>
                      <div className="mt-4 flex items-center text-allstate-blue font-medium text-sm group-hover:gap-2 transition-all">
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

function CTASection({ page, agentInfo }: { page: InsurancePageData; agentInfo: Record<string, string> }) {
  const color = page.iconColor || "#0033A0";
  const phone = agentInfo.phone || "(610) 725-9900";

  return (
    <section className="py-16 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 50%, #001e60 100%)` }}>
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
            Get a personalized {page.title.toLowerCase()} quote from Suzanne Dwyer today. Bundle and save up to 25% on your premiums!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
              <Button
                size="lg"
                className="bg-allstate-orange hover:bg-orange-600 text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
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

// ─── Footer ────────────────────────────────────────────────────────

function Footer({
  agentInfo,
  insurancePages,
}: {
  agentInfo: Record<string, string>;
  insurancePages: InsurancePageData[];
}) {
  const agentName = agentInfo.name || "Suzanne Dwyer";
  const phone = agentInfo.phone || "(610) 725-9900";
  const email = agentInfo.email || "suzannedwyer@allstate.com";
  const address = agentInfo.address || "Wynnewood, PA 19096";

  return (
    <footer className="bg-allstate-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Agent Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-allstate-blue flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">{agentName}</p>
                <p className="text-allstate-light text-sm">Allstate Insurance Agent</p>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Elite Agent serving Wynnewood, PA and the surrounding communities in Pennsylvania, New Jersey, and Delaware.
            </p>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-allstate-orange" />
              <span className="text-allstate-orange font-semibold text-sm">Elite Agent</span>
            </div>
          </div>

          {/* Insurance Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Insurance</h4>
            <ul className="space-y-2">
              {insurancePages.slice(0, 6).map((type) => (
                <li key={type.id}>
                  <a
                    href={`/insurance/${type.slug}`}
                    className="text-white/60 hover:text-allstate-light text-sm transition-colors"
                  >
                    {type.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Insurance */}
          <div>
            <h4 className="font-semibold text-white mb-4">More Services</h4>
            <ul className="space-y-2">
              {insurancePages.slice(6).map((type) => (
                <li key={type.id}>
                  <a
                    href={`/insurance/${type.slug}`}
                    className="text-white/60 hover:text-allstate-light text-sm transition-colors"
                  >
                    {type.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-allstate-light" />
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-white/60 hover:text-allstate-light text-sm">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-allstate-light" />
                <a href={`mailto:${email}`} className="text-white/60 hover:text-allstate-light text-sm break-all">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-allstate-light" />
                <span className="text-white/60 text-sm">{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-allstate-light" />
                <span className="text-white/60 text-sm">Mon-Fri: 8:30 AM - 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white/50 text-xs">
              &copy; {new Date().getFullYear()} {agentName} &ndash; Allstate Insurance Agent. All Rights Reserved.
            </p>
            <p className="text-white/30 text-xs mt-1">
              You&apos;re in good hands&reg; &mdash; Allstate Insurance Company
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a href="https://www.allstate.com/" target="_blank" rel="noopener noreferrer" className="hover:text-allstate-light transition-colors">
              Allstate.com
            </a>
            <a href="https://www.allstate.com/privacy-center" target="_blank" rel="noopener noreferrer" className="hover:text-allstate-light transition-colors">
              Privacy
            </a>
            <a href="https://www.allstate.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-allstate-light transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── 404 Not Found ─────────────────────────────────────────────────

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-allstate-light-gradient">
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full bg-allstate-blue/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-allstate-blue" />
          </div>
          <h1 className="text-4xl font-bold text-allstate-navy mb-4">
            Insurance Type Not Found
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Sorry, we couldn&apos;t find the insurance type you&apos;re looking for. Please check the URL or browse our available insurance options.
          </p>
          <a href="/">
            <Button
              size="lg"
              className="bg-allstate-blue hover:bg-allstate-navy text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
              Back to Homepage
            </Button>
          </a>
        </motion.div>
      </div>
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
      <div className="min-h-screen flex items-center justify-center bg-allstate-light-gradient">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-allstate-blue flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <p className="text-allstate-navy font-semibold text-lg">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // No data
  if (!siteData) {
    return <NotFoundPage />;
  }

  const currentPage = siteData.insurancePages.find(
    (p) => p.slug === slug
  );

  // 404 if slug not found
  if (!currentPage) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        menuItems={siteData.menuItems}
        agentInfo={siteData.agentInfo}
        currentPageTitle={currentPage.title}
      />
      <main className="flex-1">
        <InsuranceHero page={currentPage} />
        <DescriptionSection page={currentPage} />
        <FeaturesGrid page={currentPage} />
        <ProTipCallout page={currentPage} />
        <OtherInsuranceTypes
          allPages={siteData.insurancePages}
          currentSlug={slug}
        />
        <CTASection page={currentPage} agentInfo={siteData.agentInfo} />
      </main>
      <Footer
        agentInfo={siteData.agentInfo}
        insurancePages={siteData.insurancePages}
      />
    </div>
  );
}
