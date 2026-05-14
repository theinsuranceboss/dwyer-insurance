"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

interface InsurancePageBrief {
  id: string;
  slug: string;
  title: string;
  emoji: string;
  iconColor?: string;
  [key: string]: unknown;
}

export default function Navigation({
  menuItems,
  settings,
  agentInfo,
  insurancePages,
}: {
  menuItems: MenuItem[];
  settings: Record<string, string>;
  agentInfo: Record<string, string>;
  insurancePages?: InsurancePageBrief[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [insuranceOpen, setInsuranceOpen] = useState(false);
  const [mobileInsuranceOpen, setMobileInsuranceOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const insuranceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close insurance dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (insuranceRef.current && !insuranceRef.current.contains(e.target as Node)) {
        setInsuranceOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navBg = settings.darkColor || "#001e60";
  const accentColor = settings.accentColor || "#ff9e16";
  const primaryColor = settings.primaryColor || "#0033A0";
  const logoText = settings.logoText || "Dwyer Insurance Group";
  const logoSubtext = settings.logoSubtext || "Insurance Agency";

  // Calculate nav background based on scroll and transparency setting
  const transparency = parseInt(settings.navBgOpacity || "0");
  const targetOpacity = scrolled ? 100 : transparency;
  
  // Convert hex to rgba helper
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const navBgStyle = {
    backgroundColor: hexToRgba(navBg, targetOpacity),
    backdropFilter: targetOpacity < 100 ? "blur(8px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "none",
    transition: "all 0.3s ease",
  };

  // Top-level nav items (non-insurance, non-dropdown)
  const topItems = menuItems.filter((item) => !item.parent && !item.isDropdown);
  // Insurance pages for the mega-menu
  const pages = insurancePages || [];

  // Split insurance pages into two columns for the dropdown
  const half = Math.ceil(pages.length / 2);
  const col1 = pages.slice(0, half);
  const col2 = pages.slice(half);

  // Build simple nav links (exclude "More Insurance" / dropdown items)
  const mainNavItems = topItems.filter(
    (item) => item.label !== "More Insurance" && !item.isDropdown
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          ${settings.baseFontSize ? `font-size: ${settings.baseFontSize}px;` : ""}
        }
        h1, h2, h3, h4, h5, h6 {
          ${settings.headingFontSize ? `font-size: ${settings.headingFontSize}px !important;` : ""}
        }
        /* Maintain body font size if root is changed */
        body {
          font-size: 1rem;
        }
      `}} />
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={navBgStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${accentColor}25` }}
            >
              <Shield className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-base leading-tight text-white">{logoText}</p>
              <p className="text-xs leading-tight" style={{ color: `${accentColor}99` }}>{logoSubtext}</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-sm font-medium px-3 py-2 rounded-md transition-colors text-white/90 hover:text-white hover:bg-white/10"
              >
                {item.label}
              </a>
            ))}

            {/* Insurance Mega-Dropdown */}
            {pages.length > 0 && (
              <div
                ref={insuranceRef}
                className="relative"
                onMouseEnter={() => setInsuranceOpen(true)}
                onMouseLeave={() => setInsuranceOpen(false)}
              >
                <button
                  onClick={() => setInsuranceOpen(!insuranceOpen)}
                  className="text-sm font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-1 cursor-pointer text-white/90 hover:text-white hover:bg-white/10"
                >
                  Insurance Types
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${insuranceOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {insuranceOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      style={{ width: "520px" }}
                    >
                      <div className="p-3">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mb-1">
                          All Insurance Types
                        </div>
                        <div className="grid grid-cols-2 gap-0.5">
                          {[...col1.map((p, i) => ({ p, i })), ...col2.map((p, i) => ({ p, i: i + half }))].sort((a, b) => a.i - b.i).map(({ p }) => (
                            <a
                              key={p.id}
                              href={`/insurance/${p.slug}`}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                              onClick={() => setInsuranceOpen(false)}
                            >
                              <span className="text-xl flex-shrink-0 w-7 text-center">{p.emoji || "🛡️"}</span>
                              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{p.title}</span>
                            </a>
                          ))}
                        </div>
                        <Separator className="my-2" />
                        <a
                          href="/#services"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                          onClick={() => setInsuranceOpen(false)}
                        >
                          <span className="text-sm font-medium" style={{ color: primaryColor }}>View All Services →</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* CTA Button */}
            <a href={agentInfo.phoneLink || "tel:+16107259900"} className="ml-3">
              <Button
                size="sm"
                className="text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: accentColor }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Get a Quote
              </Button>
            </a>
          </div>

          {/* Tablet Nav (md) — compact version */}
          <div className="hidden md:flex lg:hidden items-center gap-1">
            <a href="/" className="text-sm font-medium px-2 py-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10">Home</a>
            <a href="/#services" className="text-sm font-medium px-2 py-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10">Services</a>
            <a href="/#contact" className="text-sm font-medium px-2 py-1.5 rounded-md text-white/90 hover:text-white hover:bg-white/10">Contact</a>
            {/* Insurance dropdown for tablet */}
            <div
              className="relative"
              onMouseEnter={() => setInsuranceOpen(true)}
              onMouseLeave={() => setInsuranceOpen(false)}
            >
              <button
                onClick={() => setInsuranceOpen(!insuranceOpen)}
                className="text-sm font-medium px-2 py-1.5 rounded-md flex items-center gap-1 text-white/90 hover:text-white hover:bg-white/10"
              >
                Insurance
                <ChevronDown size={13} className={`transition-transform ${insuranceOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {insuranceOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    style={{ width: "260px" }}
                  >
                    <div className="py-2 px-2 max-h-80 overflow-y-auto">
                      {pages.map((p) => (
                        <a
                          key={p.id}
                          href={`/insurance/${p.slug}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setInsuranceOpen(false)}
                        >
                          <span className="text-base">{p.emoji || "🛡️"}</span>
                          <span className="text-sm font-medium text-gray-700">{p.title}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a href={agentInfo.phoneLink || "tel:+16107259900"} className="ml-1">
              <Button size="sm" className="text-white font-semibold" style={{ backgroundColor: accentColor }}>
                <Phone className="w-4 h-4 mr-1.5" />
                Call
              </Button>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="text-white" size={24} /> : <Menu className="text-white" size={24} />}
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
            className="md:hidden bg-white shadow-xl border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {/* Main nav links */}
              {mainNavItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl transition-colors font-medium hover:bg-gray-50"
                  style={{ color: settings.secondaryColor || "#001e60" }}
                >
                  {item.label}
                </a>
              ))}

              {/* Insurance accordion */}
              {pages.length > 0 && (
                <div>
                  <button
                    onClick={() => setMobileInsuranceOpen(!mobileInsuranceOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors font-medium hover:bg-gray-50"
                    style={{ color: settings.secondaryColor || "#001e60" }}
                  >
                    <span>🛡️ Insurance Types</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${mobileInsuranceOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileInsuranceOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="grid grid-cols-2 gap-1 pl-4 pb-2 border-l-2 ml-4"
                          style={{ borderColor: `${primaryColor}30` }}
                        >
                          {pages.map((p) => (
                            <a
                              key={p.id}
                              href={`/insurance/${p.slug}`}
                              onClick={() => { setMobileOpen(false); setMobileInsuranceOpen(false); }}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-base flex-shrink-0">{p.emoji || "🛡️"}</span>
                              <span className="text-xs font-medium" style={{ color: settings.secondaryColor || "#001e60" }}>
                                {p.title}
                              </span>
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <Separator className="my-2" />
              <a
                href={agentInfo.phoneLink || "tel:+16107259900"}
                className="block pt-2"
                onClick={() => setMobileOpen(false)}
              >
                <Button
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: accentColor }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Get a Quote: {agentInfo.phone || "(610) 725-9900"}
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    </>
  );
}
