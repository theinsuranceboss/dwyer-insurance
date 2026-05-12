"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ChevronDown,
  Award,
  Handshake,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Globe,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import DynamicIcon from "@/components/DynamicIcon";
import AnimatedSection from "@/components/AnimatedSection";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// ─── Types ─────────────────────────────────────────────────────────

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
  heroBannerImage: string;
  heroBannerOverlay: string;
  heroBannerOverlayOpacity: string;
  aboutBgColor: string;
  servicesBgColor: string;
  footerBgColor: string;
  footerText: string;
  footerCopyright: string;
  logoUrl: string;
  logoText: string;
  logoSubtext: string;
  [key: string]: string;
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  isDropdown: boolean;
  parent: string | null;
  iconName: string;
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

interface SiteData {
  settings: Settings;
  menuItems: MenuItem[];
  agentInfo: AgentInfo;
  insurancePages: InsurancePage[];
  pageSections: PageSection[];
}

// ─── Helper Components ─────────────────────────────────────────────

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

// ─── Loading Skeleton ──────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 shadow-sm" style={{ backgroundColor: "#001e60" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="hidden sm:block space-y-1">
              <Skeleton className="w-36 h-5" />
              <Skeleton className="w-28 h-3" />
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-16 h-4" />
            ))}
            <Skeleton className="w-28 h-9 rounded-md" />
          </div>
          <Skeleton className="lg:hidden w-8 h-8" />
        </div>
      </div>

      {/* About hero skeleton */}
      <div className="pt-20">
        <div className="min-h-[50vh] flex items-center" style={{ backgroundColor: "#001e60" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
            <Skeleton className="w-32 h-8 rounded-full mb-6" />
            <Skeleton className="w-96 h-16 mb-4" />
            <Skeleton className="w-80 h-12 mb-8" />
            <div className="flex gap-4">
              <Skeleton className="w-48 h-14 rounded-xl" />
              <Skeleton className="w-48 h-14 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <Skeleton className="w-80 h-80 rounded-3xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-64 h-10" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── About Hero Section ────────────────────────────────────────────

function AboutHero({
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

  return (
    <section className="relative overflow-hidden pt-16 lg:pt-20">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${settings.darkColor} 0%, ${settings.primaryColor} 40%, ${settings.secondaryColor} 100%)`,
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
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${settings.accentColor}15` }}
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
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
                {agentInfo.badge}
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
              {aboutSection?.title || "About Us"}
              <span
                className="block mt-2"
                style={{
                  background: `linear-gradient(135deg, ${settings.lightColor}, ${settings.accentColor})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {aboutSection?.subtitle || "Your Trusted Insurance Partner"}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-white/80 max-w-lg"
            >
              {aboutSection?.description
                ? aboutSection.description.split("\n\n")[0]
                : "Dedicated to providing personalized insurance solutions with decades of industry expertise and compassionate claims support."}
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
                  Call {agentInfo.phone}
                </Button>
              </a>
              <a href="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 bg-transparent"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Right - Agent Photo */}
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
      </div>
    </section>
  );
}

// ─── About Content Section ─────────────────────────────────────────

function AboutContent({
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
  const languages = agentInfo.languages.split(",").map((s) => s.trim());

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
    <section className={`py-20 lg:py-28 ${settings.aboutBgColor ? "" : "bg-white"}`} style={settings.aboutBgColor ? { backgroundColor: settings.aboutBgColor } : undefined}>
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
                  <p className="font-medium text-lg mb-2" style={{ color: settings.lightColor }}>
                    {agentInfo.title}
                  </p>
                  <p className="font-medium mb-4" style={{ color: settings.lightColor }}>
                    {agentInfo.badge}
                  </p>
                  <p className="text-white/80 mb-6">
                    Dedicated to providing personalized insurance solutions with decades of
                    industry expertise and claims support.
                  </p>

                  {/* Contact details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-white/80">
                      <Phone size={16} style={{ color: settings.lightColor }} />
                      <a href={agentInfo.phoneLink} className="hover:text-white transition-colors">{agentInfo.phone}</a>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Mail size={16} style={{ color: settings.lightColor }} />
                      <a href={`mailto:${agentInfo.email}`} className="hover:text-white transition-colors">{agentInfo.email}</a>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <MapPin size={16} style={{ color: settings.lightColor }} />
                      <span>{agentInfo.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Globe size={16} style={{ color: settings.lightColor }} />
                      <span>Licensed in {agentInfo.states}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Clock size={16} style={{ color: settings.lightColor }} />
                      <span>Mon–Fri: 8:30 AM – 5:00 PM</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Clock size={16} className="opacity-0" />
                      <span>Saturday: By Appointment</span>
                    </div>
                  </div>

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
              {aboutSection?.subtitle || "About Us"}
            </Badge>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-6"
              style={{ color: settings.secondaryColor, fontFamily: settings.headingFont }}
            >
              {aboutSection?.title || "Your Trusted Insurance Partner"}
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

            {/* Feature Cards */}
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

            <a href={agentInfo.phoneLink}>
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

// ─── Stats Counter Section ─────────────────────────────────────────

function StatsSection({
  settings,
  agentInfo,
  aboutSection,
}: {
  settings: Settings;
  agentInfo: AgentInfo;
  aboutSection: PageSection | undefined;
}) {
  const reviewCount = parseInt(agentInfo.reviewCount) || 0;
  const states = agentInfo.states.split(",").map((s) => s.trim());

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
    <section className="py-16 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${settings.darkColor} 0%, ${settings.primaryColor} 100%)` }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: `${settings.lightColor}10` }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <motion.p
                  className="text-4xl lg:text-5xl font-bold mb-2"
                  style={{ color: settings.lightColor }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.p>
                <p className="text-white/70 font-medium">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Grid Section ─────────────────────────────────────────

function FeaturesSection({ settings, agentInfo }: { settings: Settings; agentInfo: AgentInfo }) {
  const features = [
    {
      icon: ShieldCheck,
      title: "Personalized Coverage",
      desc: "We take the time to understand your unique situation and tailor insurance solutions that fit your life, not the other way around.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      desc: "Round-the-clock claims support and after-hours appointments mean we're always there when you need us most.",
    },
    {
      icon: Handshake,
      title: "Trusted Partnership",
      desc: "Building lasting relationships based on trust and transparency. We're your neighbor, not just your agent.",
    },
    {
      icon: Globe,
      title: "Bilingual Service",
      desc: `Serving clients in ${agentInfo.languages} — because everyone deserves clear, confident communication about their coverage.`,
    },
    {
      icon: Award,
      title: "Award-Winning Service",
      desc: `${agentInfo.badge} — recognized for excellence in customer service and community commitment.`,
    },
    {
      icon: Users,
      title: "Community Focused",
      desc: `Proudly serving ${agentInfo.states} with deep local knowledge and genuine care for our neighbors' wellbeing.`,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge
            className="mb-4 border-0"
            style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
          >
            Why Choose Us
          </Badge>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: settings.secondaryColor, fontFamily: settings.headingFont }}
          >
            What Sets Us <span style={{ color: settings.primaryColor }}>Apart</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            At Dwyer Insurance Group, we combine industry expertise with genuine care to deliver an insurance experience unlike any other.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.08}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default h-full border-gray-200">
                <CardContent className="pt-8 pb-6 px-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${settings.primaryColor}12` }}
                  >
                    <feature.icon className="w-7 h-7" style={{ color: settings.primaryColor }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: settings.secondaryColor }}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.desc}
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

// ─── CTA Section ───────────────────────────────────────────────────

function CTASection({ settings, agentInfo }: { settings: Settings; agentInfo: AgentInfo }) {
  return (
    <section className="py-16 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.primaryColor}cc 50%, ${settings.darkColor} 100%)` }}>
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl"
        style={{ backgroundColor: `${settings.lightColor}20` }}
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl"
        style={{ backgroundColor: `${settings.accentColor}15` }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <AnimatedSection>
          <Badge
            className="mb-6 px-4 py-2 text-sm font-semibold border-0"
            style={{
              backgroundColor: `${settings.accentColor}25`,
              color: settings.accentColor,
            }}
          >
            <Phone className="w-4 h-4 mr-2" />
            Get In Touch
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Protect What Matters Most?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Contact Dwyer Insurance Group today for a personalized consultation. Let us find the right coverage at the right price for you and your family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={agentInfo.phoneLink}>
              <Button
                size="lg"
                className="text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                style={{ backgroundColor: settings.accentColor }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {agentInfo.phone}
              </Button>
            </a>
            <a href={`mailto:${agentInfo.email}`}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 bg-transparent"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────
// Footer is now imported from @/components/Footer

// ─── Main About Page ───────────────────────────────────────────────

export default function AboutPage() {
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

  const { settings, menuItems, agentInfo, insurancePages, pageSections } = data;
  const aboutSection = pageSections.find((s) => s.section === "about");

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
        settings={settings}
      />
      <main className="flex-1">
        <AboutHero
          settings={settings}
          agentInfo={agentInfo}
          aboutSection={aboutSection}
        />
        <AboutContent
          settings={settings}
          agentInfo={agentInfo}
          aboutSection={aboutSection}
        />
        <StatsSection
          settings={settings}
          agentInfo={agentInfo}
          aboutSection={aboutSection}
        />
        <FeaturesSection
          settings={settings}
          agentInfo={agentInfo}
        />
        <CTASection
          settings={settings}
          agentInfo={agentInfo}
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
