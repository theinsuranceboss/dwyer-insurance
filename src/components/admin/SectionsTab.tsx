'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { type PageSection, apiFetch, LoadingSpinner, SECTION_LABELS } from './shared';

export default function SectionsTab() {
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
