'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, Save, X, Loader2, Upload, Palette, ChevronsUpDown, Home, Image as ImageIcon } from 'lucide-react';
import { type InsurancePage, apiFetch, apiUpload, LoadingSpinner, DeleteButton, ICON_OPTIONS } from './shared';

export default function InsuranceTab() {
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
  const [editingHome, setEditingHome] = useState(false);
  const [homeData, setHomeData] = useState<Record<string, string>>({});
  const [savingHome, setSavingHome] = useState(false);

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
        <p className="text-sm text-gray-500">{pages.length + 1} pages total</p>
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
        {/* Virtual Home Page Entry */}
        {editingHome ? (
          <HomepageForm
            data={homeData}
            onChange={(newData) => setHomeData(newData)}
            onSave={async () => {
              setSavingHome(true);
              try {
                const res = await apiFetch('/api/admin/settings', {
                  method: 'PUT',
                  body: JSON.stringify({ settings: Object.entries(homeData).map(([key, value]) => ({ key, value })) }),
                });
                if (!res.ok) throw new Error();
                toast({ title: 'Success', description: 'Home page updated' });
                setEditingHome(false);
              } catch {
                toast({ title: 'Error', description: 'Failed to update home page', variant: 'destructive' });
              } finally {
                setSavingHome(false);
              }
            }}
            onCancel={() => setEditingHome(false)}
            isSaving={savingHome}
          />
        ) : (
          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-100">
                    <Home className="w-5 h-5 text-[#0033A0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#001e60]">Home Page</h3>
                      <Badge variant="outline" className="text-[10px]">/</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">The main landing page of your website</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await apiFetch('/api/admin/settings');
                      const data = await res.json();
                      const settings = data.settings || [];
                      const homeFields = ['heroTitle', 'heroSubtitle', 'heroDescription', 'heroBannerImage', 'heroCtaText', 'heroCtaLink'];
                      const extracted: Record<string, string> = {};
                      homeFields.forEach(f => {
                        extracted[f] = settings.find((s: any) => s.key === f)?.value || '';
                      });
                      setHomeData(extracted);
                      setEditingHome(true);
                    } catch {
                      toast({ title: 'Error', description: 'Failed to load home page data', variant: 'destructive' });
                    } finally {
                      setLoading(false);
                    }
                  }}>
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                        {page.emoji && <span className="text-lg">{page.emoji}</span>}
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

  const hasAppearanceValues = !!(data.bannerImage || data.bannerColorFrom || data.bannerColorTo || data.backgroundColor || data.cardAccentColor || data.textColor || data.bannerTextPosition || data.bannerCta1Text || data.bannerCta1Color || data.bannerCta1Link || data.bannerCta2Text || data.bannerCta2Color || data.bannerCta2Link);

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
          <div className="space-y-2">
            <Label>Emoji</Label>
            <div className="flex items-center gap-2">
              <Input value={data.emoji || ''} onChange={(e) => onChange({ ...data, emoji: e.target.value })} placeholder="🛡️" className="w-24" />
              {data.emoji && <span className="text-2xl">{data.emoji}</span>}
            </div>
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
                <div className="relative w-full h-24 rounded-lg overflow-hidden border bg-gray-50 mt-2">
                  <img
                    src={data.bannerImage}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    style={{ 
                      objectPosition: data.bannerImagePosition || "center center",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Banner Image Position</Label>
                <Select value={data.bannerImagePosition || 'center center'} onValueChange={(v) => onChange({ ...data, bannerImagePosition: v })}>
                  <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center center">Center</SelectItem>
                    <SelectItem value="top center">Top</SelectItem>
                    <SelectItem value="bottom center">Bottom</SelectItem>
                    <SelectItem value="left center">Left</SelectItem>
                    <SelectItem value="right center">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Banner Image Zoom/Size</Label>
                <Select value={data.bannerImageSize || 'cover'} onValueChange={(v) => onChange({ ...data, bannerImageSize: v })}>
                  <SelectTrigger className="text-xs h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover (Full)</SelectItem>
                    <SelectItem value="contain">Contain (Whole)</SelectItem>
                    <SelectItem value="110%">110%</SelectItem>
                    <SelectItem value="125%">125%</SelectItem>
                    <SelectItem value="150%">150%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Banner Title Font Size (px)</Label>
              <Input 
                type="number" 
                value={data.bannerTitleSize || 52} 
                onChange={(e) => onChange({ ...data, bannerTitleSize: parseInt(e.target.value) || 52 })} 
                className="w-32 h-8 text-xs"
              />
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

            {/* Banner Text & CTA Buttons */}
            <Separator className="my-2" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Banner Text &amp; Buttons</p>

            <div className="space-y-2">
              <Label className="text-sm">Banner Text Position</Label>
              <Select value={data.bannerTextPosition || 'center'} onValueChange={(v) => onChange({ ...data, bannerTextPosition: v })}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">CTA Button 1 Text</Label>
                <Input value={data.bannerCta1Text || ''} onChange={(e) => onChange({ ...data, bannerCta1Text: e.target.value })} placeholder="Call for a Quote" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">CTA Button 1 Link</Label>
                <Input value={data.bannerCta1Link || ''} onChange={(e) => onChange({ ...data, bannerCta1Link: e.target.value })} placeholder="tel:+16107259900" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">CTA Button 1 Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={data.bannerCta1Color || '#ff9e16'} onChange={(e) => onChange({ ...data, bannerCta1Color: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                <Input value={data.bannerCta1Color || ''} onChange={(e) => onChange({ ...data, bannerCta1Color: e.target.value })} className="font-mono text-xs" placeholder="#ff9e16" />
                {data.bannerCta1Color && (
                  <button
                    type="button"
                    className="px-3 py-1 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: data.bannerCta1Color }}
                  >
                    {data.bannerCta1Text || 'CTA 1'}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">CTA Button 2 Text</Label>
                <Input value={data.bannerCta2Text || ''} onChange={(e) => onChange({ ...data, bannerCta2Text: e.target.value })} placeholder="Request Online" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">CTA Button 2 Link</Label>
                <Input value={data.bannerCta2Link || ''} onChange={(e) => onChange({ ...data, bannerCta2Link: e.target.value })} placeholder="/" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">CTA Button 2 Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={data.bannerCta2Color || '#ffffff'} onChange={(e) => onChange({ ...data, bannerCta2Color: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                <Input value={data.bannerCta2Color || ''} onChange={(e) => onChange({ ...data, bannerCta2Color: e.target.value })} className="font-mono text-xs" placeholder="(empty = outline style)" />
                {data.bannerCta2Color ? (
                  <button
                    type="button"
                    className="px-3 py-1 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: data.bannerCta2Color }}
                  >
                    {data.bannerCta2Text || 'CTA 2'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-3 py-1 rounded text-xs font-semibold border-2 border-current"
                    style={{ color: data.bannerCta1Color || '#ff9e16' }}
                  >
                    {data.bannerCta2Text || 'CTA 2'}
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-400">Leave empty for outline style button</p>
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

function HomepageForm({
  data,
  onChange,
  onSave,
  onCancel,
  isSaving
}: {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardContent className="pt-6 space-y-4">
        <h3 className="font-semibold text-[#001e60]">Edit Home Page</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label>Hero Title</Label>
            <Input value={data.heroTitle || ''} onChange={(e) => onChange({ ...data, heroTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Hero Subtitle</Label>
            <Input value={data.heroSubtitle || ''} onChange={(e) => onChange({ ...data, heroSubtitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Hero Description</Label>
            <Textarea value={data.heroDescription || ''} onChange={(e) => onChange({ ...data, heroDescription: e.target.value })} rows={3} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Hero Banner Image</Label>
          <div className="flex items-center gap-2">
            <Input value={data.heroBannerImage || ''} onChange={(e) => onChange({ ...data, heroBannerImage: e.target.value })} placeholder="/uploads/..." />
            <input
              ref={bannerFileRef}
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const res = await apiUpload(file);
                  onChange({ ...data, heroBannerImage: res.url });
                } catch {
                  // silent
                } finally {
                  setUploading(false);
                }
              }}
              className="hidden"
            />
            <Button size="sm" variant="outline" onClick={() => bannerFileRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>CTA Text</Label>
            <Input value={data.heroCtaText || ''} onChange={(e) => onChange({ ...data, heroCtaText: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>CTA Link</Label>
            <Input value={data.heroCtaLink || ''} onChange={(e) => onChange({ ...data, heroCtaLink: e.target.value })} />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={onSave} className="bg-[#0033A0] hover:bg-[#001e60]" disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Home Page
          </Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}
