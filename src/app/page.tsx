"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Award,
  Users,
  Handshake,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Globe,
  ShieldCheck,
  Fingerprint,
  Wrench,
  Landmark,
  Briefcase,
  Send,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// ─── Icon Mapping ────────────────────────────────────────────────

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Car,
  Home,
  Heart,
  Building2,
  Landmark,
  Bike,
  Briefcase,
  Ship,
  TreePine,
  Umbrella,
  Fingerprint,
  Wrench,
  Shield,
};

function BriefcaseIcon(props: { size?: number; className?: string }) {
  const { size = 24, className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function getIcon(iconName: string) {
  if (iconName === "Briefcase") return BriefcaseIcon;
  return iconMap[iconName] || Shield;
}

// ─── Types ───────────────────────────────────────────────────────

interface Settings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  lightColor: string;
  darkColor: string;
  headingFont: string;
  bodyFont: string;
  baseFontSize: string;
  headingFontSize: string;
  borderRadius: string;
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCtaText: string;
  heroCta2Text: string;
  footerText: string;
  footerCopyright: string;
  [key: string]: string;
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  isDropdown: boolean;
}

interface AgentInfo {
  name: string;
  title: string;
  badge: string;
  phone: string;
  phoneLink: string;
  textNumber: string;
  email: string;
  address: string;
  states: string;
  languages: string;
  rating: string;
  reviewCount: string;
  photo: string;
  tagline: string;
  [key: string]: string;
}

interface InsurancePage {
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

interface PageSection {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  visible: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  order: number;
  visible: boolean;
}

interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  visible: boolean;
}

interface SiteData {
  settings: Settings;
  menuItems: MenuItem[];
  agentInfo: AgentInfo;
  insurancePages: InsurancePage[];
  pageSections: PageSection[];
  testimonials: Testimonial[];
  faqs: Faq[];
}

// ─── Helper Components ───────────────────────────────────────────

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
  const isInView = useInView(ref, { once: true, margin: "-80px" });

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

// ─── Loading Skeleton ────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="hidden sm:block space-y-1">
              <Skeleton className="w-36 h-5" />
              <Skeleton className="w-28 h-3" />
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="w-16 h-4" />
            ))}
            <Skeleton className="w-28 h-9 rounded-md" />
          </div>
          <Skeleton className="lg:hidden w-8 h-8" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="w-48 h-8 rounded-full" />
              <Skeleton className="w-64 h-16" />
              <Skeleton className="w-48 h-12" />
              <Skeleton className="w-full max-w-lg h-24" />
              <div className="flex gap-4">
                <Skeleton className="w-48 h-14 rounded-xl" />
                <Skeleton className="w-48 h-14 rounded-xl" />
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <Skeleton className="w-80 h-80 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Services skeleton */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="w-32 h-8 rounded-full mx-auto" />
            <Skeleton className="w-80 h-10 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="border-gray-200">
                <CardHeader className="pb-3">
                  <Skeleton className="w-14 h-14 rounded-2xl mb-3" />
                  <Skeleton className="w-32 h-5" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-24 h-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Navigation ──────────────────────────────────────────────────

