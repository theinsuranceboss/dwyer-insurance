'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import {
  Shield, Car, Home, Heart, Building2, Landmark, Bike, Ship,
  TreePine, Umbrella, Fingerprint, Wrench, Briefcase, Award,
  Phone, Mail, MapPin, Clock, Star, Globe, Users, Handshake,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  label: string;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  isDropdown: boolean;
  parent: string | null;
  iconName: string;
}

export interface InsurancePage {
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
  bannerImage: string;
  bannerColorFrom: string;
  bannerColorTo: string;
  backgroundColor: string;
  cardAccentColor: string;
  textColor: string;
  emoji: string;
  bannerTextPosition: string;
  bannerCta1Text: string;
  bannerCta1Color: string;
  bannerCta1Link: string;
  bannerCta2Text: string;
  bannerCta2Color: string;
  bannerCta2Link: string;
  bannerImagePosition: string;
  bannerImageSize: string;
  bannerTitleSize: number;
}

export interface PageSection {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  visible: boolean;
}

export interface AgentInfoItem {
  id: string;
  key: string;
  value: string;
  label: string;
  type: string;
  editable: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  order: number;
  visible: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  visible: boolean;
}

export type TabId = 'settings' | 'branding' | 'appearance' | 'menu' | 'insurance' | 'sections' | 'agent' | 'testimonials' | 'faqs';

// ─── API helpers ──────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(path, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin';
    throw new Error('Unauthorized');
  }
  return res;
}

// Upload helper — uses FormData so we cannot set Content-Type manually
export async function apiUpload(file: File): Promise<{ url: string; filename: string; size: number; type: string }> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers,
    body: formData,
  });
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || 'Upload failed');
  }
  return res.json();
}

// ─── Icon name options ────────────────────────────────────────────────────────

export const ICON_OPTIONS = [
  'Shield', 'Car', 'Home', 'Heart', 'Umbrella', 'Building2', 'Ship',
  'Bike', 'Waves', 'Lock', 'Phone', 'Zap', 'Users', 'Banknote',
  'Briefcase', 'Anchor', 'Mountain', 'TreePine', 'Tent', 'Snowflake',
  'Activity', 'Apple', 'Baby', 'Backpack', 'BadgeCheck', 'Ban', 'Bandage',
  'BarChart', 'Baseline', 'Battery', 'Beaker', 'Bell', 'Bluetooth', 'Book',
  'Bookmark', 'Bot', 'Box', 'Brain', 'Brush', 'Bug', 'Bus', 'Cake',
  'Calculator', 'Calendar', 'Camera', 'Candy', 'ChefHat', 'Cherry', 'Chrome',
  'Cigarette', 'Circle', 'Citrus', 'Clapperboard', 'Clipboard', 'Clock',
  'Cloud', 'Clover', 'Code', 'Coffee', 'Coins', 'Compass', 'Computer',
  'Contact', 'Cookie', 'Copy', 'Cpu', 'CreditCard', 'Crop', 'Cross', 'Crosshair',
  'Crown', 'CupSoap', 'Database', 'Diamond', 'Dice1', 'Dice2', 'Dice3', 'Dice4',
  'Dice5', 'Dice6', 'Dna', 'Dog', 'DollarSign', 'DoorClosed', 'DoorOpen',
  'Dot', 'Download', 'Dribbble', 'Droplet', 'Drumstick', 'Dumbbell', 'Ear',
  'Edit', 'Egg', 'Euro', 'Eye', 'Facebook', 'Fan', 'FastForward', 'Feather',
  'Figma', 'File', 'Film', 'Filter', 'Flag', 'Flashlight', 'FlaskConical',
  'FlaskRound', 'Flower', 'Flower2', 'Folder', 'Footprints', 'Forward',
  'Framer', 'Frown', 'Fuel', 'Gamepad', 'Gamepad2', 'Gavel', 'Gem', 'Ghost',
  'Gift', 'GitBranch', 'GitCommit', 'GitMerge', 'GitPullRequest', 'Github',
  'Gitlab', 'GlassWater', 'Glasses', 'Globe', 'GraduationCap', 'Grape',
  'Grid', 'GripHorizontal', 'GripVertical', 'Hammer', 'Hand', 'HandMetal',
  'HardDrive', 'HardHat', 'Hash', 'Haze', 'Heading', 'Headphones', 'Heater',
  'HelpCircle', 'Hexagon', 'Highlighter', 'History', 'Hop', 'Hotel', 'Hourglass',
  'IceCream', 'Image', 'Inbox', 'Indent', 'Infinity', 'Info', 'Instagram',
  'Italic', 'JapaneseYen', 'Joystick', 'Key', 'Keyboard', 'Lamp', 'Laptop',
  'Lasso', 'LassoSelect', 'Laugh', 'Layers', 'Layout', 'Leaf', 'Library',
  'LifeBuoy', 'Lightbulb', 'LineChart', 'Link', 'Link2', 'Linkedin', 'List',
  'Loader', 'Locate', 'Lock', 'LogIn', 'LogOut', 'Lucide', 'Luggage', 'Lollipop',
];

