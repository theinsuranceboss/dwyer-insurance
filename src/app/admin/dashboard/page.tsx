'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Settings,
  Menu,
  Shield,
  LayoutTemplate,
  UserCircle,
  Star,
  HelpCircle,
  LogOut,
  Plus,
  Trash2,
  Save,
  Loader2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  X,
  GripVertical,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageSquare,
  Palette,
  ChevronsUpDown,
  Eye,
  Upload,
  Car,
  Home,
  Heart,
  Building2,
  Landmark,
  Bike,
  Ship,
  TreePine,
  Umbrella,
  Fingerprint,
  Wrench,
  Briefcase,
  Award,
  Clock,
  Users,
  Handshake,
  MapPin as LocationIcon,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  label: string;
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
  bannerImage: string;
  bannerColorFrom: string;
  bannerColorTo: string;
  backgroundColor: string;
  cardAccentColor: string;
  textColor: string;
}

interface PageSection {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  description: string;
  visible: boolean;
}

interface AgentInfoItem {
  id: string;
  key: string;
  value: string;
  label: string;
  type: string;
  editable: boolean;
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

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  visible: boolean;
}

type TabId = 'settings' | 'branding' | 'appearance' | 'menu' | 'insurance' | 'sections' | 'agent' | 'testimonials' | 'faqs';

// ─── API helper ───────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

async function apiFetch(path: string, options: RequestInit = {}) {
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
async function apiUpload(file: File): Promise<{ url: string; filename: string; size: number; type: string }> {
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

const ICON_OPTIONS = [
  'Shield', 'Car', 'Home', 'Heart', 'Umbrella', 'Building2', 'Ship',
  'Bike', 'Waves', 'Lock', 'Phone', 'Zap', 'Users', 'Banknote',
  'Briefcase', 'Anchor', 'Mountain', 'TreePine', 'Tent', 'Snowflake',
];

const MENU_ICON_OPTIONS = [
  'Car', 'Home', 'Heart', 'Building2', 'Landmark', 'Bike', 'Ship',
  'TreePine', 'Umbrella', 'Fingerprint', 'Wrench', 'Briefcase',
  'Shield', 'Award', 'Phone', 'Mail', 'MapPin', 'Clock', 'Star',
  'Globe', 'Users', 'Handshake',
];

// Dynamic icon renderer for menu items
function DynamicMenuIcon({ name, className }: { name: string; className?: string }) {
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
    case 'MapPin': return <LocationIcon className={cn} />;
    case 'Clock': return <Clock className={cn} />;
    case 'Star': return <Star className={cn} />;
    case 'Globe': return <Globe className={cn} />;
    case 'Users': return <Users className={cn} />;
    case 'Handshake': return <Handshake className={cn} />;
    default: return null;
  }
}

// ─── Section labels ───────────────────────────────────────────────────────────

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Banner',
  about: 'About Section',
  services: 'Services Section',
  whyChooseUs: 'Why Choose Us',
  testimonials: 'Testimonials Section',
  faq: 'FAQ Section',
  contact: 'Contact Section',
  ctaBanner: 'CTA Banner',
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'settings', label: 'Site Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'branding', label: 'Logo & Branding', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'appearance', label: 'Page Appearance', icon: <Palette className="w-4 h-4" /> },
  { id: 'menu', label: 'Menu Items', icon: <Menu className="w-4 h-4" /> },
  { id: 'insurance', label: 'Insurance Pages', icon: <Shield className="w-4 h-4" /> },
  { id: 'sections', label: 'Page Sections', icon: <LayoutTemplate className="w-4 h-4" /> },
  { id: 'agent', label: 'Agent Info', icon: <UserCircle className="w-4 h-4" /> },
  { id: 'testimonials', label: 'Testimonials', icon: <Star className="w-4 h-4" /> },
  { id: 'faqs', label: 'FAQs', icon: <HelpCircle className="w-4 h-4" /> },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>('settings');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('admin_token');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#0033A0]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-[#001e60] text-white flex flex-col transition-all duration-300 flex-shrink-0`}
      >
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img src="/logo.png" alt="Dwyer Insurance Group" className="w-full h-full object-cover" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm leading-tight">Admin Panel</h1>
              <p className="text-[10px] text-blue-200 truncate">Dwyer Insurance Group CMS</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-2 overflow-y-auto max-h-[calc(100vh-140px)]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-blue-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.icon}
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-blue-200 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <GripVertical className="w-4 h-4" />
            {sidebarOpen && <span>Toggle Sidebar</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#001e60]">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-sm text-gray-500">Manage your website content</p>
          </div>
          <a
            href="/"
            target="_blank"
            className="text-sm text-[#0033A0] hover:underline"
          >
            View Site &rarr;
          </a>
        </header>

        <div className="p-6">
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'branding' && <BrandingTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
          {activeTab === 'menu' && <MenuTab />}
          {activeTab === 'insurance' && <InsuranceTab />}
          {activeTab === 'sections' && <SectionsTab />}
          {activeTab === 'agent' && <AgentTab />}
          {activeTab === 'testimonials' && <TestimonialsTab />}
          {activeTab === 'faqs' && <FaqsTab />}
        </div>
      </main>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-[#0033A0]" />
    </div>
  );
}

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
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

// ─── Site Settings Tab ────────────────────────────────────────────────────────

