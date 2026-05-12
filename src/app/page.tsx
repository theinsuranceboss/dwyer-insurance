"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Users,
  Handshake,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Globe,
  Send,
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
import DynamicIcon from "@/components/DynamicIcon";
import AnimatedSection from "@/components/AnimatedSection";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
  footerColumn1Title: string;
  footerColumn2Title: string;
  footerColumn3Title: string;
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
      <div className="fixed top-0 left-0 right-0 z-50 shadow-sm" style={{ backgroundColor: "#001e60" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded" />
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

  const hasBannerImage = !!settings.heroBannerImage;
  const overlayColor = settings.heroBannerOverlay || "#001e60";
  const overlayOpacity = Math.min(100, Math.max(0, parseInt(settings.heroBannerOverlayOpacity || "80"))) / 100;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background - banner image or gradient */}
      {hasBannerImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${settings.heroBannerImage})` }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${settings.darkColor} 0%, ${settings.primaryColor} 40%, ${settings.primaryColor} 60%, ${settings.secondaryColor} 100%)`,
          }}
        />
      )}

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
              className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { icon: Clock, label: "Office Hours", value: "Mon-Fri 8:30-5:00 PM" },
                { icon: Clock, label: "Saturday", value: "By Appointment" },
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
    <section id="services" className="py-20 lg:py-28" style={settings.servicesBgColor ? { backgroundColor: settings.servicesBgColor } : { background: `linear-gradient(180deg, #f8fafc 0%, ${settings.primaryColor}08 100%)` }}>
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
              "From auto and home to life and business, we offer a full range of insurance products to protect every aspect of your life."}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {insurancePages.map((page, i) => (
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
                      <DynamicIcon
                        name={page.iconName}
                        size={28}
                        style={{ color: page.iconColor }}
                      />
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
          ))}
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
      title: "Proven Financial Strength",
      desc: "Backed by decades of industry experience and partnerships with leading insurance carriers.",
    },
    {
      icon: Award,
      title: `${agentInfo.badge} Recognition`,
      desc: "Our elite status reflects our commitment to exceptional service and client satisfaction.",
    },
    {
      icon: Users,
      title: "Personalized Attention",
      desc: "Every client gets a customized insurance review. No cookie-cutter policies here.",
    },
    {
      icon: Handshake,
      title: "Local Community Expert",
      desc: "Based in Wynnewood, PA, we understand the unique needs of the community.",
    },
    {
      icon: CheckCircle2,
      title: "Claims Satisfaction Guarantee",
      desc: "Our claims satisfaction guarantee means you are happy with the outcome, or we make it right.",
    },
    {
      icon: Phone,
      title: "Easy to Reach",
      desc: `Call ${agentInfo.phone}, text ${agentInfo.textNumber}, or email — we are always accessible.`,
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
            {whySection?.title || "Why Families Trust Us"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {whySection?.description ||
              "Choosing the right insurance agent makes all the difference. Here is why hundreds of families trust us with their protection."}
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
              "Do not just take our word for it — hear from the families and individuals who trust us with their insurance needs."}
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
              "Have questions? We have answers. If you do not see what you are looking for, feel free to contact us directly."}
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => (
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
              "Thank you for your inquiry. We will get back to you within 24 hours.",
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
              "Ready to protect what matters most? Contact us today for a free, no-obligation insurance consultation and quote."}
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
                      <p className="font-semibold" style={{ color: settings.secondaryColor }}>
                        {agentInfo.phone}
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
                      <p className="font-semibold" style={{ color: settings.secondaryColor }}>
                        {agentInfo.email}
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 -mx-3 px-3 py-2">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${settings.primaryColor}12` }}
                    >
                      <MapPin className="w-5 h-5" style={{ color: settings.primaryColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Visit Us</p>
                      <p className="font-semibold" style={{ color: settings.secondaryColor }}>
                        Wynnewood, PA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 -mx-3 px-3 py-2">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${settings.primaryColor}12` }}
                    >
                      <Clock className="w-5 h-5" style={{ color: settings.primaryColor }} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Office Hours</p>
                      <div className="font-semibold" style={{ color: settings.secondaryColor }}>
                        <p>Mon-Fri: 8:30 AM - 5:00 PM</p>
                        <p>Saturday: By Appointment</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Map Placeholder */}
              <Card
                className="p-6"
                style={{ borderRadius: `${settings.borderRadius}px` }}
              >
                <div
                  className="w-full h-48 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${settings.primaryColor}08` }}
                >
                  <div className="text-center">
                    <MapPin className="w-10 h-10 mx-auto mb-2" style={{ color: settings.primaryColor }} />
                    <p className="font-semibold" style={{ color: settings.secondaryColor }}>
                      {agentInfo.address}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Serving PA, NY, and DE
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

function CTABanner({
  settings,
  agentInfo,
  ctaSection,
}: {
  settings: Settings;
  agentInfo: AgentInfo;
  ctaSection: PageSection | undefined;
}) {
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${settings.darkColor} 0%, ${settings.primaryColor} 50%, ${settings.secondaryColor} 100%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,.1) 0%, transparent 50%)",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: `${settings.accentColor}25` }}
            >
              <Shield className="w-10 h-10" style={{ color: settings.accentColor }} />
            </div>
          </motion.div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: settings.headingFont }}
          >
            {ctaSection?.title || "Ready to Protect What Matters Most?"}
          </h2>
          <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            {ctaSection?.description ||
              "Get a personalized insurance review and competitive quotes. Our expert team is here to help you find the perfect coverage."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={agentInfo.phoneLink}>
              <Button
                size="lg"
                className="text-white font-bold text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
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
                className="border-white/30 text-white hover:bg-white/10 font-bold text-lg px-10 py-7 bg-transparent"
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

// Footer is now imported from @/components/Footer

// ─── Main Page ───────────────────────────────────────────────────

export default function HomePage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/site-data");
        if (!res.ok) throw new Error("Failed to fetch site data");
        const json = await res.json();
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

  // Helper to find a section by key
  const findSection = (key: string) => pageSections.find((s) => s.section === key);

  // Apply dynamic CSS custom properties
  const cssVars: Record<string, string> = {
    "--color-primary": settings.primaryColor || "#0033A0",
    "--color-secondary": settings.secondaryColor || "#001e60",
    "--color-accent": settings.accentColor || "#ff9e16",
    "--color-light": settings.lightColor || "#57b6ff",
    "--color-dark": settings.darkColor || "#001e60",
  };

  return (
    <div style={cssVars as React.CSSProperties}>
      <Navigation menuItems={menuItems} agentInfo={agentInfo} settings={settings} />
      <HeroSection settings={settings} agentInfo={agentInfo} heroSection={findSection("hero")} />
      <ServicesSection settings={settings} insurancePages={insurancePages} servicesSection={findSection("services")} />
      <WhyChooseUsSection settings={settings} agentInfo={agentInfo} whySection={findSection("whyChooseUs")} />
      <TestimonialsSection settings={settings} testimonials={testimonials} testimonialsSection={findSection("testimonials")} />
      <FaqSection settings={settings} faqs={faqs} faqSection={findSection("faq")} />
      <ContactSection settings={settings} agentInfo={agentInfo} insurancePages={insurancePages} contactSection={findSection("contact")} />
      <CTABanner settings={settings} agentInfo={agentInfo} ctaSection={findSection("ctaBanner")} />
      <Footer settings={settings} agentInfo={agentInfo} insurancePages={insurancePages} />
    </div>
  );
}