function Navigation({
  menuItems,
  agentInfo,
  insurancePages,
  settings,
}: {
  menuItems: MenuItem[];
  agentInfo: AgentInfo;
  insurancePages: InsurancePage[];
  settings: Settings;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Separate top-level nav items and the dropdown item
  const dropdownItem = menuItems.find((item) => item.isDropdown);
  const topNavItems = menuItems.filter((item) => !item.isDropdown);
  // Insurance pages that are NOT already in the top nav
  const topNavInsuranceHrefs = menuItems
    .filter((item) => item.href.startsWith("/insurance/"))
    .map((item) => item.href);
  const dropdownInsurancePages = insurancePages.filter(
    (page) => !topNavInsuranceHrefs.includes(`/insurance/${page.slug}`)
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      style={scrolled ? { borderBottom: `1px solid ${settings.lightColor}30` } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <p
                className={`font-bold text-lg leading-tight ${scrolled ? "" : "text-white"}`}
                style={scrolled ? { color: settings.secondaryColor } : undefined}
              >
                {agentInfo.name}
              </p>
              <p
                className={`text-xs leading-tight ${scrolled ? "" : "text-white/70"}`}
                style={scrolled ? { color: settings.primaryColor } : undefined}
              >
                {agentInfo.title}
              </p>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {topNavItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`nav-link text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  scrolled
                    ? "hover:bg-gray-100"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
                style={scrolled ? { color: settings.secondaryColor } : undefined}
              >
                {item.label}
              </a>
            ))}

            {/* More Insurance dropdown */}
            {dropdownItem && dropdownInsurancePages.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  className={`nav-link text-sm font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-1 ${
                    scrolled
                      ? "hover:bg-gray-100"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                  style={scrolled ? { color: settings.secondaryColor } : undefined}
                >
                  {dropdownItem.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      onMouseLeave={() => setDropdownOpen(false)}
                      className="absolute top-full right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {dropdownInsurancePages.map((page) => {
                          const IconComp = getIcon(page.iconName);
                          return (
                            <a
                              key={page.id}
                              href={`/insurance/${page.slug}`}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: page.iconBgColor }}
                              >
                                <IconComp
                                  size={16}
                                  style={{ color: page.iconColor }}
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {page.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-[160px]">
                                  {page.tagline}
                                </p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <a href={agentInfo.phoneLink} className="ml-3">
              <Button
                size="sm"
                className="text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: settings.accentColor }}
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
              <X className={scrolled ? "" : "text-white"} size={24} style={scrolled ? { color: settings.secondaryColor } : undefined} />
            ) : (
              <Menu className={scrolled ? "" : "text-white"} size={24} style={scrolled ? { color: settings.secondaryColor } : undefined} />
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
            className="lg:hidden bg-white shadow-xl border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {topNavItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg transition-colors font-medium hover:bg-gray-50"
                  style={{ color: settings.secondaryColor }}
                >
                  {item.label}
                </a>
              ))}

              {/* Mobile dropdown for more insurance */}
              {dropdownItem && dropdownInsurancePages.length > 0 && (
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors font-medium hover:bg-gray-50"
                    style={{ color: settings.secondaryColor }}
                  >
                    {dropdownItem.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-6 space-y-1">
                          {dropdownInsurancePages.map((page) => {
                            const IconComp = getIcon(page.iconName);
                            return (
                              <a
                                key={page.id}
                                href={`/insurance/${page.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div
                                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: page.iconBgColor }}
                                >
                                  <IconComp
                                    size={14}
                                    style={{ color: page.iconColor }}
                                  />
                                </div>
                                <span className="text-sm" style={{ color: settings.secondaryColor }}>
                                  {page.title}
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <Separator className="my-2" />
              <a href={agentInfo.phoneLink} className="block pt-2">
                <Button
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Get a Quote: {agentInfo.phone}
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero Section ────────────────────────────────────────────────

function HeroSection({
  settings,
  agentInfo,
  heroSection,
}: {
  settings: Settings;
  agentInfo: AgentInfo;
  heroSection: PageSection | undefined;
}) {
  const rating = parseFloat(agentInfo.rating) || 0;
  const reviewCount = parseInt(agentInfo.reviewCount) || 0;
  const states = agentInfo.states.split(",").map((s) => s.trim());
  const languages = agentInfo.languages.split(",").map((s) => s.trim());

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Gradient background - no house image */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${settings.darkColor} 0%, ${settings.primaryColor} 40%, ${settings.primaryColor} 60%, ${settings.secondaryColor} 100%)`,
        }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${settings.lightColor}15` }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${settings.accentColor}15` }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ backgroundColor: `${settings.primaryColor}10` }}
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
              <Badge
                className="mb-6 px-4 py-2 text-sm font-semibold border-0"
                style={{
                  backgroundColor: `${settings.accentColor}25`,
                  color: settings.accentColor,
                }}
              >
                <Award className="w-4 h-4 mr-2" />
                {agentInfo.badge} — Allstate
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-bold text-white leading-tight"
              style={{
                fontFamily: settings.headingFont,
                fontSize: `${settings.headingFontSize}px`,
              }}
            >
              {heroSection?.title || settings.heroTitle}
              <span
                className="block mt-2"
                style={{
                  background: `linear-gradient(135deg, ${settings.lightColor}, ${settings.accentColor})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {heroSection?.subtitle || settings.heroSubtitle}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-white/80 max-w-lg"
            >
              {heroSection?.description || settings.heroDescription}
            </motion.p>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 flex items-center gap-3"
            >
              <StarRating rating={rating} size={20} />
              <span className="text-white font-bold text-lg">{rating}</span>
              <span className="text-white/60">|</span>
              <span className="font-medium" style={{ color: settings.lightColor }}>
                {reviewCount}+ Reviews
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <a href={agentInfo.phoneLink}>
                <Button
                  size="lg"
                  className="text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {settings.heroCta2Text} {agentInfo.phone}
                </Button>
              </a>
              <a href="#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 bg-transparent"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {settings.heroCtaText}
                </Button>
              </a>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: Clock, label: "Mon–Fri", value: "8:30–5:00 PM" },
                {
                  icon: Globe,
                  label: "Languages",
                  value: languages.map((l) => l.substring(0, 2).toUpperCase()).join(" / "),
                },
                {
                  icon: MapPin,
                  label: "Serving",
                  value: states.map((s) => s.substring(0, 2).toUpperCase()).join(", "),
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/70">
                  <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: settings.lightColor }} />
                  <div>
                    <p className="text-xs text-white/50">{item.label}</p>
                    <p className="text-sm font-medium text-white/90">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Suzanne's Photo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              {/* Decorative ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px dashed ${settings.lightColor}40`,
                  margin: "-16px",
                }}
              />
              {/* Outer glow */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                  backgroundColor: `${settings.lightColor}20`,
                  margin: "-20px",
                }}
              />
              {/* Photo container */}
              <div
                className="relative w-72 h-72 xl:w-80 xl:h-80 rounded-full overflow-hidden shadow-2xl"
                style={{
                  border: `6px solid ${settings.lightColor}`,
                  boxShadow: `0 0 40px ${settings.lightColor}30`,
                }}
              >
                <img
                  src={agentInfo.photo}
                  alt={`${agentInfo.name} - ${agentInfo.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Badge floating */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-xl text-white font-bold text-sm whitespace-nowrap"
                style={{ backgroundColor: settings.accentColor }}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {agentInfo.badge}
                </div>
              </motion.div>
              {/* Rating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-4 top-8 px-4 py-2 rounded-xl shadow-xl bg-white"
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900">{rating}</span>
                  <span className="text-xs text-gray-500">/5</span>
                </div>
              </motion.div>
              {/* Tagline */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-8 top-16 px-4 py-2 rounded-xl shadow-xl"
                style={{ backgroundColor: settings.secondaryColor }}
              >
                <p className="text-white text-sm font-medium italic">
                  &ldquo;{agentInfo.tagline}&rdquo;
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/40" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── About Section ───────────────────────────────────────────────

function AboutSection({
  settings,
  agentInfo,
  aboutSection,
}: {
  settings: Settings;
  agentInfo: AgentInfo;
  aboutSection: PageSection | undefined;
}) {
  const rating = parseFloat(agentInfo.rating) || 0;
  const reviewCount = parseInt(agentInfo.reviewCount) || 0;
  const states = agentInfo.states.split(",").map((s) => s.trim());

  // Parse stats from section content if available
  let stats: { number: string; label: string }[] = [
    { number: `${reviewCount}+`, label: "Happy Clients" },
    { number: agentInfo.rating, label: "Star Rating" },
    { number: `${states.length}`, label: "States Licensed" },
    { number: "12+", label: "Insurance Types" },
  ];

  if (aboutSection?.content) {
    try {
      const parsed = JSON.parse(aboutSection.content);
      if (parsed.stats) stats = parsed.stats;
    } catch {
      // use defaults
    }
  }

  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side */}
          <AnimatedSection>
            <div className="relative">
              <div
                className="rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${settings.secondaryColor} 0%, ${settings.primaryColor} 50%, ${settings.darkColor} 100%)`,
                }}
              >
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2"
                  style={{ backgroundColor: `${settings.lightColor}15` }}
                />
                <div
                  className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/2"
                  style={{ backgroundColor: `${settings.accentColor}15` }}
                />

                <div className="relative z-10">
                  <div
                    className="w-28 h-28 rounded-full border-4 overflow-hidden mb-6 mx-auto lg:mx-0"
                    style={{ borderColor: settings.lightColor, backgroundColor: settings.darkColor }}
                  >
                    <img
                      src={agentInfo.photo}
                      alt={`${agentInfo.name} - ${agentInfo.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{agentInfo.name}</h3>
                  <p className="font-medium text-lg mb-4" style={{ color: settings.lightColor }}>
                    Allstate {agentInfo.badge}
                  </p>
                  <p className="text-white/80 mb-6">
                    Dedicated to providing personalized insurance solutions with the backing of
                    Allstate&apos;s financial strength and claims expertise.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm"
                      >
                        <p className="text-2xl font-bold" style={{ color: settings.lightColor }}>
                          {stat.number}
                        </p>
                        <p className="text-sm text-white/70">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 text-white rounded-2xl px-4 py-3 shadow-xl"
                style={{ backgroundColor: settings.accentColor }}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-bold text-sm">{agentInfo.badge}</span>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Content Side */}
          <AnimatedSection delay={0.2}>
            <Badge
              className="mb-4 border-0"
              style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
            >
              {aboutSection?.subtitle || "About Suzanne"}
            </Badge>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-6"
              style={{ color: settings.secondaryColor, fontFamily: settings.headingFont }}
            >
              {aboutSection?.title || "Your Trusted Insurance Partner"}
              <span style={{ color: settings.primaryColor }}> in Wynnewood</span>
            </h2>
            {aboutSection?.description && (
              <>
                {aboutSection.description.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground text-lg mb-4">
                    {paragraph}
                  </p>
                ))}
              </>
            )}

            <div className="space-y-4 mb-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Personalized Coverage",
                  desc: "Tailored insurance solutions, not one-size-fits-all policies",
                },
                {
                  icon: Clock,
                  title: "24/7 Support",
                  desc: "Round-the-clock claims support and after-hours appointments",
                },
                {
                  icon: Handshake,
                  title: "Trusted Partnership",
                  desc: "Building lasting relationships based on trust and transparency",
                },
                {
                  icon: Globe,
                  title: "Bilingual Service",
                  desc: `Serving clients in ${agentInfo.languages}`,
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 group">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: `${settings.primaryColor}12` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: settings.primaryColor }} />
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: settings.secondaryColor }}>
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#contact">
              <Button
                className="text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: settings.primaryColor }}
              >
                Schedule a Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ─── Services Section ────────────────────────────────────────────

function ServicesSection({
  settings,
  insurancePages,
  servicesSection,
}: {
  settings: Settings;
  insurancePages: InsurancePage[];
  servicesSection: PageSection | undefined;
}) {
  return (
    <section id="services" className="py-20 lg:py-28" style={{ background: `linear-gradient(180deg, #f8fafc 0%, ${settings.primaryColor}08 100%)` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge
            className="mb-4 border-0"
            style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
          >
            {servicesSection?.subtitle || "Our Services"}
          </Badge>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: settings.secondaryColor, fontFamily: settings.headingFont }}
          >
            Comprehensive Insurance{" "}
            <span style={{ color: settings.primaryColor }}>Solutions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {servicesSection?.description ||
              "From auto and home to life and business, we offer a full range of Allstate insurance products to protect every aspect of your life."}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {insurancePages.map((page, i) => {
            const IconComp = getIcon(page.iconName);
            return (
              <AnimatedSection key={page.id} delay={i * 0.04}>
                <a href={`/insurance/${page.slug}`}>
                  <Card
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
                    style={{ borderRadius: `${settings.borderRadius}px` }}
                  >
                    <CardHeader className="pb-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: page.iconBgColor }}
                      >
                        <IconComp size={28} style={{ color: page.iconColor }} />
                      </div>
                      <CardTitle
                        className="text-lg group-hover:transition-colors"
                        style={{ color: settings.secondaryColor }}
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
                        style={{ color: settings.primaryColor }}
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

// ─── Why Choose Us Section ───────────────────────────────────────

function WhyChooseUsSection({
  settings,
  agentInfo,
  whySection,
}: {
  settings: Settings;
  agentInfo: AgentInfo;
  whySection: PageSection | undefined;
}) {
  const reasons = [
    {
      icon: Shield,
      title: "Allstate Financial Strength",
      desc: "Backed by one of the largest insurance companies in America with over 90 years of experience.",
    },
    {
      icon: Award,
      title: `${agentInfo.badge} Recognition`,
      desc: "Suzanne's elite status reflects her commitment to exceptional service and client satisfaction.",
    },
    {
      icon: Users,
      title: "Personalized Attention",
      desc: "Every client gets a customized insurance review. No cookie-cutter policies here.",
    },
    {
      icon: Handshake,
      title: "Local Community Expert",
      desc: `Based in ${agentInfo.address}, Suzanne understands the unique needs of the community.`,
    },
    {
      icon: CheckCircle2,
      title: "Claims Satisfaction Guarantee",
      desc: "Allstate's Claim Satisfaction Guarantee means you're happy with the outcome, or we make it right.",
    },
    {
      icon: Phone,
      title: "Easy to Reach",
      desc: `Call ${agentInfo.phone}, text ${agentInfo.textNumber}, or email — Suzanne is always accessible.`,
    },
  ];

  return (
    <section id="why-choose-us" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge
            className="mb-4 border-0"
            style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
          >
            {whySection?.subtitle || "Why Choose Us"}
          </Badge>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: settings.secondaryColor, fontFamily: settings.headingFont }}
          >
            {whySection?.title || "Why Families Trust Suzanne Dwyer"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {whySection?.description ||
              "Choosing the right insurance agent makes all the difference. Here's why hundreds of families trust Suzanne with their protection."}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <AnimatedSection key={reason.title} delay={i * 0.08}>
              <div className="group text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${settings.primaryColor}10` }}
                >
                  <reason.icon className="w-8 h-8" style={{ color: settings.primaryColor }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: settings.secondaryColor }}>
                  {reason.title}
                </h3>
                <p className="text-muted-foreground">{reason.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ────────────────────────────────────────

function TestimonialsSection({
  settings,
  testimonials,
  testimonialsSection,
}: {
  settings: Settings;
  testimonials: Testimonial[];
  testimonialsSection: PageSection | undefined;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const displayedTestimonials = testimonials.slice(0, 6);

  return (
    <section
      id="testimonials"
      className="py-20 lg:py-28"
      style={{ background: `linear-gradient(180deg, #f8fafc 0%, ${settings.primaryColor}08 100%)` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge
            className="mb-4 border-0"
            style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
          >
            {testimonialsSection?.subtitle || "Testimonials"}
          </Badge>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: settings.secondaryColor, fontFamily: settings.headingFont }}
          >
            {testimonialsSection?.title || "What Our Clients Say"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {testimonialsSection?.description ||
              "Don't just take our word for it — hear from the families and individuals who trust Suzanne Dwyer with their insurance needs."}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTestimonials.map((testimonial, i) => (
            <AnimatedSection key={testimonial.id} delay={i * 0.08}>
              <Card
                className="h-full hover:shadow-lg transition-shadow"
                style={{ borderRadius: `${settings.borderRadius}px` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: settings.primaryColor }}
                      >
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-base" style={{ color: settings.secondaryColor }}>
                          {testimonial.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                      </div>
                    </div>
                  </div>
                  <StarRating rating={testimonial.rating} size={14} />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────

function FaqSection({
  settings,
  faqs,
  faqSection,
}: {
  settings: Settings;
  faqs: Faq[];
  faqSection: PageSection | undefined;
}) {
  return (
    <section id="faq" className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge
            className="mb-4 border-0"
            style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
          >
            {faqSection?.subtitle || "FAQ"}
          </Badge>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: settings.secondaryColor, fontFamily: settings.headingFont }}
          >
            {faqSection?.title || "Frequently Asked Questions"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {faqSection?.description ||
              "Have questions? We have answers. If you don't see what you're looking for, feel free to contact us directly."}
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                style={{ borderColor: `${settings.primaryColor}20` }}
              >
                <AccordionTrigger
                  className="text-left font-semibold hover:no-underline py-5"
                  style={{ color: settings.secondaryColor }}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Contact Section ─────────────────────────────────────────────

function ContactSection({
  settings,
  agentInfo,
  insurancePages,
  contactSection,
}: {
  settings: Settings;
  agentInfo: AgentInfo;
  insurancePages: InsurancePage[];
  contactSection: PageSection | undefined;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    insuranceType: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          toast({
            title: "Message Sent!",
            description:
              data.message ||
              "Thank you for your inquiry. Suzanne will get back to you within 24 hours.",
          });
          setFormData({ name: "", email: "", phone: "", insuranceType: "", message: "" });
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to send message. Please try again.",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [formData, toast]
  );

  return (
    <section
      id="contact"
      className="py-20 lg:py-28"
      style={{ background: `linear-gradient(180deg, #f8fafc 0%, ${settings.primaryColor}08 100%)` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge
            className="mb-4 border-0"
            style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
          >
            {contactSection?.subtitle || "Contact Us"}
          </Badge>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: settings.secondaryColor, fontFamily: settings.headingFont }}
          >
            {contactSection?.title || "Get in Touch"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {contactSection?.description ||
              "Ready to protect what matters most? Contact Suzanne today for a free, no-obligation insurance consultation and quote."}
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <AnimatedSection>
            <Card
              className="p-6 lg:p-8"
              style={{ borderRadius: `${settings.borderRadius}px` }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(610) 555-1234"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuranceType">Insurance Type</Label>
                    <select
                      id="insuranceType"
                      value={formData.insuranceType}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, insuranceType: e.target.value }))
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select insurance type</option>
                      {insurancePages.map((page) => (
                        <option key={page.id} value={page.title}>
                          {page.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your insurance needs..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, message: e.target.value }))
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-white font-semibold py-6 text-lg"
                  style={{ backgroundColor: settings.primaryColor }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <Card
                className="p-6"
                style={{ borderRadius: `${settings.borderRadius}px` }}
              >
                <h3 className="text-xl font-bold mb-6" style={{ color: settings.secondaryColor }}>
                  Contact Information
                </h3>
                <div className="space-y-5">
                  <a
                    href={agentInfo.phoneLink}
                    className="flex items-center gap-4 group hover:bg-gray-50 -mx-3 px-3 py-2 rounded-lg transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${settings.primaryColor}12` }}
                    >
                      <Phone className="w-5 h-5" style={{ color: settings.primaryColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Call Us</p>
                      <p className="font-semibold group-hover:underline" style={{ color: settings.secondaryColor }}>
                        {agentInfo.phone}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`sms:${agentInfo.textNumber}`}
                    className="flex items-center gap-4 group hover:bg-gray-50 -mx-3 px-3 py-2 rounded-lg transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${settings.accentColor}15` }}
                    >
                      <MessageCircle className="w-5 h-5" style={{ color: settings.accentColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Text Us</p>
                      <p className="font-semibold group-hover:underline" style={{ color: settings.secondaryColor }}>
                        {agentInfo.textNumber}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${agentInfo.email}`}
                    className="flex items-center gap-4 group hover:bg-gray-50 -mx-3 px-3 py-2 rounded-lg transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${settings.primaryColor}12` }}
                    >
                      <Mail className="w-5 h-5" style={{ color: settings.primaryColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email Us</p>
                      <p className="font-semibold group-hover:underline text-sm" style={{ color: settings.secondaryColor }}>
                        {agentInfo.email}
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${settings.primaryColor}12` }}
                    >
                      <MapPin className="w-5 h-5" style={{ color: settings.primaryColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Visit Us</p>
                      <p className="font-semibold" style={{ color: settings.secondaryColor }}>
                        {agentInfo.address}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6"
                style={{ borderRadius: `${settings.borderRadius}px` }}
              >
                <h3 className="text-xl font-bold mb-4" style={{ color: settings.secondaryColor }}>
                  Office Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 flex-shrink-0" style={{ color: settings.primaryColor }} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium" style={{ color: settings.secondaryColor }}>Monday – Friday</span>
                        <span className="text-sm text-muted-foreground">8:30 AM – 5:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium" style={{ color: settings.secondaryColor }}>Saturday – Sunday</span>
                        <span className="text-sm text-muted-foreground">Closed</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" style={{ color: settings.accentColor }} />
                    After-hours appointments available by request
                  </p>
                </div>
              </Card>

              <Card
                className="p-6 text-white"
                style={{
                  background: `linear-gradient(135deg, ${settings.secondaryColor}, ${settings.primaryColor})`,
                  borderRadius: `${settings.borderRadius}px`,
                }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={agentInfo.photo}
                    alt={agentInfo.name}
                    className="w-16 h-16 rounded-full border-2 object-cover flex-shrink-0"
                    style={{ borderColor: settings.lightColor }}
                  />
                  <div>
                    <p className="font-bold text-lg">{agentInfo.name}</p>
                    <p className="text-sm opacity-80">{agentInfo.title}</p>
                    <p className="text-sm mt-2 italic" style={{ color: settings.lightColor }}>
                      &ldquo;{agentInfo.tagline}&rdquo;
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ──────────────────────────────────────────────────

function CtaBanner({
  settings,
  agentInfo,
  ctaSection,
}: {
  settings: Settings;
  agentInfo: AgentInfo;
  ctaSection: PageSection | undefined;
}) {
  return (
    <section
      className="py-16 lg:py-20 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${settings.darkColor} 0%, ${settings.primaryColor} 50%, ${settings.secondaryColor} 100%)`,
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: `${settings.lightColor}10` }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl"
          style={{ backgroundColor: `${settings.accentColor}10` }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: settings.headingFont }}
          >
            {ctaSection?.title || "Ready to Protect What Matters Most?"}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            {ctaSection?.description ||
              "Get a personalized insurance quote from Suzanne Dwyer today. Bundle and save up to 25% on your premiums!"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={agentInfo.phoneLink}>
              <Button
                size="lg"
                className="text-white font-bold text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                style={{ backgroundColor: settings.accentColor }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {agentInfo.phone}
              </Button>
            </a>
            <a href="#contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-bold text-lg px-10 py-6 bg-transparent"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Get a Free Quote
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────

function Footer({
  settings,
  agentInfo,
  insurancePages,
}: {
  settings: Settings;
  agentInfo: AgentInfo;
  insurancePages: InsurancePage[];
}) {
  const states = agentInfo.states.split(",").map((s) => s.trim());
  const topInsurance = insurancePages.slice(0, 6);
  const moreInsurance = insurancePages.slice(6);

  return (
    <footer
      className="text-white"
      style={{ backgroundColor: settings.darkColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Agent Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">{agentInfo.name}</p>
                <p className="text-xs text-white/60">{agentInfo.title}</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-4">{settings.siteDescription}</p>
            <p className="text-sm italic" style={{ color: settings.lightColor }}>
              &ldquo;{agentInfo.tagline}&rdquo;
            </p>
          </div>

          {/* Insurance Products */}
          <div>
            <h4 className="font-bold text-lg mb-5">Insurance Products</h4>
            <ul className="space-y-2.5">
              {topInsurance.map((page) => (
                <li key={page.id}>
                  <a
                    href={`/insurance/${page.slug}`}
                    className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1.5"
                  >
                    <ChevronRight size={12} />
                    {page.title}
                  </a>
                </li>
              ))}
              {moreInsurance.length > 0 && (
                <li className="pt-2">
                  <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">More Products</p>
                  {moreInsurance.map((page) => (
                    <a
                      key={page.id}
                      href={`/insurance/${page.slug}`}
                      className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1.5 py-1"
                    >
                      <ChevronRight size={12} />
                      {page.title}
                    </a>
                  ))}
                </li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "About Suzanne", href: "/#about" },
                { label: "Our Services", href: "/#services" },
                { label: "Why Choose Us", href: "/#why-choose-us" },
                { label: "Testimonials", href: "/#testimonials" },
                { label: "FAQ", href: "/#faq" },
                { label: "Contact Us", href: "/#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1.5"
                  >
                    <ChevronRight size={12} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-5">Contact Us</h4>
            <div className="space-y-4">
              <a
                href={agentInfo.phoneLink}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
              >
                <Phone size={16} style={{ color: settings.lightColor }} />
                {agentInfo.phone}
              </a>
              <a
                href={`sms:${agentInfo.textNumber}`}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
              >
                <MessageCircle size={16} style={{ color: settings.accentColor }} />
                Text: {agentInfo.textNumber}
              </a>
              <a
                href={`mailto:${agentInfo.email}`}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
              >
                <Mail size={16} style={{ color: settings.lightColor }} />
                {agentInfo.email}
              </a>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" style={{ color: settings.lightColor }} />
                {agentInfo.address}
              </div>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <Globe size={16} className="flex-shrink-0 mt-0.5" style={{ color: settings.lightColor }} />
                Licensed in {agentInfo.states}
              </div>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <Clock size={16} className="flex-shrink-0 mt-0.5" style={{ color: settings.lightColor }} />
                Mon–Fri: 8:30 AM – 5:00 PM
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} {settings.footerCopyright}</p>
          <p>{settings.footerText}</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────

export default function HomePage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/site-data");
        if (!res.ok) throw new Error("Failed to fetch");
        const json: SiteData = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching site data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !data) {
    return <LoadingSkeleton />;
  }

  const { settings, menuItems, agentInfo, insurancePages, pageSections, testimonials, faqs } = data;

  // Helper to get section by name
  const getSection = (name: string) => pageSections.find((s) => s.section === name);

  return (
    <div
      style={
        {
          "--dynamic-primary": settings.primaryColor,
          "--dynamic-secondary": settings.secondaryColor,
          "--dynamic-accent": settings.accentColor,
          "--dynamic-light": settings.lightColor,
          "--dynamic-dark": settings.darkColor,
          fontFamily: settings.bodyFont,
          fontSize: `${settings.baseFontSize}px`,
        } as React.CSSProperties
      }
      className="min-h-screen flex flex-col"
    >
      <Navigation
        menuItems={menuItems}
        agentInfo={agentInfo}
        insurancePages={insurancePages}
        settings={settings}
      />
      <main className="flex-1">
        <HeroSection
          settings={settings}
          agentInfo={agentInfo}
          heroSection={getSection("hero")}
        />
        <AboutSection
          settings={settings}
          agentInfo={agentInfo}
          aboutSection={getSection("about")}
        />
        <ServicesSection
          settings={settings}
          insurancePages={insurancePages}
          servicesSection={getSection("services")}
        />
        <WhyChooseUsSection
          settings={settings}
          agentInfo={agentInfo}
          whySection={getSection("whyChooseUs")}
        />
        <TestimonialsSection
          settings={settings}
          testimonials={testimonials}
          testimonialsSection={getSection("testimonials")}
        />
        <FaqSection
          settings={settings}
          faqs={faqs}
          faqSection={getSection("faq")}
        />
        <ContactSection
          settings={settings}
          agentInfo={agentInfo}
          insurancePages={insurancePages}
          contactSection={getSection("contact")}
        />
        <CtaBanner
          settings={settings}
          agentInfo={agentInfo}
          ctaSection={getSection("ctaBanner")}
        />
      </main>
      <Footer
        settings={settings}
        agentInfo={agentInfo}
        insurancePages={insurancePages}
      />
    </div>
  );
}
