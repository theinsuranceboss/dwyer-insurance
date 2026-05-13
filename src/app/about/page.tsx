"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  Handshake,
  ArrowRight,
  Globe,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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

interface PageSection {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  visible: boolean;
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

interface SiteData {
  settings: Settings;
  menuItems: MenuItem[];
  agentInfo: AgentInfo;
  insurancePages: InsurancePage[];
  pageSections: PageSection[];
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

// ─── Navigation ──────────────────────────────────────────────────

function Navigation({
  menuItems,
  agentInfo,
  settings,
}: {
  menuItems: MenuItem[];
  agentInfo: AgentInfo;
  settings: Settings;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const topLevelItems = menuItems.filter((item) => !item.parent);
  const childrenByParent = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (item.parent) {
      if (!acc[item.parent]) acc[item.parent] = [];
      acc[item.parent].push(item);
    }
    return acc;
  }, {});

  const toggleDesktopDropdown = (id: string, open: boolean) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: open }));
  };

  const toggleMobileExpand = (id: string) => {
    setMobileExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navLinkClass = (isDropdown = false) =>
    `nav-link text-sm font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-1 ${
      isDropdown ? "cursor-pointer" : ""
    } ${
      scrolled
        ? "hover:bg-gray-100"
        : "text-white/90 hover:text-white hover:bg-white/10"
    }`;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white/95 backdrop-blur-md shadow-sm"
      }`}
      style={scrolled ? { borderBottom: `1px solid ${settings.lightColor}30` } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <p
                className="font-bold text-lg leading-tight"
                style={{ color: settings.secondaryColor }}
              >
                {agentInfo.name}
              </p>
              <p
                className="text-xs leading-tight"
                style={{ color: settings.primaryColor }}
              >
                {agentInfo.title}
              </p>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {topLevelItems.map((item) => {
              const children = childrenByParent[item.id] || [];
              if (item.isDropdown && children.length > 0) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => toggleDesktopDropdown(item.id, true)}
                    onMouseLeave={() => toggleDesktopDropdown(item.id, false)}
                  >
                    <button
                      onClick={() => toggleDesktopDropdown(item.id, !openDropdowns[item.id])}
                      className={navLinkClass(true)}
                      style={{ color: settings.secondaryColor }}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${openDropdowns[item.id] ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdowns[item.id] && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                        >
                          <div className="py-1.5">
                            {children.map((child) => (
                              <a
                                key={child.id}
                                href={child.href}
                                className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                              >
                                <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700">{child.label}</span>
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={navLinkClass()}
                  style={{ color: settings.secondaryColor }}
                >
                  {item.label}
                </a>
              );
            })}
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

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={24} style={{ color: settings.secondaryColor }} />
            ) : (
              <Menu size={24} style={{ color: settings.secondaryColor }} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white shadow-xl border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {topLevelItems.map((item) => {
                const children = childrenByParent[item.id] || [];
                if (item.isDropdown && children.length > 0) {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggleMobileExpand(item.id)}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors font-medium hover:bg-gray-50"
                        style={{ color: settings.secondaryColor }}
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${mobileExpanded[item.id] ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded[item.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 space-y-0.5 border-l-2 ml-4" style={{ borderColor: `${settings.primaryColor}30` }}>
                              {children.map((child) => (
                                <a
                                  key={child.id}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <ChevronRight size={12} className="text-gray-400" />
                                  <span className="text-sm font-medium" style={{ color: settings.secondaryColor }}>
                                    {child.label}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-lg transition-colors font-medium hover:bg-gray-50"
                    style={{ color: settings.secondaryColor }}
                  >
                    {item.label}
                  </a>
                );
              })}
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

// ─── About Content Section ───────────────────────────────────────

function AboutContentSection({
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
    <section className="py-20 lg:py-28 bg-white">
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

            <a href="/">
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

// ─── Values Section ──────────────────────────────────────────────

function ValuesSection({ settings }: { settings: Settings }) {
  const values = [
    {
      icon: ShieldCheck,
      title: "Protection First",
      desc: "Your family's security is our top priority. We craft policies that truly protect what matters most.",
    },
    {
      icon: Users,
      title: "Community Focused",
      desc: "As your neighbor in Wynnewood, we understand the unique needs of our community.",
    },
    {
      icon: Handshake,
      title: "Trust & Integrity",
      desc: "Transparent advice, honest recommendations, and always putting your interests first.",
    },
    {
      icon: Award,
      title: "Elite Expertise",
      desc: "Recognized as an Allstate Elite Agent for exceptional service and client satisfaction.",
    },
  ];

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: `${settings.primaryColor}08` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge
            className="mb-4 border-0"
            style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
          >
            Our Values
          </Badge>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: settings.secondaryColor, fontFamily: settings.headingFont }}
          >
            Why Families <span style={{ color: settings.primaryColor }}>Choose Us</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            For over a decade, we&apos;ve been helping families across Pennsylvania, New Jersey, and
            Delaware find the right coverage at the right price.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, i) => (
            <AnimatedSection key={value.title} delay={i * 0.1}>
              <Card className="text-center h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-8 pb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${settings.primaryColor}15` }}
                  >
                    <value.icon className="w-8 h-8" style={{ color: settings.primaryColor }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: settings.secondaryColor }}>
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────

