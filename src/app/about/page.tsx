"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DynamicIcon from "@/components/DynamicIcon";
import { getScaledSize } from "@/lib/utils";

interface Settings { [key: string]: string; }
interface MenuItem { id: string; label: string; href: string; order: number; visible: boolean; isDropdown: boolean; parent: string | null; iconName: string; }
interface AgentInfo { [key: string]: string; }
interface PageSection { id: string; section: string; title: string; subtitle: string; description: string; content: string; visible: boolean; }
interface InsurancePage { id: string; slug: string; title: string; tagline: string; description: string; features: string[]; iconColor: string; iconBgColor: string; iconName: string; emoji: string; order: number; visible: boolean; }
interface SiteData { settings: Settings; menuItems: MenuItem[]; agentInfo: AgentInfo; insurancePages: InsurancePage[]; pageSections: PageSection[]; }

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.7, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

function AboutContentSection({ settings, agentInfo, aboutSection }: { settings: Settings; agentInfo: AgentInfo; aboutSection: PageSection | undefined; }) {
  const reviewCount = parseInt(agentInfo.reviewCount) || 0;
  const states = (agentInfo.states || "PA,NJ,DE").split(",").map((s) => s.trim());

  let contentData: any = {};
  try { if (aboutSection?.content) contentData = JSON.parse(aboutSection.content); } catch {}

  const stats = contentData.stats || [
    { number: `${reviewCount}+`, label: "Happy Clients" },
    { number: agentInfo.rating || "4.3", label: "Star Rating" },
    { number: `${states.length}`, label: "States Licensed" },
    { number: "12+", label: "Insurance Types" },
  ];

  const items = contentData.items || [
    { icon: "ShieldCheck", title: "Personalized Coverage", desc: "Tailored insurance solutions, not one-size-fits-all policies" },
    { icon: "Clock", title: "24/7 Support", desc: "Round-the-clock claims support and after-hours appointments" },
    { icon: "Handshake", title: "Trusted Partnership", desc: "Building lasting relationships based on trust and transparency" },
    { icon: "Globe", title: "Bilingual Service", desc: `Serving clients in ${agentInfo.languages || "English, Spanish"}` },
  ];

  const titleSizePct = contentData.titleSizePct ?? 100;
  const descSizePct = contentData.descSizePct ?? 100;
  const subtitleSizePct = contentData.subtitleSizePct ?? 100;
  const itemTitleSizePct = contentData.itemTitleSizePct ?? 100;
  const itemDescSizePct = contentData.itemDescSizePct ?? 100;

  const photoBannerImage = contentData.photoBannerImage || "";
  const photoBannerColor = contentData.photoBannerColor || "";
  const photoBannerColorTo = contentData.photoBannerColorTo || "";

  const cardBg = photoBannerImage
    ? { backgroundImage: `url(${photoBannerImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : photoBannerColor
    ? { background: photoBannerColorTo ? `linear-gradient(135deg, ${photoBannerColor} 0%, ${photoBannerColorTo} 100%)` : photoBannerColor }
    : { background: `linear-gradient(135deg, ${settings.secondaryColor} 0%, ${settings.primaryColor} 50%, ${settings.darkColor} 100%)` };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <div className="relative group">
              <div className="rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02]" style={cardBg}>
                {photoBannerImage && (
                  <div className="absolute inset-0 rounded-3xl" style={{ backgroundColor: `${settings.secondaryColor}90` }} />
                )}
                
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20" style={{ backgroundColor: settings.lightColor }} />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-20" style={{ backgroundColor: settings.accentColor }} />
                
                <div className="relative z-10 text-center lg:text-left">
                  <div className="w-32 h-32 rounded-full border-4 overflow-hidden mb-6 mx-auto lg:mx-0 shadow-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: settings.darkColor }}>
                    <img src={agentInfo.photo} alt={agentInfo.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 tracking-tight">{agentInfo.name}</h3>
                  <p className="font-medium text-lg mb-4" style={{ color: settings.lightColor }}>{agentInfo.badge}</p>
                  <p 
                    className="text-white/90 mb-8 leading-relaxed italic"
                    style={{ fontSize: getScaledSize(1, itemDescSizePct, 1) }}
                  >
                    &ldquo;{contentData.photoCaption || "Dedicated to providing personalized insurance solutions with exceptional service and a commitment to your family's protection."}&rdquo;
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat: any) => (
                      <div key={stat.label} className="bg-white/15 rounded-2xl p-4 text-center backdrop-blur-md border border-white/10">
                        <p className="text-2xl font-bold" style={{ color: settings.lightColor }}>{stat.number}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
                className="absolute -top-4 -right-4 text-white rounded-2xl px-5 py-3 shadow-2xl border-2 border-white/20" 
                style={{ backgroundColor: settings.accentColor }}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-black text-sm uppercase tracking-tighter">Certified Elite Agent</span>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <Badge 
              className="mb-4 border-0" 
              style={{ 
                backgroundColor: `${settings.primaryColor}15`, 
                color: settings.primaryColor,
                fontSize: getScaledSize(0.875, subtitleSizePct, 0.875)
              }}
            >
              {aboutSection?.subtitle || "About Us"}
            </Badge>
            <h2
              className="font-bold mb-6 tracking-tight"
              style={{
                color: settings.secondaryColor,
                fontFamily: settings.headingFont,
                fontSize: getScaledSize(2.5, titleSizePct, 2.5),
              }}
            >
              {aboutSection?.title || "Your Trusted Insurance Partner"}
            </h2>
            {aboutSection?.description && (
              <div className="space-y-4 mb-8">
                {aboutSection.description.split("\n\n").map((paragraph, i) => (
                  <p 
                    key={i} 
                    className="text-muted-foreground leading-relaxed" 
                    style={{ fontSize: getScaledSize(1.125, descSizePct, 1.125) }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
            <div className="space-y-6 mb-8">
              {items.map((item: any) => (
                <div key={item.title} className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-sm" style={{ backgroundColor: `${settings.primaryColor}10`, border: `1px solid ${settings.primaryColor}15` }}>
                    <DynamicIcon name={item.icon} className="w-7 h-7" style={{ color: settings.primaryColor }} />
                  </div>
                  <div>
                    <h4 
                      className="font-bold mb-1" 
                      style={{ 
                        color: settings.secondaryColor, 
                        fontSize: getScaledSize(1.125, itemTitleSizePct, 1.125) 
                      }}
                    >
                      {item.title}
                    </h4>
                    <p 
                      className="text-muted-foreground leading-relaxed" 
                      style={{ fontSize: getScaledSize(0.9375, itemDescSizePct, 0.9375) }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <a href="/">
              <Button 
                size="lg"
                className="text-white font-bold px-10 py-7 shadow-xl hover:shadow-2xl transition-all rounded-2xl hover:scale-[1.02]" 
                style={{ backgroundColor: settings.primaryColor }}
              >
                {contentData.ctaText || "Schedule a Consultation"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function ValuesSection({ settings, valuesSection }: { settings: Settings; valuesSection: PageSection | undefined }) {
  let contentData: any = {};
  try { if (valuesSection?.content) contentData = JSON.parse(valuesSection.content); } catch {}

  const valueTitleSizePct = contentData.itemTitleSizePct ?? 50; 
  const valueDescSizePct = contentData.itemDescSizePct ?? 100;
  const sectionTitleSizePct = contentData.titleSizePct ?? 100;
  const sectionDescSizePct = contentData.descSizePct ?? 100;
  const subtitleSizePct = contentData.subtitleSizePct ?? 100;

  const values = contentData.items || [
    { icon: "ShieldCheck", title: "Protection First", desc: "Your family's security is our top priority. We craft policies that truly protect what matters most." },
    { icon: "Users", title: "Community Focused", desc: "As your neighbor in Wynnewood, we understand the unique needs of our community." },
    { icon: "Handshake", title: "Trust & Integrity", desc: "Transparent advice, honest recommendations, and always putting your interests first." },
    { icon: "Award", title: "Elite Expertise", desc: "Dwyer Insurance Group brings years of insurance expertise and a commitment to finding you the best coverage at the best price." },
  ];

  if (valuesSection?.visible === false) return null;

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: `${settings.primaryColor}05` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge 
            className="mb-4 border-0" 
            style={{ 
              backgroundColor: `${settings.primaryColor}15`, 
              color: settings.primaryColor,
              fontSize: getScaledSize(0.875, subtitleSizePct, 0.875)
            }}
          >
            {valuesSection?.subtitle || "Our Values"}
          </Badge>
          <h2
            className="font-bold mb-6 tracking-tight"
            style={{ 
              color: settings.secondaryColor, 
              fontFamily: settings.headingFont, 
              fontSize: getScaledSize(2.25, sectionTitleSizePct, 2.25) 
            }}
          >
            {valuesSection?.title || "Why Families Choose Us"}
          </h2>
          <p 
            className="text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            style={{ fontSize: getScaledSize(1.125, sectionDescSizePct, 1.125) }}
          >
            {valuesSection?.description || "Dwyer Insurance Group has been helping families across Pennsylvania, New Jersey, and Delaware find the right coverage at the right price."}
          </p>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value: any, i: number) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <Card className="text-center h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-3xl overflow-hidden bg-white">
                <CardContent className="pt-10 pb-8 px-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm" style={{ backgroundColor: `${settings.primaryColor}10`, border: `1px solid ${settings.primaryColor}05` }}>
                    <DynamicIcon name={value.icon} className="w-8 h-8" style={{ color: settings.primaryColor }} />
                  </div>
                  <h3
                    className="font-bold mb-3 tracking-tight"
                    style={{ 
                      color: settings.secondaryColor, 
                      fontSize: getScaledSize(1.125, valueTitleSizePct, 1.125) 
                    }}
                  >
                    {value.title}
                  </h3>
                  <p 
                    className="text-muted-foreground leading-relaxed" 
                    style={{ fontSize: getScaledSize(0.875, valueDescSizePct, 0.875) }}
                  >
                    {value.desc}
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

function CTASection({ settings, agentInfo }: { settings: Settings; agentInfo: AgentInfo }) {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${settings.secondaryColor} 0%, ${settings.primaryColor} 50%, ${settings.darkColor} 100%)` }}>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <AnimatedSection>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tighter">Ready to Protect Your Family?</h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">Get a personalized insurance review from Dwyer Insurance Group. Bundle and save up to 25% on your premiums!</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a href={agentInfo.phoneLink || `tel:${agentInfo.phone}`}>
              <Button size="lg" className="text-white font-black text-xl px-10 py-8 shadow-2xl hover:shadow-white/10 transition-all hover:scale-105 rounded-2xl" style={{ backgroundColor: settings.accentColor }}>
                <Phone className="w-6 h-6 mr-3" />Call {agentInfo.phone}
              </Button>
            </a>
            <a href="/">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold text-xl px-10 py-8 bg-white/5 backdrop-blur-sm rounded-2xl">
                Get a Free Quote <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

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

  if (loading || !siteData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="space-y-4 w-full max-w-lg px-4">
          <Skeleton className="w-full h-80 rounded-3xl" />
          <Skeleton className="w-3/4 h-10" />
          <Skeleton className="w-full h-32" />
        </div>
      </div>
    );
  }

  const { settings, menuItems, agentInfo, insurancePages, pageSections } = siteData;
  const aboutSection = pageSections.find((s) => s.section === "about");
  const valuesSection = pageSections.find((s) => s.section === "aboutValues") || 
    { id: "default-values", section: "aboutValues", title: "Why Families Choose Us", subtitle: "Our Values", description: "", content: "{}", visible: true };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation menuItems={menuItems} agentInfo={agentInfo} settings={settings} insurancePages={insurancePages} />
      <main className="pt-16 md:pt-20 flex-1">
        {(aboutSection?.visible !== false) && (
          <AboutContentSection settings={settings} agentInfo={agentInfo} aboutSection={aboutSection} />
        )}
        <ValuesSection settings={settings} valuesSection={valuesSection as PageSection} />
        <CTASection settings={settings} agentInfo={agentInfo} />
      </main>
      <Footer settings={settings} agentInfo={agentInfo} insurancePages={insurancePages} />
    </div>
  );
}
