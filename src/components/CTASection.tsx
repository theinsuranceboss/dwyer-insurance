"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

interface CTASectionProps {
  page: {
    title: string;
    iconColor?: string;
    bannerCta1Text?: string;
    bannerCta1Link?: string;
    bannerCta1Color?: string;
    bannerCta2Text?: string;
    bannerCta2Link?: string;
    bannerCta2Color?: string;
    [key: string]: any;
  };
  agentInfo: Record<string, any>;
  settings: Record<string, any>;
}

export default function CTASection({ page, agentInfo, settings }: CTASectionProps) {
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
            {page.ctaTitle || `Ready to Get ${page.title}?`}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            {page.ctaDescription || `Get a personalized ${page.title.toLowerCase()} quote today. Bundle and save up to 25% on your premiums!`}
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