export const MENU_ICON_OPTIONS = [
  'Car', 'Home', 'Heart', 'Building2', 'Landmark', 'Bike', 'Ship',
  'TreePine', 'Umbrella', 'Fingerprint', 'Wrench', 'Briefcase',
  'Shield', 'Award', 'Phone', 'Mail', 'MapPin', 'Clock', 'Star',
  'Globe', 'Users', 'Handshake',
];

// Dynamic icon renderer for menu items
export function DynamicMenuIcon({ name, className }: { name: string; className?: string }) {
  const cn = className || 'w-4 h-4';
  switch (name) {
    case 'Car': return <Car className={cn} />;
    case 'Home': return <Home className={cn} />;
    case 'Heart': return <Heart className={cn} />;
    case 'Building2': return <Building2 className={cn} />;
    case 'Landmark': return <Landmark className={cn} />;
    case 'Bike': return <Bike className={cn} />;
    case 'Ship': return <Ship className={cn} />;
    case 'TreePine': return <TreePine className={cn} />;
    case 'Umbrella': return <Umbrella className={cn} />;
    case 'Fingerprint': return <Fingerprint className={cn} />;
    case 'Wrench': return <Wrench className={cn} />;
    case 'Briefcase': return <Briefcase className={cn} />;
    case 'Shield': return <Shield className={cn} />;
    case 'Award': return <Award className={cn} />;
    case 'Phone': return <Phone className={cn} />;
    case 'Mail': return <Mail className={cn} />;
    case 'MapPin': return <MapPin className={cn} />;
    case 'Clock': return <Clock className={cn} />;
    case 'Star': return <Star className={cn} />;
    case 'Globe': return <Globe className={cn} />;
    case 'Users': return <Users className={cn} />;
    case 'Handshake': return <Handshake className={cn} />;
    default: return null;
  }
}

// ─── Section labels ───────────────────────────────────────────────────────────

export const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Banner',
  about: 'About Section',
  services: 'Services Section',
  whyChooseUs: 'Why Choose Us',
  testimonials: 'Testimonials Section',
  faq: 'FAQ Section',
  contact: 'Contact Section',
  ctaBanner: 'CTA Banner',
};

// ─── Shared Components ────────────────────────────────────────────────────────

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-[#0033A0]" />
    </div>
  );
}

export function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [confirm, setConfirm] = useState(false);
  if (confirm) {
    return (
      <div className="flex gap-1">
        <Button size="sm" variant="destructive" onClick={() => { onConfirm(); setConfirm(false); }} className="h-7 text-xs">
          Confirm
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirm(false)} className="h-7 text-xs">
          Cancel
        </Button>
      </div>
    );
  }
  return (
    <Button size="sm" variant="ghost" onClick={() => setConfirm(true)} className="h-7 text-xs text-red-500">
      <Trash2 className="w-3 h-3" />
    </Button>
  );
}

// ─── Appearance constants ─────────────────────────────────────────────────────

export const APPEARANCE_SECTIONS: {
  title: string;
  description: string;
  keys: string[];
}[] = [
  {
    title: 'Homepage Banner',
    description: 'Configure the hero section background image, overlay color, and opacity.',
    keys: ['heroBannerImage', 'heroBannerImagePosition', 'heroBannerImageSize', 'heroBannerOverlay', 'heroBannerOverlayOpacity'],
  },
  {
    title: 'Hero Banner Text & Buttons',
    description: 'Configure hero text position, sizes, and CTA button colors and links.',
    keys: [
      'heroTextPosition', 
      'heroTitleSize', 
      'heroDescSize', 
      'heroCtaText',
      'heroCtaColor', 
      'heroCtaLink', 
      'heroCta2Text',
      'heroCta2Color', 
      'heroCta2Link'
    ],
  },
  {
    title: 'Navigation & Branding',
    description: 'Configure navigation transparency, logo, and global text sizes.',
    keys: [
      'navBgOpacity', 
      'baseFontSize', 
      'headingFontSize',
      'logoUrl',
      'logoWidth',
      'logoText',
      'logoSubtext',
      'footerLogoUrl'
    ],
  },
  {
    title: 'Section Backgrounds',
    description: 'Set background colors for different page sections.',
    keys: ['aboutBgColor', 'servicesBgColor', 'whyChooseUsBgColor', 'testimonialsBgColor', 'faqBgColor', 'contactBgColor', 'ctaBannerBgColor', 'footerBgColor'],
  },
];

export const FOOTER_KEYS = ['footerText', 'footerCopyright', 'footerColumn1Title', 'footerColumn2Title', 'footerColumn3Title', 'footerBgColor', 'footerTitleSize', 'footerTitleCase'];

// ─── Section icons ──────────────────────────────────────────────────────────────

export const SECTION_ICONS: Record<string, string> = {
  hero: '🏠',
  about: '👤',
  services: '🛡️',
  whyChooseUs: '⭐',
  testimonials: '💬',
  faq: '❓',
  contact: '📞',
  ctaBanner: '📢',
};
