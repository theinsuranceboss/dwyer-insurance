'use client';

import { useState, useEffect, useCallback } from 'react';
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

type TabId = 'settings' | 'menu' | 'insurance' | 'sections' | 'agent' | 'testimonials' | 'faqs';

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

// ─── Icon name options for insurance pages ────────────────────────────────────

const ICON_OPTIONS = [
  'Shield', 'Car', 'Home', 'Heart', 'Umbrella', 'Building2', 'Ship',
  'Bike', 'Waves', 'Lock', 'Phone', 'Zap', 'Users', 'Banknote',
  'Briefcase', 'Anchor', 'Mountain', 'TreePine', 'Tent', 'Snowflake',
];

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
          <div className="w-8 h-8 rounded-full bg-[#0033A0] flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm leading-tight">Admin Panel</h1>
              <p className="text-[10px] text-blue-200 truncate">Suzanne Dwyer CMS</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-2">
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

  const categories = Array.from(new Set(settings.map((s) => s.category)));
  const categoryLabels: Record<string, string> = {
    colors: 'Colors',
    fonts: 'Fonts',
    sizes: 'Sizes',
    global: 'General',
    hero: 'Hero Section',
    about: 'About Section',
    footer: 'Footer',
    contact: 'Contact Section',
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {categories.map((cat) => {
        const catSettings = settings.filter((s) => s.category === cat);
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

// ─── Menu Items Tab ───────────────────────────────────────────────────────────

function MenuTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState<'top' | 'dropdown' | 'child' | null>(null);
  const [addChildTo, setAddChildTo] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ label: '', href: '/', order: 0, visible: true, isDropdown: false, parent: null as string | null });

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
      setNewItem({ label: '', href: '/', order: 0, visible: true, isDropdown: false, parent: null });
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
      // If deleting a parent, also delete all children
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
    // Optimistic update
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

  // Build tree structure
  const topLevelItems = items.filter((item) => !item.parent).sort((a, b) => a.order - b.order);
  const childrenByParent = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (item.parent) {
      if (!acc[item.parent]) acc[item.parent] = [];
      acc[item.parent].push(item);
    }
    return acc;
  }, {});
  // Sort children
  Object.keys(childrenByParent).forEach((key) => {
    childrenByParent[key].sort((a, b) => a.order - b.order);
  });

  const dropdownParents = topLevelItems.filter((i) => i.isDropdown);

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{items.length} menu items ({topLevelItems.length} top-level, {items.length - topLevelItems.length} children)</p>
        <div className="flex gap-2">
          <Button onClick={() => { setShowAdd('top'); setNewItem({ label: '', href: '/', order: topLevelItems.length, visible: true, isDropdown: false, parent: null }); }} className="bg-[#0033A0] hover:bg-[#001e60]">
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </Button>
          <Button onClick={() => { setShowAdd('dropdown'); setNewItem({ label: '', href: '#', order: topLevelItems.length, visible: true, isDropdown: true, parent: null }); }} variant="outline" className="border-[#0033A0] text-[#0033A0]">
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
            <div className="flex items-center gap-6">
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
                  setNewItem({ label: '', href: '/', order: children.length, visible: true, isDropdown: false, parent: parentId });
                } : undefined}
                dropdownParents={dropdownParents}
              />
              {/* Children */}
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
  const [editData, setEditData] = useState(item);
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

      {/* Add new form */}
      {showAdd && (
        <InsuranceForm
          data={newPage}
          onChange={setNewPage}
          onSave={handleAdd}
          onCancel={() => setShowAdd(false)}
          isNew
        />
      )}

      {/* List of pages */}
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
      {/* Photo Preview */}
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
        <p className="text-sm text-gray-500">{items.length} FAQ items</p>
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
            <div className="flex items-center gap-6">
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

      <div className="grid gap-3">
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
                <div className="flex items-center gap-6">
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
              <CardContent className="py-4 px-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#0033A0] flex-shrink-0" />
                      <span className="font-medium text-sm">{item.question}</span>
                      {!item.visible && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                      <Badge variant="outline" className="text-[10px]">#{item.order}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 ml-6 line-clamp-2">{item.answer}</p>
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

// ─── Shared Components ────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-[#0033A0]" />
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
    <Button size="sm" variant="ghost" onClick={() => setConfirm(true)} className="h-7 text-xs text-red-500 hover:text-red-700">
      <Trash2 className="w-3 h-3" />
    </Button>
  );
}
