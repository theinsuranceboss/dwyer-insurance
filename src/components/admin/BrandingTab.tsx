'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Image as ImageIcon, Loader2, Save, Upload, Eye } from 'lucide-react';
import { type SiteSetting, apiFetch, apiUpload, LoadingSpinner } from './shared';

export default function BrandingTab() {
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
