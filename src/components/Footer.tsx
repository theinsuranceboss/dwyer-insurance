"use client";

import { Phone, Mail, MapPin, Clock, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import DynamicIcon from "@/components/DynamicIcon";

interface InsurancePageData {
  id: string;
  slug: string;
  title: string;
  iconName: string;
  [key: string]: unknown;
}

export default function Footer({
  settings,
  agentInfo,
  insurancePages,
}: {
  settings: Record<string, string>;
  agentInfo: Record<string, string>;
  insurancePages: InsurancePageData[];
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

  const halfIdx = Math.ceil(insurancePages.length / 2);
  const col1Pages = insurancePages.slice(0, halfIdx);
  const col2Pages = insurancePages.slice(halfIdx);

  return (
    <footer style={{ backgroundColor: footerBg }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoUrl} alt={logoText} className="h-10 max-w-[40px] object-contain" />
              <div>
                <p className="font-bold text-lg">{logoText}</p>
                <p className="text-sm" style={{ color: lightColor }}>{logoSubtext}</p>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-4">Elite Agency serving PA, NY, and DE.</p>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" style={{ color: settings.accentColor || "#ff9e16" }} />
              <span className="font-semibold text-sm" style={{ color: settings.accentColor || "#ff9e16" }}>Elite Agency</span>
            </div>
          </div>

          {/* Insurance Column 1 */}
          <div>
            <h4 className="font-semibold text-white mb-4">{col1Title}</h4>
            <ul className="space-y-2">
              {col1Pages.map((type) => (
                <li key={type.id}>
                  <a href={`/insurance/${type.slug}`} className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5">
                    {type.iconName && <DynamicIcon name={type.iconName} size={12} style={{ color: lightColor }} />}
                    {type.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Insurance Column 2 */}
          <div>
            <h4 className="font-semibold text-white mb-4">{col2Title}</h4>
            <ul className="space-y-2">
              {col2Pages.map((type) => (
                <li key={type.id}>
                  <a href={`/insurance/${type.slug}`} className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5">
                    {type.iconName && <DynamicIcon name={type.iconName} size={12} style={{ color: lightColor }} />}
                    {type.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">{col3Title}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: lightColor }} />
                <a href={phoneLink} className="text-white/60 hover:text-white text-sm">{phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: lightColor }} />
                <a href={`mailto:${email}`} className="text-white/60 hover:text-white text-sm break-all">{email}</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: lightColor }} />
                <span className="text-white/60 text-sm">{address}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" style={{ color: lightColor }} />
                  <span className="text-white/60 text-sm">Mon-Fri: 8:30 AM - 5:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0 opacity-0" />
                  <span className="text-white/60 text-sm">Saturday: By Appointment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left text-white/50 text-sm">
            © {new Date().getFullYear()} {footerCopyright}
          </div>
          <div className="text-white/40 text-xs">
            Serving PA, NY, and DE
          </div>
        </div>
      </div>
    </footer>
  );
}