function SettingsTab() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data.settings || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateValue = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings: settings.map(({ key, value }) => ({ key, value })) }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Settings saved successfully' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Filter out branding and appearance settings (they have their own tabs)
  const filteredSettings = settings.filter(
    (s) => s.category !== 'branding' && s.category !== 'footer' &&
      !['heroBannerImage', 'heroBannerOverlay', 'heroBannerOverlayOpacity', 'aboutBgColor', 'servicesBgColor'].includes(s.key)
  );
  const categories = Array.from(new Set(filteredSettings.map((s) => s.category)));
  const categoryLabels: Record<string, string> = {
    colors: 'Colors',
    fonts: 'Fonts',
    sizes: 'Sizes',
    global: 'General',
    hero: 'Hero Section',
    about: 'About Section',
    contact: 'Contact Section',
    services: 'Services',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {categories.map((cat) => {
        const catSettings = filteredSettings.filter((s) => s.category === cat);
        return (
          <Card key={cat}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{categoryLabels[cat] || cat}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {catSettings.map((setting) => (
                <div key={setting.id} className="grid grid-cols-[1fr_2fr] items-center gap-4">
                  <Label className="text-sm text-gray-600">
                    {setting.label || setting.key}
                  </Label>
                  {setting.type === 'color' ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={setting.value}
                        onChange={(e) => updateValue(setting.key, e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0"
                      />
                      <Input
                        value={setting.value}
                        onChange={(e) => updateValue(setting.key, e.target.value)}
                        className="w-32 font-mono text-sm"
                      />
                      <div
                        className="w-8 h-8 rounded-md border"
                        style={{ backgroundColor: setting.value }}
                      />
                    </div>
                  ) : setting.type === 'boolean' ? (
                    <Switch
                      checked={setting.value === 'true'}
                      onCheckedChange={(checked) =>
                        updateValue(setting.key, checked.toString())
                      }
                    />
                  ) : (
                    <Input
                      value={setting.value}
                      onChange={(e) => updateValue(setting.key, e.target.value)}
                      type={setting.type === 'size' ? 'number' : 'text'}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
      <Button onClick={handleSave} disabled={saving} className="bg-[#0033A0] hover:bg-[#001e60]">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Settings
      </Button>
    </div>
  );
}

// ─── Logo & Branding Tab ──────────────────────────────────────────────────────

function BrandingTab() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BRANDING_KEYS = ['logoUrl', 'logoText', 'logoSubtext'];

  const fetchSettings = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data.settings || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load branding settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const getSetting = (key: string) => settings.find((s) => s.key === key);

  const getValue = (key: string) => getSetting(key)?.value || '';

  const updateValue = (key: string, value: string) => {
    setSettings((prev) => {
      const exists = prev.find((s) => s.key === key);
      if (exists) {
        return prev.map((s) => (s.key === key ? { ...s, value } : s));
      }
      // Create a new setting entry if it doesn't exist yet
      return [...prev, { id: `new-${key}`, key, value, type: key === 'logoUrl' ? 'image' : 'text', category: 'branding', label: key }];
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await apiUpload(file);
      updateValue('logoUrl', result.url);
      toast({ title: 'Upload Success', description: `Logo uploaded: ${result.filename}` });
    } catch (err) {
      toast({ title: 'Upload Error', description: err instanceof Error ? err.message : 'Failed to upload logo', variant: 'destructive' });
    } finally {
      setUploading(false);
      // Reset the file input so the same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const brandingSettings = settings.filter((s) => BRANDING_KEYS.includes(s.key));
      const res = await apiFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings: brandingSettings.map(({ key, value }) => ({ key, value })) }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Branding settings saved successfully' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save branding settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const logoUrl = getValue('logoUrl');
  const logoText = getValue('logoText');
  const logoSubtext = getValue('logoSubtext');

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Logo Preview Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#0033A0]" />
            Current Logo Preview
          </CardTitle>
          <p className="text-sm text-gray-500">This is how your logo appears in the navigation bar</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-[#001e60] rounded-lg">
            {logoUrl ? (
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20">
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-6 h-6 text-white/50" />
              </div>
            )}
            <div>
              <p className="text-white font-bold text-lg">{logoText || 'Your Brand'}</p>
              <p className="text-blue-200 text-xs">{logoSubtext || 'Tagline here'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo Image */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Logo Image</CardTitle>
          <p className="text-sm text-gray-500">Set the logo image used in the navigation and branding</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Logo Image URL</Label>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Input
                value={logoUrl}
                onChange={(e) => updateValue('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png or /logo.png"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Upload New Logo (PNG)</Label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {uploading ? 'Uploading...' : 'Choose File & Upload'}
              </Button>
              <span className="text-xs text-gray-400">Max 5MB • PNG, JPEG, WebP, SVG</span>
            </div>
          </div>

          {/* Large logo preview */}
          {logoUrl && (
            <div className="mt-4 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center gap-3">
              <img
                src={logoUrl}
                alt="Logo preview"
                className="max-w-[200px] max-h-[100px] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <Badge variant="secondary" className="text-[10px]">
                <Eye className="w-3 h-3 mr-1" /> Full Size Preview
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logo Text */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Logo Text</CardTitle>
          <p className="text-sm text-gray-500">The text displayed next to the logo in the navigation</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Logo Main Text</Label>
            <Input
              value={logoText}
              onChange={(e) => updateValue('logoText', e.target.value)}
              placeholder="e.g. Dwyer Insurance Group"
            />
            <p className="text-xs text-gray-400">This appears as the primary brand name next to the logo</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Logo Sub Text</Label>
            <Input
              value={logoSubtext}
              onChange={(e) => updateValue('logoSubtext', e.target.value)}
              placeholder="e.g. Insurance Agency"
            />
            <p className="text-xs text-gray-400">This appears as a smaller tagline beneath the main text</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="bg-[#0033A0] hover:bg-[#001e60]">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Branding Settings
      </Button>
    </div>
  );
}

// ─── Page Appearance Tab ──────────────────────────────────────────────────────

const APPEARANCE_SECTIONS: {
  title: string;
  description: string;
  keys: string[];
}[] = [
  {
    title: 'Homepage Banner',
    description: 'Configure the hero section background image, overlay color, and opacity.',
    keys: ['heroBannerImage', 'heroBannerOverlay', 'heroBannerOverlayOpacity'],
  },
  {
    title: 'Section Backgrounds',
    description: 'Set background colors for different page sections.',
    keys: ['aboutBgColor', 'servicesBgColor', 'footerBgColor'],
  },
];

const FOOTER_KEYS = ['footerText', 'footerCopyright', 'footerColumn1Title', 'footerColumn2Title', 'footerColumn3Title', 'footerBgColor'];

function AppearanceTab() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data.settings || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateValue = (key: string, value: string) => {
    setSettings((prev) => {
      const exists = prev.find((s) => s.key === key);
      if (exists) {
        return prev.map((s) => (s.key === key ? { ...s, value } : s));
      }
      return [...prev, { id: `new-${key}`, key, value, type: 'text', category: 'footer', label: key }];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const allKeys = [...APPEARANCE_SECTIONS.flatMap((s) => s.keys), ...FOOTER_KEYS];
      const relevantSettings = settings.filter((s) => allKeys.includes(s.key));
      const res = await apiFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings: relevantSettings.map(({ key, value }) => ({ key, value })) }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Appearance settings saved successfully' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save appearance settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const getSetting = (key: string) => settings.find((s) => s.key === key);

  const getValue = (key: string) => getSetting(key)?.value || '';

  return (
    <div className="space-y-6 max-w-4xl">
      {APPEARANCE_SECTIONS.map((section) => {
        const sectionSettings = section.keys
          .map((key) => getSetting(key))
          .filter((s): s is SiteSetting => !!s);

        return (
          <Card key={section.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#0033A0]" />
                {section.title}
              </CardTitle>
              <p className="text-sm text-gray-500">{section.description}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {sectionSettings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {setting.label || setting.key}
                  </Label>
                  {setting.type === 'color' ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={setting.value || '#ffffff'}
                        onChange={(e) => updateValue(setting.key, e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-200"
                      />
                      <Input
                        value={setting.value}
                        onChange={(e) => updateValue(setting.key, e.target.value)}
                        className="w-36 font-mono text-sm"
                        placeholder="#ffffff"
                      />
                      <div
                        className="w-10 h-10 rounded-lg border shadow-sm"
                        style={{ backgroundColor: setting.value || '#ffffff' }}
                      />
                    </div>
                  ) : setting.type === 'image' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                        <Input
                          value={setting.value}
                          onChange={(e) => updateValue(setting.key, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          ref={setting.key === 'heroBannerImage' ? bannerFileRef : undefined}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploading(true);
                            try {
                              const result = await apiUpload(file);
                              updateValue(setting.key, result.url);
                              toast({ title: 'Upload Success', description: `Image uploaded: ${result.filename}` });
                            } catch (err) {
                              toast({ title: 'Upload Error', description: err instanceof Error ? err.message : 'Failed to upload image', variant: 'destructive' });
                            } finally {
                              setUploading(false);
                              if (bannerFileRef.current) bannerFileRef.current.value = '';
                            }
                          }}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (setting.key === 'heroBannerImage') {
                              bannerFileRef.current?.click();
                            }
                          }}
                          disabled={uploading && setting.key === 'heroBannerImage'}
                        >
                          {uploading && setting.key === 'heroBannerImage' ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Upload className="w-3 h-3 mr-1" />
                          )}
                          Upload Image
                        </Button>
                        <span className="text-xs text-gray-400">PNG, JPEG, WebP, SVG</span>
                      </div>
                      {setting.value && (
                        <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border bg-gray-50">
                          <img
                            src={setting.value}
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute bottom-1 right-1">
                            <Badge variant="secondary" className="text-[10px]">
                              <Eye className="w-3 h-3 mr-1" /> Preview
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : setting.key.includes('Opacity') ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[parseInt(setting.value) || 0]}
                          onValueChange={([v]) => updateValue(setting.key, v.toString())}
                          min={0}
                          max={100}
                          step={1}
                          className="w-64"
                        />
                        <span className="text-sm font-medium w-12 text-center bg-gray-100 rounded px-2 py-1">
                          {setting.value}%
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[0, 25, 50, 75, 100].map((v) => (
                          <Button
                            key={v}
                            size="sm"
                            variant={setting.value === v.toString() ? 'default' : 'outline'}
                            className="text-xs h-7"
                            onClick={() => updateValue(setting.key, v.toString())}
                          >
                            {v}%
                          </Button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">Preview:</span>
                        <div className="relative w-32 h-8 rounded overflow-hidden border">
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white" />
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundColor: getSetting('heroBannerOverlay')?.value || '#001e60',
                              opacity: (parseInt(setting.value) || 0) / 100,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Input
                      value={setting.value}
                      onChange={(e) => updateValue(setting.key, e.target.value)}
                      type={setting.type === 'size' ? 'number' : 'text'}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Footer Editor Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0033A0]" />
            Footer Editor
          </CardTitle>
          <p className="text-sm text-gray-500">Customize the footer text, copyright, and column titles</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Footer Text</Label>
            <Textarea
              value={getValue('footerText')}
              onChange={(e) => updateValue('footerText', e.target.value)}
              rows={2}
              placeholder="Brief description shown in the footer"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Footer Copyright</Label>
            <Input
              value={getValue('footerCopyright')}
              onChange={(e) => updateValue('footerCopyright', e.target.value)}
              placeholder="&copy; 2024 Dwyer Insurance Group. All Rights Reserved."
            />
          </div>

          <Separator className="my-2" />
          <p className="text-sm font-medium text-gray-600">Footer Column Titles</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Column 1 Title</Label>
              <Input
                value={getValue('footerColumn1Title')}
                onChange={(e) => updateValue('footerColumn1Title', e.target.value)}
                placeholder="Insurance"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Column 2 Title</Label>
              <Input
                value={getValue('footerColumn2Title')}
                onChange={(e) => updateValue('footerColumn2Title', e.target.value)}
                placeholder="More Services"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Column 3 Title</Label>
              <Input
                value={getValue('footerColumn3Title')}
                onChange={(e) => updateValue('footerColumn3Title', e.target.value)}
                placeholder="Contact"
              />
            </div>
          </div>

          <Separator className="my-2" />
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Footer Background Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={getValue('footerBgColor') || '#001e60'}
                onChange={(e) => updateValue('footerBgColor', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-gray-200"
              />
              <Input
                value={getValue('footerBgColor')}
                onChange={(e) => updateValue('footerBgColor', e.target.value)}
                className="w-36 font-mono text-sm"
                placeholder="#001e60"
              />
              <div
                className="w-10 h-10 rounded-lg border shadow-sm"
                style={{ backgroundColor: getValue('footerBgColor') || '#001e60' }}
              />
            </div>
          </div>

          {/* Footer Preview */}
          <div className="mt-2 rounded-xl overflow-hidden border">
            <div
              className="p-4 text-white"
              style={{ backgroundColor: getValue('footerBgColor') || '#001e60' }}
            >
              <p className="text-sm font-bold">{getValue('footerText') || 'Footer text preview'}</p>
              <div className="flex gap-6 mt-2">
                <span className="text-xs text-blue-200">{getValue('footerColumn1Title') || 'Column 1'}</span>
                <span className="text-xs text-blue-200">{getValue('footerColumn2Title') || 'Column 2'}</span>
                <span className="text-xs text-blue-200">{getValue('footerColumn3Title') || 'Column 3'}</span>
              </div>
              <p className="text-[10px] text-blue-300 mt-2">{getValue('footerCopyright') || 'Copyright preview'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#0033A0]" />
            Live Color Preview
          </CardTitle>
          <p className="text-sm text-gray-500">Quick overview of all appearance colors</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: 'heroBannerOverlay', label: 'Hero Overlay' },
              { key: 'aboutBgColor', label: 'About BG' },
              { key: 'servicesBgColor', label: 'Services BG' },
              { key: 'footerBgColor', label: 'Footer BG' },
            ].map(({ key, label }) => {
              const color = getValue(key) || '#ffffff';
              return (
                <div key={key} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg border shadow-sm mb-1"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-500">{label}</span>
                  <br />
                  <span className="text-[10px] font-mono text-gray-400">{color}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="bg-[#0033A0] hover:bg-[#001e60]">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Appearance Settings
      </Button>
    </div>
  );
}

// ─── Menu Items Tab ───────────────────────────────────────────────────────────

function MenuTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState<'top' | 'dropdown' | 'child' | null>(null);
  const [addChildTo, setAddChildTo] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ label: '', href: '/', order: 0, visible: true, isDropdown: false, parent: null as string | null, iconName: '' });

  const fetchItems = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/menu');
      const data = await res.json();
      setItems(data.menuItems || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load menu items', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAdd = async () => {
    try {
      const payload = { ...newItem };
      if (showAdd === 'dropdown') {
        payload.isDropdown = true;
        payload.href = '#';
      }
      if (showAdd === 'child' && addChildTo) {
        payload.parent = addChildTo;
        payload.isDropdown = false;
      }
      const res = await apiFetch('/api/admin/menu', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Menu item created' });
      setShowAdd(null);
      setAddChildTo(null);
      setNewItem({ label: '', href: '/', order: 0, visible: true, isDropdown: false, parent: null, iconName: '' });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to create menu item', variant: 'destructive' });
    }
  };

  const handleUpdate = async (item: MenuItem) => {
    try {
      const res = await apiFetch('/api/admin/menu', {
        method: 'PUT',
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Menu item updated' });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to update menu item', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string, isParent: boolean) => {
    try {
      if (isParent) {
        const children = items.filter((i) => i.parent === id);
        for (const child of children) {
          await apiFetch('/api/admin/menu', {
            method: 'DELETE',
            body: JSON.stringify({ id: child.id }),
          });
        }
      }
      const res = await apiFetch('/api/admin/menu', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: isParent ? 'Dropdown and its children deleted' : 'Menu item deleted' });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete menu item', variant: 'destructive' });
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down', siblings: MenuItem[]) => {
    const currentIndex = siblings.findIndex((s) => s.id === id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= siblings.length) return;
    const newSiblings = [...siblings];
    [newSiblings[currentIndex], newSiblings[targetIndex]] = [newSiblings[targetIndex], newSiblings[currentIndex]];
    const updated = newSiblings.map((item, i) => ({ ...item, order: i }));
    setItems((prev) => {
      const others = prev.filter((p) => p.parent !== (siblings[0]?.parent || null) || !siblings.find((s) => s.id === p.id));
      return [...others, ...updated].sort((a, b) => a.order - b.order);
    });
    for (const item of updated) {
      await apiFetch('/api/admin/menu', {
        method: 'PUT',
        body: JSON.stringify({ id: item.id, order: item.order }),
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  const topLevelItems = items.filter((item) => !item.parent).sort((a, b) => a.order - b.order);
  const childrenByParent = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (item.parent) {
      if (!acc[item.parent]) acc[item.parent] = [];
      acc[item.parent].push(item);
    }
    return acc;
  }, {});
  Object.keys(childrenByParent).forEach((key) => {
    childrenByParent[key].sort((a, b) => a.order - b.order);
  });

  const dropdownParents = topLevelItems.filter((i) => i.isDropdown);

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{items.length} menu items ({topLevelItems.length} top-level, {items.length - topLevelItems.length} children)</p>
        <div className="flex gap-2">
          <Button onClick={() => { setShowAdd('top'); setNewItem({ label: '', href: '/', order: topLevelItems.length, visible: true, isDropdown: false, parent: null, iconName: '' }); }} className="bg-[#0033A0] hover:bg-[#001e60]">
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </Button>
          <Button onClick={() => { setShowAdd('dropdown'); setNewItem({ label: '', href: '#', order: topLevelItems.length, visible: true, isDropdown: true, parent: null, iconName: '' }); }} variant="outline" className="border-[#0033A0] text-[#0033A0]">
            <Plus className="w-4 h-4 mr-2" /> Add Dropdown Group
          </Button>
        </div>
      </div>

      {showAdd && (
        <Card className="border-[#0033A0]/20">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-[#001e60]">
              {showAdd === 'dropdown' ? 'New Dropdown Group' : showAdd === 'child' ? 'New Sub-Menu Item' : 'New Menu Link'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} placeholder="e.g. Auto Insurance" />
              </div>
              <div className="space-y-2">
                <Label>URL (href)</Label>
                <Input
                  value={newItem.href}
                  onChange={(e) => setNewItem({ ...newItem, href: e.target.value })}
                  disabled={showAdd === 'dropdown'}
                  placeholder={showAdd === 'dropdown' ? '#' : 'e.g. /insurance/auto'}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex items-center gap-2">
                  <Select value={newItem.iconName || '__none__'} onValueChange={(v) => setNewItem({ ...newItem, iconName: v === '__none__' ? '' : v })}>
                    <SelectTrigger className="h-9 flex-1 text-xs">
                      <SelectValue placeholder="No icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No icon</SelectItem>
                      {MENU_ICON_OPTIONS.map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newItem.iconName && (
                    <div className="w-8 h-8 rounded bg-[#0033A0]/10 flex items-center justify-center flex-shrink-0">
                      <DynamicMenuIcon name={newItem.iconName} className="w-4 h-4 text-[#0033A0]" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-end gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={newItem.visible} onCheckedChange={(v) => setNewItem({ ...newItem, visible: v })} />
                  <Label className="text-sm">Visible</Label>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Order</Label>
                  <Input type="number" value={newItem.order} onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) || 0 })} className="w-20" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="bg-[#0033A0] hover:bg-[#001e60]">Create</Button>
              <Button variant="outline" onClick={() => { setShowAdd(null); setAddChildTo(null); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {topLevelItems.map((item) => {
          const children = childrenByParent[item.id] || [];
          return (
            <div key={item.id}>
              <MenuRow
                item={item}
                siblings={topLevelItems}
                isChild={false}
                childCount={children.length}
                onMove={(id, dir) => moveItem(id, dir, topLevelItems)}
                onUpdate={handleUpdate}
                onDelete={(id) => handleDelete(id, item.isDropdown)}
                onAddChild={item.isDropdown ? (parentId: string) => {
                  setAddChildTo(parentId);
                  setShowAdd('child');
                  setNewItem({ label: '', href: '/', order: children.length, visible: true, isDropdown: false, parent: parentId, iconName: '' });
                } : undefined}
                dropdownParents={dropdownParents}
              />
              {children.length > 0 && (
                <div className="ml-8 mt-1 space-y-1 border-l-2 border-[#0033A0]/20 pl-3">
                  {children.map((child) => (
                    <MenuRow
                      key={child.id}
                      item={child}
                      siblings={children}
                      isChild={true}
                      childCount={0}
                      onMove={(id, dir) => moveItem(id, dir, children)}
                      onUpdate={handleUpdate}
                      onDelete={(id) => handleDelete(id, false)}
                      dropdownParents={dropdownParents}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MenuRow({
  item,
  siblings,
  isChild,
  childCount,
  onMove,
  onUpdate,
  onDelete,
  onAddChild,
  dropdownParents,
}: {
  item: MenuItem;
  siblings: MenuItem[];
  isChild: boolean;
  childCount: number;
  onMove: (id: string, dir: 'up' | 'down') => void;
  onUpdate: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onAddChild?: (parentId: string) => void;
  dropdownParents: MenuItem[];
}) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<MenuItem>(item);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    onUpdate(editData);
    setEditing(false);
  };

  const currentIndex = siblings.findIndex((s) => s.id === item.id);

  return (
    <Card className={isChild ? 'bg-gray-50/50 border-gray-200' : ''}>
      <CardContent className="py-3 px-4 flex items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onMove(item.id, 'up')}
            disabled={currentIndex === 0}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMove(item.id, 'down')}
            disabled={currentIndex === siblings.length - 1}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {editing ? (
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Label</Label>
                <Input value={editData.label} onChange={(e) => setEditData({ ...editData, label: e.target.value })} className="h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">URL</Label>
                <Input value={editData.href} onChange={(e) => setEditData({ ...editData, href: e.target.value })} className="h-8" />
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {/* Icon Picker */}
              <div className="flex items-center gap-2">
                <Label className="text-xs">Icon:</Label>
                <div className="flex items-center gap-1.5">
                  <Select value={editData.iconName || '__none__'} onValueChange={(v) => setEditData({ ...editData, iconName: v === '__none__' ? '' : v })}>
                    <SelectTrigger className="h-8 w-36 text-xs">
                      <SelectValue placeholder="No icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No icon</SelectItem>
                      {MENU_ICON_OPTIONS.map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {editData.iconName ? (
                    <div className="w-7 h-7 rounded bg-[#0033A0]/10 flex items-center justify-center flex-shrink-0">
                      <DynamicMenuIcon name={editData.iconName} className="w-3.5 h-3.5 text-[#0033A0]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editData.visible} onCheckedChange={(v) => setEditData({ ...editData, visible: v })} />
                <Label className="text-xs">Visible</Label>
              </div>
              {!isChild && (
                <div className="flex items-center gap-2">
                  <Switch checked={editData.isDropdown} onCheckedChange={(v) => setEditData({ ...editData, isDropdown: v, href: v ? '#' : editData.href })} />
                  <Label className="text-xs">Dropdown</Label>
                </div>
              )}
              {isChild && (
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Parent:</Label>
                  <Select
                    value={editData.parent || '__none__'}
                    onValueChange={(v) => setEditData({ ...editData, parent: v === '__none__' ? null : v })}
                  >
                    <SelectTrigger className="h-8 w-48 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None (Top-level)</SelectItem>
                      {dropdownParents.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center gap-2 min-w-0">
            {isChild && <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />}
            {/* Show icon in display mode */}
            {item.iconName ? (
              <div className="w-6 h-6 rounded bg-[#0033A0]/10 flex items-center justify-center flex-shrink-0">
                <DynamicMenuIcon name={item.iconName} className="w-3 h-3 text-[#0033A0]" />
              </div>
            ) : null}
            <span className={`text-sm truncate ${isChild ? 'font-medium' : 'font-semibold'}`}>{item.label}</span>
            <span className="text-xs text-gray-400 truncate max-w-[120px]">{item.href}</span>
            <div className="flex gap-1 flex-shrink-0">
              {item.visible ? (
                <Badge variant="secondary" className="text-[10px]">Visible</Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] text-gray-400">Hidden</Badge>
              )}
              {item.isDropdown && <Badge className="text-[10px] bg-amber-100 text-amber-700">Dropdown</Badge>}
              {item.isDropdown && childCount > 0 && (
                <Badge variant="outline" className="text-[10px]">{childCount} items</Badge>
              )}
              {item.iconName && <Badge variant="outline" className="text-[10px]">{item.iconName}</Badge>}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {editing ? (
            <>
              <Button size="sm" onClick={handleSave} className="h-7 bg-[#0033A0] hover:bg-[#001e60]">
                <Save className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="h-7">
                <X className="w-3 h-3" />
              </Button>
            </>
          ) : (
            <>
              {onAddChild && (
                <Button size="sm" variant="ghost" onClick={() => onAddChild(item.id)} className="h-7 text-xs text-[#0033A0]">
                  <Plus className="w-3 h-3 mr-1" /> Add Child
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => { setEditData(item); setEditing(true); }} className="h-7 text-xs">
                Edit
              </Button>
              {confirmDelete ? (
                <div className="flex gap-1">
                  <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)} className="h-7 text-xs">
                    Confirm{item.isDropdown && childCount > 0 ? ` (${childCount + 1})` : ''}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)} className="h-7 text-xs">
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(true)} className="h-7 text-xs text-red-500">
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Insurance Pages Tab ──────────────────────────────────────────────────────

function InsuranceTab() {
  const { toast } = useToast();
  const [pages, setPages] = useState<InsurancePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<InsurancePage>>({});
  const [newPage, setNewPage] = useState({
    slug: '', title: '', tagline: '', description: '', features: [] as string[],
    tip: '', iconColor: '#0033A0', iconBgColor: '#e8edf5', iconName: 'Shield',
    order: 0, visible: true,
  });

  const fetchPages = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/insurance');
      const data = await res.json();
      setPages(data.insurancePages || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load insurance pages', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const handleAdd = async () => {
    try {
      const res = await apiFetch('/api/admin/insurance', {
        method: 'POST',
        body: JSON.stringify(newPage),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Insurance page created' });
      setShowAdd(false);
      setNewPage({
        slug: '', title: '', tagline: '', description: '', features: [],
        tip: '', iconColor: '#0033A0', iconBgColor: '#e8edf5', iconName: 'Shield',
        order: 0, visible: true,
      });
      fetchPages();
    } catch {
      toast({ title: 'Error', description: 'Failed to create insurance page', variant: 'destructive' });
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const res = await apiFetch('/api/admin/insurance', {
        method: 'PUT',
        body: JSON.stringify({ id: editingId, ...editData }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Insurance page updated' });
      setEditingId(null);
      setEditData({});
      fetchPages();
    } catch {
      toast({ title: 'Error', description: 'Failed to update insurance page', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await apiFetch('/api/admin/insurance', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Insurance page deleted' });
      fetchPages();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete insurance page', variant: 'destructive' });
    }
  };

  const startEdit = (page: InsurancePage) => {
    setEditingId(page.id);
    setEditData({ ...page });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{pages.length} insurance pages</p>
        <Button onClick={() => setShowAdd(true)} className="bg-[#0033A0] hover:bg-[#001e60]">
          <Plus className="w-4 h-4 mr-2" /> Add Page
        </Button>
      </div>

      {showAdd && (
        <InsuranceForm
          data={newPage}
          onChange={setNewPage}
          onSave={handleAdd}
          onCancel={() => setShowAdd(false)}
          isNew
        />
      )}

      <div className="grid gap-4">
        {pages.map((page) =>
          editingId === page.id ? (
            <InsuranceForm
              key={page.id}
              data={editData}
              onChange={setEditData}
              onSave={handleUpdate}
              onCancel={() => { setEditingId(null); setEditData({}); }}
            />
          ) : (
            <Card key={page.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: page.iconBgColor }}
                    >
                      <Shield style={{ color: page.iconColor }} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#001e60]">{page.title}</h3>
                        {!page.visible && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                        <Badge variant="outline" className="text-[10px]">/{page.slug}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{page.tagline}</p>
                      {page.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {page.features.slice(0, 4).map((f, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">{f}</Badge>
                          ))}
                          {page.features.length > 4 && (
                            <Badge variant="secondary" className="text-[10px]">+{page.features.length - 4}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(page)}>
                      Edit
                    </Button>
                    <DeleteButton onConfirm={() => handleDelete(page.id)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

function InsuranceForm({
  data,
  onChange,
  onSave,
  onCancel,
  isNew = false,
}: {
  data: Partial<InsurancePage> & { features?: string[] };
  onChange: (data: any) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}) {
  const [newFeature, setNewFeature] = useState('');
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const addFeature = () => {
    if (newFeature.trim()) {
      onChange({ ...data, features: [...(data.features || []), newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const features = [...(data.features || [])];
    features.splice(index, 1);
    onChange({ ...data, features });
  };

  const hasAppearanceValues = !!(data.bannerImage || data.bannerColorFrom || data.bannerColorTo || data.backgroundColor || data.cardAccentColor || data.textColor);

  return (
    <Card className="border-[#0033A0]/20">
      <CardContent className="pt-6 space-y-4">
        <h3 className="font-semibold text-[#001e60]">{isNew ? 'New Insurance Page' : 'Edit Insurance Page'}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={data.slug || ''} onChange={(e) => onChange({ ...data, slug: e.target.value })} disabled={!isNew} />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input value={data.tagline || ''} onChange={(e) => onChange({ ...data, tagline: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Icon Name</Label>
            <Select value={data.iconName || 'Shield'} onValueChange={(v) => onChange({ ...data, iconName: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={3} />
        </div>

        <div className="space-y-2">
          <Label>Features</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(data.features || []).map((f, i) => (
              <Badge key={i} variant="secondary" className="gap-1 pr-1">
                {f}
                <button onClick={() => removeFeature(i)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Add feature..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
            <Button type="button" size="sm" onClick={addFeature} variant="outline">Add</Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tip</Label>
          <Input value={data.tip || ''} onChange={(e) => onChange({ ...data, tip: e.target.value })} />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Icon Color</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={data.iconColor || '#0033A0'} onChange={(e) => onChange({ ...data, iconColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
              <span className="text-xs text-gray-500">{data.iconColor}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Icon BG Color</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={data.iconBgColor || '#e8edf5'} onChange={(e) => onChange({ ...data, iconBgColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
              <span className="text-xs text-gray-500">{data.iconBgColor}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input type="number" value={data.order ?? 0} onChange={(e) => onChange({ ...data, order: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="space-y-2">
            <Label>Visible</Label>
            <Switch checked={data.visible !== false} onCheckedChange={(v) => onChange({ ...data, visible: v })} />
          </div>
        </div>

        {/* Banner & Appearance Section */}
        <Separator className="my-2" />
        <button
          type="button"
          onClick={() => setAppearanceOpen(!appearanceOpen)}
          className="w-full flex items-center justify-between py-2 group"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#0033A0]" />
            <span className="font-medium text-sm text-[#001e60]">Banner &amp; Appearance</span>
            {hasAppearanceValues && (
              <Badge className="text-[10px] bg-emerald-100 text-emerald-700">Customized</Badge>
            )}
          </div>
          <ChevronsUpDown className={`w-4 h-4 text-gray-400 transition-transform ${appearanceOpen ? 'rotate-180' : ''}`} />
        </button>

        {appearanceOpen && (
          <div className="space-y-4 border-l-2 border-[#0033A0]/20 pl-4">
            <div className="space-y-2">
              <Label className="text-sm">Banner Image URL</Label>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <Input
                  value={data.bannerImage || ''}
                  onChange={(e) => onChange({ ...data, bannerImage: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  ref={bannerFileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const result = await apiUpload(file);
                      onChange({ ...data, bannerImage: result.url });
                    } catch (err) {
                      // silent fail for insurance form
                    } finally {
                      setUploading(false);
                      if (bannerFileRef.current) bannerFileRef.current.value = '';
                    }
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => bannerFileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
                  Upload Banner Image
                </Button>
              </div>
              {data.bannerImage && (
                <div className="relative w-full h-24 rounded-lg overflow-hidden border bg-gray-50">
                  <img
                    src={data.bannerImage}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Banner Gradient Start</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={data.bannerColorFrom || '#0033A0'} onChange={(e) => onChange({ ...data, bannerColorFrom: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                  <Input value={data.bannerColorFrom || ''} onChange={(e) => onChange({ ...data, bannerColorFrom: e.target.value })} className="font-mono text-xs" placeholder="#0033A0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Banner Gradient End</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={data.bannerColorTo || '#001e60'} onChange={(e) => onChange({ ...data, bannerColorTo: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                  <Input value={data.bannerColorTo || ''} onChange={(e) => onChange({ ...data, bannerColorTo: e.target.value })} className="font-mono text-xs" placeholder="#001e60" />
                </div>
              </div>
            </div>

            {(data.bannerColorFrom || data.bannerColorTo) && (
              <div
                className="h-10 rounded-lg border"
                style={{
                  background: `linear-gradient(to right, ${data.bannerColorFrom || '#0033A0'}, ${data.bannerColorTo || '#001e60'})`,
                }}
              />
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Background Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={data.backgroundColor || '#ffffff'} onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                  <Input value={data.backgroundColor || ''} onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })} className="font-mono text-xs" placeholder="#ffffff" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Card Accent Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={data.cardAccentColor || '#0033A0'} onChange={(e) => onChange({ ...data, cardAccentColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                  <Input value={data.cardAccentColor || ''} onChange={(e) => onChange({ ...data, cardAccentColor: e.target.value })} className="font-mono text-xs" placeholder="#0033A0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Text Color Override</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={data.textColor || '#1f2937'} onChange={(e) => onChange({ ...data, textColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                  <Input value={data.textColor || ''} onChange={(e) => onChange({ ...data, textColor: e.target.value })} className="font-mono text-xs" placeholder="#1f2937" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-gray-400">Preview:</span>
              <div className="flex gap-1">
                {[
                  { color: data.backgroundColor || '#ffffff', label: 'BG' },
                  { color: data.cardAccentColor || '#0033A0', label: 'Accent' },
                  { color: data.textColor || '#1f2937', label: 'Text' },
                ].map(({ color, label }) => (
                  <div key={label} className="text-center">
                    <div className="w-10 h-10 rounded border shadow-sm" style={{ backgroundColor: color }} />
                    <span className="text-[9px] text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={onSave} className="bg-[#0033A0] hover:bg-[#001e60]">
            <Save className="w-4 h-4 mr-2" /> {isNew ? 'Create' : 'Save Changes'}
          </Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page Sections Tab ────────────────────────────────────────────────────────

function SectionsTab() {
  const { toast } = useToast();
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PageSection>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/sections');
      const data = await res.json();
      setSections(data.pageSections || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load sections', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const handleSave = async (id: string) => {
    setSaving(id);
    try {
      const res = await apiFetch('/api/admin/sections', {
        method: 'PUT',
        body: JSON.stringify({ id, ...editData }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Section updated' });
      setEditingId(null);
      setEditData({});
      fetchSections();
    } catch {
      toast({ title: 'Error', description: 'Failed to update section', variant: 'destructive' });
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 max-w-4xl">
      <p className="text-sm text-gray-500">{sections.length} page sections</p>
      <div className="grid gap-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {SECTION_LABELS[section.section] || section.section}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-gray-500">Visible</Label>
                  <Switch
                    checked={section.visible}
                    onCheckedChange={async (checked) => {
                      setSaving(section.id);
                      try {
                        const res = await apiFetch('/api/admin/sections', {
                          method: 'PUT',
                          body: JSON.stringify({ id: section.id, visible: checked }),
                        });
                        if (!res.ok) throw new Error();
                        fetchSections();
                      } catch {
                        toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
                      } finally {
                        setSaving(null);
                      }
                    }}
                    disabled={saving === section.id}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {editingId === section.id ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm">Title</Label>
                    <Input value={editData.title || ''} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Subtitle</Label>
                    <Input value={editData.subtitle || ''} onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Description</Label>
                    <Textarea value={editData.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(section.id)} disabled={saving === section.id} className="bg-[#0033A0] hover:bg-[#001e60]">
                      {saving === section.id ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setEditData({}); }}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-xs text-gray-400">Title:</span>
                    <p className="text-sm">{section.title}</p>
                  </div>
                  {section.subtitle && (
                    <div>
                      <span className="text-xs text-gray-400">Subtitle:</span>
                      <p className="text-sm">{section.subtitle}</p>
                    </div>
                  )}
                  {section.description && (
                    <div>
                      <span className="text-xs text-gray-400">Description:</span>
                      <p className="text-sm text-gray-600 line-clamp-2">{section.description}</p>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingId(section.id); setEditData({ ...section }); }}
                  >
                    Edit Section
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Agent Info Tab ───────────────────────────────────────────────────────────

function AgentTab() {
  const { toast } = useToast();
  const [agentInfo, setAgentInfo] = useState<AgentInfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAgent = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/agent');
      const data = await res.json();
      setAgentInfo(data.agentInfo || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load agent info', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchAgent(); }, [fetchAgent]);

  const updateValue = (key: string, value: string) => {
    setAgentInfo((prev) => prev.map((a) => (a.key === key ? { ...a, value } : a)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/api/admin/agent', {
        method: 'PUT',
        body: JSON.stringify({ items: agentInfo.map(({ key, value }) => ({ key, value })) }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Agent info saved' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save agent info', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const getIcon = (key: string) => {
    if (key.toLowerCase().includes('phone')) return <Phone className="w-4 h-4" />;
    if (key.toLowerCase().includes('email')) return <Mail className="w-4 h-4" />;
    if (key.toLowerCase().includes('address') || key.toLowerCase().includes('state')) return <MapPin className="w-4 h-4" />;
    if (key.toLowerCase().includes('url') || key.toLowerCase().includes('photo')) return <ImageIcon className="w-4 h-4" />;
    if (key.toLowerCase().includes('language')) return <Globe className="w-4 h-4" />;
    if (key.toLowerCase().includes('tagline')) return <MessageSquare className="w-4 h-4" />;
    return <UserCircle className="w-4 h-4" />;
  };

  if (loading) return <LoadingSpinner />;

  const photoUrl = agentInfo.find((a) => a.key.toLowerCase().includes('photo'))?.value;

  return (
    <div className="space-y-6 max-w-4xl">
      {photoUrl && (
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={photoUrl} alt="Agent photo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-medium">Agent Photo Preview</p>
              <p className="text-xs text-gray-500">Update the photoUrl field below to change</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Agent Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {agentInfo.map((item) => (
            <div key={item.id} className="grid grid-cols-[180px_1fr] items-center gap-4">
              <Label className="text-sm text-gray-600 flex items-center gap-2">
                {getIcon(item.key)}
                {item.label || item.key}
              </Label>
              {item.type === 'image' ? (
                <div className="flex items-center gap-2">
                  <Input value={item.value} onChange={(e) => updateValue(item.key, e.target.value)} />
                  {item.value && (
                    <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.value} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                <Input
                  value={item.value}
                  onChange={(e) => updateValue(item.key, e.target.value)}
                  type={item.type === 'phone' ? 'tel' : item.type === 'email' ? 'email' : 'text'}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="bg-[#0033A0] hover:bg-[#001e60]">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Agent Info
      </Button>
    </div>
  );
}

// ─── Testimonials Tab ─────────────────────────────────────────────────────────

function TestimonialsTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Testimonial>>({});
  const [newItem, setNewItem] = useState({
    name: '', rating: 5, text: '', date: '', order: 0, visible: true,
  });

  const fetchItems = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/testimonials');
      const data = await res.json();
      setItems(data.testimonials || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load testimonials', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAdd = async () => {
    try {
      const res = await apiFetch('/api/admin/testimonials', {
        method: 'POST',
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Testimonial created' });
      setShowAdd(false);
      setNewItem({ name: '', rating: 5, text: '', date: '', order: 0, visible: true });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to create testimonial', variant: 'destructive' });
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const res = await apiFetch('/api/admin/testimonials', {
        method: 'PUT',
        body: JSON.stringify({ id: editingId, ...editData }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Testimonial updated' });
      setEditingId(null);
      setEditData({});
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to update testimonial', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await apiFetch('/api/admin/testimonials', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Testimonial deleted' });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete testimonial', variant: 'destructive' });
    }
  };

  if (loading) return <LoadingSpinner />;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{items.length} testimonials</p>
        <Button onClick={() => setShowAdd(true)} className="bg-[#0033A0] hover:bg-[#001e60]">
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      {showAdd && (
        <Card className="border-[#0033A0]/20">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-[#001e60]">New Testimonial</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input value={newItem.date} onChange={(e) => setNewItem({ ...newItem, date: e.target.value })} placeholder="e.g., January 2024" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rating: {newItem.rating} / 5</Label>
              <Slider
                value={[newItem.rating]}
                onValueChange={([v]) => setNewItem({ ...newItem, rating: v })}
                min={1}
                max={5}
                step={1}
                className="w-48"
              />
              <div className="flex gap-0.5">{renderStars(newItem.rating)}</div>
            </div>
            <div className="space-y-2">
              <Label>Testimonial Text</Label>
              <Textarea value={newItem.text} onChange={(e) => setNewItem({ ...newItem, text: e.target.value })} rows={3} />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={newItem.visible} onCheckedChange={(v) => setNewItem({ ...newItem, visible: v })} />
                <Label className="text-sm">Visible</Label>
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Order</Label>
                <Input type="number" value={newItem.order} onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) || 0 })} className="w-20" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="bg-[#0033A0] hover:bg-[#001e60]">Create</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {items.map((item) =>
          editingId === item.id ? (
            <Card key={item.id} className="border-[#0033A0]/20">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-[#001e60]">Edit Testimonial</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input value={editData.date || ''} onChange={(e) => setEditData({ ...editData, date: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rating: {editData.rating ?? 5} / 5</Label>
                  <Slider
                    value={[editData.rating ?? 5]}
                    onValueChange={([v]) => setEditData({ ...editData, rating: v })}
                    min={1}
                    max={5}
                    step={1}
                    className="w-48"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Text</Label>
                  <Textarea value={editData.text || ''} onChange={(e) => setEditData({ ...editData, text: e.target.value })} rows={3} />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={editData.visible !== false} onCheckedChange={(v) => setEditData({ ...editData, visible: v })} />
                    <Label className="text-sm">Visible</Label>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Order</Label>
                    <Input type="number" value={editData.order ?? 0} onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) || 0 })} className="w-20" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdate} className="bg-[#0033A0] hover:bg-[#001e60]">
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button variant="outline" onClick={() => { setEditingId(null); setEditData({}); }}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{item.name}</span>
                      <div className="flex gap-0.5">{renderStars(item.rating)}</div>
                      {!item.visible && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.text}</p>
                    {item.date && <p className="text-xs text-gray-400 mt-1">{item.date}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => { setEditingId(item.id); setEditData({ ...item }); }}>
                      Edit
                    </Button>
                    <DeleteButton onConfirm={() => handleDelete(item.id)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

// ─── FAQs Tab ─────────────────────────────────────────────────────────────────

function FaqsTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<FaqItem>>({});
  const [newItem, setNewItem] = useState({ question: '', answer: '', order: 0, visible: true });

  const fetchItems = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/faqs');
      const data = await res.json();
      setItems(data.faqs || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load FAQs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAdd = async () => {
    try {
      const res = await apiFetch('/api/admin/faqs', {
        method: 'POST',
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'FAQ created' });
      setShowAdd(false);
      setNewItem({ question: '', answer: '', order: 0, visible: true });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to create FAQ', variant: 'destructive' });
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const res = await apiFetch('/api/admin/faqs', {
        method: 'PUT',
        body: JSON.stringify({ id: editingId, ...editData }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'FAQ updated' });
      setEditingId(null);
      setEditData({});
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to update FAQ', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await apiFetch('/api/admin/faqs', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'FAQ deleted' });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete FAQ', variant: 'destructive' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{items.length} FAQs</p>
        <Button onClick={() => setShowAdd(true)} className="bg-[#0033A0] hover:bg-[#001e60]">
          <Plus className="w-4 h-4 mr-2" /> Add FAQ
        </Button>
      </div>

      {showAdd && (
        <Card className="border-[#0033A0]/20">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-[#001e60]">New FAQ</h3>
            <div className="space-y-2">
              <Label>Question</Label>
              <Input value={newItem.question} onChange={(e) => setNewItem({ ...newItem, question: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea value={newItem.answer} onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })} rows={3} />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={newItem.visible} onCheckedChange={(v) => setNewItem({ ...newItem, visible: v })} />
                <Label className="text-sm">Visible</Label>
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Order</Label>
                <Input type="number" value={newItem.order} onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) || 0 })} className="w-20" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="bg-[#0033A0] hover:bg-[#001e60]">Create</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {items.map((item) =>
          editingId === item.id ? (
            <Card key={item.id} className="border-[#0033A0]/20">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-[#001e60]">Edit FAQ</h3>
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Input value={editData.question || ''} onChange={(e) => setEditData({ ...editData, question: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Answer</Label>
                  <Textarea value={editData.answer || ''} onChange={(e) => setEditData({ ...editData, answer: e.target.value })} rows={3} />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={editData.visible !== false} onCheckedChange={(v) => setEditData({ ...editData, visible: v })} />
                    <Label className="text-sm">Visible</Label>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Order</Label>
                    <Input type="number" value={editData.order ?? 0} onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) || 0 })} className="w-20" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdate} className="bg-[#0033A0] hover:bg-[#001e60]">
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button variant="outline" onClick={() => { setEditingId(null); setEditData({}); }}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{item.question}</span>
                      {!item.visible && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.answer}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => { setEditingId(item.id); setEditData({ ...item }); }}>
                      Edit
                    </Button>
                    <DeleteButton onConfirm={() => handleDelete(item.id)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
