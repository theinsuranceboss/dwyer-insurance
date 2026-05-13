"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DynamicIcon from "@/components/DynamicIcon";

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
  slug: string;
  emoji: string;
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
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});

  // Build emoji lookup by slug
  const emojiBySlug: Record<string, string> = {};
  if (insurancePages) {
    for (const page of insurancePages) {
      if (page.emoji && page.slug) {
        emojiBySlug[page.slug] = page.emoji;
      }
    }
  }

  // Helper to get emoji for a menu child href
  const getEmojiForHref = (href: string): string | null => {
    // Match href like /insurance/auto
    const match = href.match(/^\/insurance\/([^/]+)$/);
    if (match && emojiBySlug[match[1]]) {
      return emojiBySlug[match[1]];
    }
    return null;
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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

  const navBg = settings.darkColor || "#001e60";
  const logoUrl = settings.logoUrl || "/logo.png";
  const logoText = settings.logoText || "Dwyer Insurance Group";
  const logoSubtext = settings.logoSubtext || "Insurance Agency";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 shadow-md"
      style={{ backgroundColor: navBg }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="/" className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt={logoText}
              className="h-10 max-w-[40px] object-contain"
            />
            <div className="hidden sm:block">
              <p className="font-bold text-lg leading-tight text-white">{logoText}</p>
              <p className="text-xs leading-tight text-white/70">{logoSubtext}</p>
            </div>
          </a>

          {/* Desktop Nav — visible at md and up */}
          <div className="hidden md:flex items-center gap-1">
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
                      className="text-sm font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-1 cursor-pointer text-white/90 hover:text-white hover:bg-white/10"
                    >
                      {item.iconName && <DynamicIcon name={item.iconName} size={16} className="text-white/70" />}
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
                            {children.map((child) => {
                              const emoji = getEmojiForHref(child.href);
                              return (
                                <a
                                  key={child.id}
                                  href={child.href}
                                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                >
                                  {emoji ? (
                                    <span className="text-base flex-shrink-0">{emoji}</span>
                                  ) : child.iconName ? (
                                    <DynamicIcon name={child.iconName} size={16} style={{ color: settings.primaryColor || "#0033A0" }} />
                                  ) : (
                                    <span className="w-4" />
                                  )}
                                  <span className="text-sm font-medium text-gray-700">{child.label}</span>
                                </a>
                              );
                            })}
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
                  className="text-sm font-medium px-3 py-2 rounded-md transition-colors text-white/90 hover:text-white hover:bg-white/10"
                >
                  {item.label}
                </a>
              );
            })}
            <a href={agentInfo.phoneLink || "tel:+16107259900"} className="ml-3">
              <Button
                size="sm"
                className="text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: settings.accentColor || "#ff9e16" }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Get a Quote
              </Button>
            </a>
          </div>

          {/* Mobile toggle — visible below md */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
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
            <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {topLevelItems.map((item) => {
                const children = childrenByParent[item.id] || [];
                if (item.isDropdown && children.length > 0) {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggleMobileExpand(item.id)}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors font-medium hover:bg-gray-50"
                        style={{ color: settings.secondaryColor || "#001e60" }}
                      >
                        <span className="flex items-center gap-2">
                          {item.iconName && <DynamicIcon name={item.iconName} size={18} style={{ color: settings.primaryColor || "#0033A0" }} />}
                          {item.label}
                        </span>
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
                            <div className="pl-4 space-y-0.5 border-l-2 ml-4" style={{ borderColor: `${settings.primaryColor || "#0033A0"}30` }}>
                              {children.map((child) => {
                                const emoji = getEmojiForHref(child.href);
                                return (
                                  <a
                                    key={child.id}
                                    href={child.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    {emoji ? (
                                      <span className="text-base flex-shrink-0">{emoji}</span>
                                    ) : child.iconName ? (
                                      <DynamicIcon name={child.iconName} size={16} style={{ color: settings.primaryColor || "#0033A0" }} />
                                    ) : (
                                      <span className="w-4" />
                                    )}
                                    <span className="text-sm font-medium" style={{ color: settings.secondaryColor || "#001e60" }}>{child.label}</span>
                                  </a>
                                );
                              })}
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
                    style={{ color: settings.secondaryColor || "#001e60" }}
                  >
                    {item.label}
                  </a>
                );
              })}
              <Separator className="my-2" />
              <a href={agentInfo.phoneLink || "tel:+16107259900"} className="block pt-2">
                <Button
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: settings.accentColor || "#ff9e16" }}
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
  );
}
