'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Image as ImageIcon, Loader2, Save, Palette, Eye, MessageSquare, Upload, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { type SiteSetting, apiFetch, apiUpload, LoadingSpinner, APPEARANCE_SECTIONS, FOOTER_KEYS } from './shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AppearanceTab() {
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
                  ) : setting.key === 'heroTextPosition' ? (
                    <div className="space-y-2">
                      <Select value={setting.value || 'center'} onValueChange={(v) => updateValue(setting.key, v)}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">
                            <span className="flex items-center gap-2"><AlignLeft className="w-4 h-4" /> Left</span>
                          </SelectItem>
                          <SelectItem value="center">
                            <span className="flex items-center gap-2"><AlignCenter className="w-4 h-4" /> Center</span>
                          </SelectItem>
                          <SelectItem value="right">
                            <span className="flex items-center gap-2"><AlignRight className="w-4 h-4" /> Right</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
              { key: 'heroCtaColor', label: 'CTA 1 Color' },
              { key: 'heroCta2Color', label: 'CTA 2 Color' },
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