function CTASection({ settings, agentInfo }: { settings: Settings; agentInfo: AgentInfo }) {
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${settings.secondaryColor} 0%, ${settings.primaryColor} 50%, ${settings.darkColor} 100%)`,
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Protect Your Family?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Get a personalized insurance review from Suzanne Dwyer. Bundle and save up to 25% on
            your premiums!
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
            <a href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 bg-transparent"
              >
                Get a Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
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
  return (
    <footer className="text-white" style={{ backgroundColor: settings.footerBgColor || settings.darkColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">{agentInfo.name}</p>
                <p className="text-sm" style={{ color: settings.lightColor }}>{agentInfo.title}</p>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Elite Agent serving Wynnewood, PA and the surrounding communities.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Insurance</h4>
            <ul className="space-y-2">
              {insurancePages.slice(0, 6).map((type) => (
                <li key={type.id}>
                  <a
                    href={`/insurance/${type.slug}`}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {type.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">More Services</h4>
            <ul className="space-y-2">
              {insurancePages.slice(6).map((type) => (
                <li key={type.id}>
                  <a
                    href={`/insurance/${type.slug}`}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {type.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" style={{ color: settings.lightColor }} />
                <a href={agentInfo.phoneLink} className="text-white/60 hover:text-white text-sm">
                  {agentInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" style={{ color: settings.lightColor }} />
                <a href={`mailto:${agentInfo.email}`} className="text-white/60 hover:text-white text-sm">
                  {agentInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: settings.lightColor }} />
                <span className="text-white/60 text-sm">{agentInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: settings.lightColor }} />
                <span className="text-white/60 text-sm">Mon-Fri: 8:30 AM - 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            {settings.footerCopyright || `© ${new Date().getFullYear()} ${agentInfo.name}. All rights reserved.`}
          </p>
          <p className="text-white/40 text-xs">
            {settings.footerText || "You're in good hands."}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
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
          </div>
          <Skeleton className="lg:hidden w-8 h-8" />
        </div>
      </div>

      <div className="pt-20">
        <div className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <Skeleton className="w-full h-96 rounded-3xl" />
              <div className="space-y-4">
                <Skeleton className="w-24 h-6" />
                <Skeleton className="w-80 h-10" />
                <Skeleton className="w-full h-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────

export default function AboutPage() {
  const { toast } = useToast();
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/site-data");
        if (!res.ok) throw new Error("Failed to fetch site data");
        const data = await res.json();
        setSiteData(data);
      } catch {
        toast({ title: "Error", description: "Failed to load page data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  if (loading || !siteData) return <LoadingSkeleton />;

  const { settings, menuItems, agentInfo, insurancePages, pageSections } = siteData;
  const aboutSection = pageSections.find((s: PageSection) => s.section === "about");

  return (
    <div className="min-h-screen bg-white">
      <Navigation menuItems={menuItems} agentInfo={agentInfo} settings={settings} />

      <main className="pt-16 lg:pt-20">
        <AboutContentSection settings={settings} agentInfo={agentInfo} aboutSection={aboutSection} />
        <ValuesSection settings={settings} />
        <CTASection settings={settings} agentInfo={agentInfo} />
      </main>

      <Footer settings={settings} agentInfo={agentInfo} insurancePages={insurancePages} />
    </div>
  );
}
