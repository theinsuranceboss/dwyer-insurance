"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Phone,
  Clock,
  Award,
  Handshake,
  ArrowRight,
  Globe,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
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
  emoji: string;
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
                    {agentInfo.badge}
                  </p>
                  <p className="text-white/80 mb-6">
                    Dedicated to providing personalized insurance solutions with exceptional service and a commitment to your family's protection.
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
      desc: "Suzanne Dwyer brings years of insurance expertise and a commitment to finding you the best coverage at the best price.",
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
            Dwyer Insurance Group has been helping families across Pennsylvania, New Jersey, and
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
            Get a personalized insurance review from Suzanne Dwyer at Dwyer Insurance Group. Bundle and save up to 25% on
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

// ─── Loading Skeleton ────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 shadow-md" style={{ backgroundColor: "#001e60" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="hidden sm:block space-y-1">
              <Skeleton className="w-36 h-5" />
              <Skeleton className="w-28 h-3" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-16 h-4" />
            ))}
          </div>
          <Skeleton className="md:hidden w-8 h-8" />
        </div>
      </div>

      <div className="pt-16 md:pt-20">
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
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation
        menuItems={menuItems}
        agentInfo={agentInfo}
        settings={settings}
        insurancePages={insurancePages}
      />

      <main className="pt-16 md:pt-20 flex-1">
        <AboutContentSection settings={settings} agentInfo={agentInfo} aboutSection={aboutSection} />
        <ValuesSection settings={settings} />
        <CTASection settings={settings} agentInfo={agentInfo} />
      </main>

      <Footer settings={settings} agentInfo={agentInfo} insurancePages={insurancePages} />
    </div>
  );
}
