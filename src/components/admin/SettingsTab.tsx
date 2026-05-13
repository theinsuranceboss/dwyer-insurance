'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { type SiteSetting, apiFetch, LoadingSpinner } from './shared';

export default function SettingsTab() {
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
