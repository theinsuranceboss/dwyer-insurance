"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
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
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import DynamicIcon from "@/components/DynamicIcon";

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
  heroTextPosition: string;
  heroCtaColor: string;
  heroCtaLink: string;
  heroCta2Color: string;
  heroCta2Link: string;
  heroBannerImage: string;
  heroBannerOverlay: string;
  heroBannerOverlayOpacity: string;
  navBgOpacity: string;
  heroTitleSize: string;
  heroDescSize: string;
  heroBannerImagePosition: string;
  heroBannerImageSize: string;
  aboutBgColor: string;
  servicesBgColor: string;
  footerBgColor: string;
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
  emoji: string;
  bannerTextPosition: string;
  bannerCta1Text: string;
  bannerCta1Color: string;
  bannerCta1Link: string;
  bannerCta2Text: string;
  bannerCta2Color: string;
  bannerCta2Link: string;
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

      {/* Hero skeleton - full-width banner */}
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center space-y-6">
          <Skeleton className="w-48 h-8 rounded-full mx-auto" />
          <Skeleton className="w-80 h-16 mx-auto" />
          <Skeleton className="w-96 h-12 mx-auto" />
          <Skeleton className="w-full max-w-2xl h-24 mx-auto" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="w-48 h-14 rounded-xl" />
            <Skeleton className="w-48 h-14 rounded-xl" />
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
                  <Skeleton className="w-32 h-5 mb-2" />
                  <Skeleton className="w-full h-4" />
                </CardHeader>
                <CardContent>
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

  const hasBannerImage = !!settings.heroBannerImage;
  const overlayColor = settings.heroBannerOverlay || "#001e60";
  const overlayOpacity = Math.min(100, Math.max(0, parseInt(settings.heroBannerOverlayOpacity || "70"))) / 100;

  // Hero text position
  const textPosition = settings.heroTextPosition || "center";
  const isLeft = textPosition === "left";
  const isRight = textPosition === "right";
  const maxWidthClass = isLeft || isRight ? "max-w-2xl" : "max-w-4xl";
  const textAlignClass = isLeft ? "text-left" : isRight ? "text-right" : "text-center";
  const mlAuto = isRight ? "ml-auto" : isLeft ? "" : "mx-auto";

  // Banner image styles
  const bannerImageStyle: React.CSSProperties = {
    backgroundImage: `url(${settings.heroBannerImage})`,
    backgroundPosition: settings.heroBannerImagePosition || "center center",
    backgroundSize: settings.heroBannerImageSize || "cover",
  };

  // CTA button settings
  const cta1Text = settings.heroCtaText || "Get a Quote";
  const cta1Color = settings.heroCtaColor || settings.accentColor;
  const cta1Link = settings.heroCtaLink || agentInfo.phoneLink;
  const cta2Text = settings.heroCta2Text || "Contact Us";
  const cta2Color = settings.heroCta2Color; // empty = outline style
  const cta2Link = settings.heroCta2Link || "#contact";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background - banner image or gradient */}
      {hasBannerImage ? (
        <>
          <div
            className="absolute inset-0 bg-no-repeat"
            style={bannerImageStyle}
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
      </div>

      {/* Hero Content */}
      <div className={`relative ${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 ${textAlignClass} ${mlAuto}`}>
        {heroSection?.subtitle && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge
              className="mb-6 px-4 py-2 text-sm font-semibold border-0"
              style={{
                backgroundColor: `${settings.accentColor}25`,
                color: settings.accentColor,
              }}
            >
              {heroSection.subtitle}
            </Badge>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-bold text-white leading-tight"
          style={{
            fontFamily: settings.headingFont,
            fontSize: `${settings.heroTitleSize || settings.headingFontSize}px`,
          }}
        >
          {heroSection?.title || settings.heroTitle}
          {settings.heroSubtitle && (
            <span
              className="block mt-2"
              style={{
                background: `linear-gradient(135deg, ${settings.lightColor}, ${settings.accentColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {settings.heroSubtitle}
            </span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`mt-6 text-white/80 ${isLeft || isRight ? "" : "max-w-2xl mx-auto"}`}
          style={{
            fontSize: `${settings.heroDescSize || "18"}px`,
            ...(isLeft ? { marginLeft: 0 } : isRight ? { marginRight: 0, marginLeft: "auto" } : undefined)
          }}
        >
          {heroSection?.description || settings.heroDescription}
        </motion.p>

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`mt-6 flex items-center gap-3 ${isLeft ? "justify-start" : isRight ? "justify-end" : "justify-center"}`}
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
          className={`mt-8 flex flex-col sm:flex-row gap-4 ${isLeft ? "justify-start" : isRight ? "justify-end" : "justify-center"}`}
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
          <a href={cta2Link}>
            <Button
              size="lg"
              variant={cta2Color ? undefined : "outline"}
              className={`font-bold text-lg px-8 py-6 ${cta2Color ? "text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105" : "border-white/30 text-white hover:bg-white/10 bg-transparent"}`}
              style={cta2Color ? { backgroundColor: cta2Color } : undefined}
            >
              {cta2Text}
            </Button>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-12"
        >
          <ChevronDown className="w-8 h-8 text-white/40 mx-auto" />
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
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform mb-4"
                      style={{ backgroundColor: `${settings.primaryColor}15` }}
                    >
                      {page.emoji ? (
                        <span className="text-xl">{page.emoji}</span>
                      ) : (
                        <DynamicIcon name={page.iconName || 'Shield'} size={24} style={{ color: settings.primaryColor }} />
                      )}
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
  let reasons = [
    {
      icon: "Shield",
      title: "Dwyer Insurance Group",
      desc: "A trusted local agency with deep roots in the Wynnewood community and decades of combined insurance experience.",
    },
    {
      icon: "Award",
      title: `${agentInfo.badge} Recognition`,
      desc: "Our elite status reflects our commitment to exceptional service and client satisfaction.",
    },
    {
      icon: "Users",
      title: "Personalized Attention",
      desc: "Every client gets a customized insurance review. No cookie-cutter policies here.",
    },
    {
      icon: "Handshake",
      title: "Local Community Expert",
      desc: `Based in ${agentInfo.address}, we understand the unique needs of the community.`,
    },
    {
      icon: "CheckCircle2",
      title: "Claims Satisfaction Guarantee",
      desc: "Our Claims Satisfaction Guarantee means you're happy with the outcome, or we make it right.",
    },
    {
      icon: "Phone",
      title: "Easy to Reach",
      desc: `Call ${agentInfo.phone}, text ${agentInfo.textNumber}, or email — we are always accessible.`,
    },
  ];

  if (whySection?.content) {
    try {
      const customReasons = JSON.parse(whySection.content);
      if (Array.isArray(customReasons) && customReasons.length > 0) {
        reasons = customReasons;
      }
    } catch (e) {
      console.error("Error parsing whyChooseUs content:", e);
    }
  }

  return (
    <section id="why-choose-us" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            {whySection?.content && JSON.parse(whySection.content).sectionIcon && (
              <DynamicIcon name={JSON.parse(whySection.content).sectionIcon} size={20} style={{ color: settings.primaryColor }} />
            )}
            <Badge
              className="border-0"
              style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
            >
              {whySection?.subtitle || "Why Choose Us"}
            </Badge>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight"
            style={{ 
              color: settings.secondaryColor, 
              fontFamily: settings.headingFont,
              fontSize: (whySection?.content && !Array.isArray(JSON.parse(whySection.content)) && JSON.parse(whySection.content).titleSize) 
                ? `${JSON.parse(whySection.content).titleSize}px` 
                : undefined
            }}
          >
            {whySection?.title || "Why Families Trust Dwyer Insurance Group"}
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            {whySection?.description ||
              "Choosing the right insurance agent makes all the difference. Here's why hundreds of families trust Dwyer Insurance Group."}
          </p>
        </AnimatedSection>
 
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason: any, i: number) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="group text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-sm"
                  style={{ backgroundColor: `${settings.primaryColor}08`, border: `1px solid ${settings.primaryColor}15` }}
                >
                  <DynamicIcon name={reason.icon} className="w-8 h-8" style={{ color: settings.primaryColor }} />
                </div>
                <h3 
                  className="text-xl sm:text-2xl font-bold mb-4 px-2" 
                  style={{ 
                    color: settings.secondaryColor,
                    fontSize: reason.titleSize ? `${reason.titleSize}px` : undefined 
                  }}
                >
                  {reason.title}
                </h3>
                <p 
                  className="text-muted-foreground leading-relaxed text-base sm:text-lg"
                  style={{ fontSize: reason.descSize ? `${reason.descSize}px` : undefined }}
                >
                  {reason.desc}
                </p>
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
              "Don't just take our word for it — hear from the families and individuals who trust Dwyer Insurance Group."}
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


// ─── Main Page ───────────────────────────────────────────────────

export default function HomePage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/site-data");
        if (!res.ok) throw new Error("Failed to fetch site data");
        const json: SiteData = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching site data:", err);
        setError("Unable to load site data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Data could not be loaded."}</p>
        </div>
      </div>
    );
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
        settings={settings}
        insurancePages={insurancePages}
      />
      <main className="flex-1">
        {getSection("hero")?.visible !== false && (
          <HeroSection
            settings={settings}
            agentInfo={agentInfo}
            heroSection={getSection("hero")}
          />
        )}
        {getSection("services")?.visible !== false && (
          <ServicesSection
            settings={settings}
            insurancePages={insurancePages}
            servicesSection={getSection("services")}
          />
        )}
        {getSection("whyChooseUs")?.visible !== false && (
          <WhyChooseUsSection
            settings={settings}
            agentInfo={agentInfo}
            whySection={getSection("whyChooseUs")}
          />
        )}
        {getSection("ctaBanner")?.visible !== false && (
          <div className="bg-white">
            <CTASection 
              page={{ 
                title: "Expert Protection", 
                iconColor: settings.primaryColor,
                bannerCta1Text: settings.heroCtaText,
                bannerCta1Link: settings.heroCtaLink,
                bannerCta2Text: "Get a Quote",
                bannerCta2Link: "/contact",
                ctaTitle: getSection("ctaBanner")?.content && !Array.isArray(JSON.parse(getSection("ctaBanner")!.content)) ? JSON.parse(getSection("ctaBanner")!.content).ctaTitle : undefined,
                ctaDescription: getSection("ctaBanner")?.content && !Array.isArray(JSON.parse(getSection("ctaBanner")!.content)) ? JSON.parse(getSection("ctaBanner")!.content).ctaDescription : undefined,
              } as any} 
              agentInfo={agentInfo} 
              settings={settings} 
            />
          </div>
        )}
        {getSection("testimonials")?.visible !== false && (
          <TestimonialsSection
            settings={settings}
            testimonials={testimonials}
            testimonialsSection={getSection("testimonials")}
          />
        )}
        {getSection("faq")?.visible !== false && (
          <FaqSection
            settings={settings}
            faqs={faqs}
            faqSection={getSection("faq")}
          />
        )}
        {getSection("contact")?.visible !== false && (
          <ContactSection
            settings={settings}
            agentInfo={agentInfo}
            insurancePages={insurancePages}
            contactSection={getSection("contact")}
          />
        )}
      </main>
      <div className="mt-auto">
        <Footer
          settings={settings}
          agentInfo={agentInfo}
          insurancePages={insurancePages}
        />
      </div>
    </div>
  );
}
