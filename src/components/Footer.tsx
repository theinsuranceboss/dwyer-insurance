"use client";

import { Phone, Mail, MapPin, Clock, Award, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import DynamicIcon from "@/components/DynamicIcon";
import { getScaledSize } from "@/lib/utils";

interface InsurancePageData {
  id: string;
  slug: string;
  title: string;
  iconName: string;
  emoji: string;
  [key: string]: unknown;
}

export default function Footer({
  settings,
  agentInfo,
  insurancePages,
  className,
}: {
  settings: Record<string, string>;
  agentInfo: Record<string, string>;
  insurancePages: InsurancePageData[];
  className?: string;
}) {
  const phone = agentInfo.phone || "(610) 725-9900";
  const phoneLink = agentInfo.phoneLink || `tel:${phone.replace(/[^\d+]/g, "")}`;
  const email = agentInfo.email || "suzane@dwyerinsurance.com";
  const address = agentInfo.address || "Wynnewood, PA 19096";
  const logoUrl = settings.logoUrl || "/logo.png";
  const logoText = settings.logoText || "Dwyer Insurance Group";
  const logoSubtext = settings.logoSubtext || "Insurance Agency";
  const footerBg = settings.footerBgColor || settings.darkColor || "#001e60";
  const footerCopyright = settings.footerCopyright || "Dwyer Insurance Group. All Rights Reserved.";
  const col1Title = settings.footerColumn1Title || "Insurance";
  const col2Title = settings.footerColumn2Title || "More Services";
  const col3Title = settings.footerColumn3Title || "Contact";
  const lightColor = settings.lightColor || "#57b6ff";
  
  const titleSizePct = settings.footerTitleSizePct || settings.footerTitleSize || "100";
  const linkSizePct = settings.footerLinkSizePct || "100";
  const footerTitleCase = settings.footerTitleCase || "capitalize"; // "uppercase", "capitalize", "none"
  const footerTitleWeight = settings.footerTitleWeight || "700";

  const halfIdx = Math.ceil(insurancePages.length / 2);
  const col1Pages = insurancePages.slice(0, halfIdx);
  const col2Pages = insurancePages.slice(halfIdx);

  return (
    <footer style={{ backgroundColor: footerBg }} className={`text-white${className ? ` ${className}` : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {(settings.footerLogoUrl || settings.logoUrl) ? (
                <img 
                  src={settings.footerLogoUrl || settings.logoUrl} 
                  alt={logoText} 
                  className="object-contain" 
                  style={{ width: `${settings.logoWidth || "40"}px` }}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `rgba(255,255,255,0.1)` }}
                >
                  <Shield className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <p 
                  className="font-bold leading-tight"
                  style={{ fontSize: getScaledSize(1, linkSizePct, 1) }}
                >
                  {settings.logoText || logoText}
                </p>
                <p 
                  className="text-xs" 
                  style={{ 
                    color: lightColor,
                    fontSize: getScaledSize(0.75, linkSizePct, 0.75) 
                  }}
                >
                  {settings.logoSubtext || logoSubtext}
                </p>
              </div>
            </div>
            <p 
              className="text-white/60 mb-4"
              style={{ fontSize: getScaledSize(0.875, linkSizePct, 0.875) }}
            >
              Elite Agency serving PA, NY, and DE.
            </p>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" style={{ color: settings.accentColor || "#ff9e16" }} />
              <span 
                className="font-semibold" 
                style={{ 
                  color: settings.accentColor || "#ff9e16",
                  fontSize: getScaledSize(0.875, linkSizePct, 0.875)
                }}
              >
                Elite Agency
              </span>
            </div>
          </div>

          {/* Insurance Column 1 */}
          <div>
            <h4 
              className="font-bold text-white mb-6 opacity-80"
              style={{ 
                fontSize: getScaledSize(1.25, titleSizePct, 1.25), // Base 20px
                fontWeight: footerTitleWeight,
                textTransform: footerTitleCase as any,
                letterSpacing: footerTitleCase === 'uppercase' ? '0.1em' : 'normal'
              }}
            >
              {col1Title}
            </h4>
            <ul className="space-y-3">
              {col1Pages.map((type) => (
                <li key={type.id}>
                  <a 
                    href={`/insurance/${type.slug}`} 
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                    style={{ fontSize: getScaledSize(0.875, linkSizePct, 0.875) }}
                  >
                    {type.emoji ? (
                      <span className="text-sm">{type.emoji}</span>
                    ) : type.iconName ? (
                      <DynamicIcon name={type.iconName} size={14} style={{ color: lightColor }} />
                    ) : null}
                    {type.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Insurance Column 2 */}
          <div>
            <h4 
              className="font-bold text-white mb-6 opacity-80"
              style={{ 
                fontSize: getScaledSize(1.25, titleSizePct, 1.25),
                fontWeight: footerTitleWeight,
                textTransform: footerTitleCase as any,
                letterSpacing: footerTitleCase === 'uppercase' ? '0.1em' : 'normal'
              }}
            >
              {col2Title}
            </h4>
            <ul className="space-y-3">
              {col2Pages.map((type) => (
                <li key={type.id}>
                  <a 
                    href={`/insurance/${type.slug}`} 
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                    style={{ fontSize: getScaledSize(0.875, linkSizePct, 0.875) }}
                  >
                    {type.emoji ? (
                      <span className="text-sm">{type.emoji}</span>
                    ) : type.iconName ? (
                      <DynamicIcon name={type.iconName} size={14} style={{ color: lightColor }} />
                    ) : null}
                    {type.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 
              className="font-bold text-white mb-6 opacity-80"
              style={{ 
                fontSize: getScaledSize(1.25, titleSizePct, 1.25),
                fontWeight: footerTitleWeight,
                textTransform: footerTitleCase as any,
                letterSpacing: footerTitleCase === 'uppercase' ? '0.1em' : 'normal'
              }}
            >
              {col3Title}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: lightColor }} />
                <a 
                  href={phoneLink} 
                  className="text-white/60 hover:text-white"
                  style={{ fontSize: getScaledSize(0.875, linkSizePct, 0.875) }}
                >
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: lightColor }} />
                <a 
                  href={`mailto:${email}`} 
                  className="text-white/60 hover:text-white break-all"
                  style={{ fontSize: getScaledSize(0.875, linkSizePct, 0.875) }}
                >
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: lightColor }} />
                <span 
                  className="text-white/60"
                  style={{ fontSize: getScaledSize(0.875, linkSizePct, 0.875) }}
                >
                  {address}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" style={{ color: lightColor }} />
                  <span 
                    className="text-white/60"
                    style={{ fontSize: getScaledSize(0.875, linkSizePct, 0.875) }}
                  >
                    Mon-Fri: 8:30 AM - 5:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0 opacity-0" />
                  <span 
                    className="text-white/60"
                    style={{ fontSize: getScaledSize(0.875, linkSizePct, 0.875) }}
                  >
                    Saturday: By Appointment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div 
            className="text-center sm:text-left text-white/50"
            style={{ fontSize: getScaledSize(0.875, linkSizePct, 0.875) }}
          >
            © {new Date().getFullYear()} {footerCopyright}
          </div>
          <div 
            className="text-white/40"
            style={{ fontSize: getScaledSize(0.75, linkSizePct, 0.75) }}
          >
            Serving PA, NY, and DE
          </div>
        </div>
      </div>
    </footer>
  );
}
