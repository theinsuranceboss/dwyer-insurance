'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Save, Eye, EyeOff, ChevronDown, ChevronRight, X } from 'lucide-react';
import { type PageSection, apiFetch, LoadingSpinner, SECTION_LABELS, SECTION_ICONS, ICON_OPTIONS } from './shared';

export default function SectionsTab() {
  const { toast } = useToast();
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PageSection>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const toggleVisibility = async (section: PageSection, checked: boolean) => {
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
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{sections.length} page sections</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Eye className="w-3 h-3 mr-1" />
            {sections.filter((s) => s.visible).length} visible
          </Badge>
          <Badge variant="outline" className="text-xs">
            <EyeOff className="w-3 h-3 mr-1" />
            {sections.filter((s) => !s.visible).length} hidden
          </Badge>
        </div>
      </div>

      <div className="grid gap-3">
        {sections.map((section) => {
          const icon = SECTION_ICONS[section.section] || '📄';
          const label = SECTION_LABELS[section.section] || section.section;
          const isExpanded = expandedId === section.id || editingId === section.id;

          return (
            <Card
              key={section.id}
              className={`transition-all ${
                !section.visible ? 'opacity-60 border-dashed' : 'border-[#0033A0]/10'
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : section.id)}
                      className="flex items-center gap-2 group"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                    <span className="text-xl">{icon}</span>
                    <div>
                      <CardTitle className="text-base">{label}</CardTitle>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        section: &quot;{section.section}&quot;
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {section.visible ? (
                      <Badge className="text-[10px] bg-emerald-100 text-emerald-700">Visible</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Hidden</Badge>
                    )}
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-500">
                        <Switch
                          checked={section.visible}
                          onCheckedChange={(checked) => toggleVisibility(section, checked)}
                          disabled={saving === section.id}
                          className="mr-1"
                        />
                      </Label>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {(isExpanded || editingId === section.id) && (
                <CardContent className="space-y-4">
                  {editingId === section.id ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Title</Label>
                          <Input
                            value={editData.title || ''}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            placeholder="Section title..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Subtitle</Label>
                          <Input
                            value={editData.subtitle || ''}
                            onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })}
                            placeholder="Section subtitle..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Section Icon</Label>
                          <Select 
                            value={editData.content ? (JSON.parse(editData.content).sectionIcon || 'FileText') : 'FileText'} 
                            onValueChange={(v) => {
                              const content = editData.content ? JSON.parse(editData.content) : {};
                              setEditData({ ...editData, content: JSON.stringify({ ...content, sectionIcon: v }) });
                            }}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {ICON_OPTIONS.map(name => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Description</Label>
                        <Textarea
                          value={editData.description || ''}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          rows={4}
                          placeholder="Section description..."
                        />
                      </div>

                      {section.section === 'whyChooseUs' && (
                        <div className="space-y-4 border-t pt-4 mt-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-bold">Reasons List (JSON Content)</Label>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                const currentContent = editData.content ? JSON.parse(editData.content) : [];
                                const newContent = [...currentContent, { icon: 'Shield', title: 'New Reason', desc: 'Description here' }];
                                setEditData({ ...editData, content: JSON.stringify(newContent) });
                              }}
                            >
                              Add Reason
                            </Button>
                          </div>
                          <div className="grid gap-4">
                            {(() => {
                              try {
                                const items = editData.content ? JSON.parse(editData.content) : [];
                                if (!Array.isArray(items)) return null;
                                return items.map((item, idx) => (
                                  <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-3 relative group">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => {
                                        const newItems = items.filter((_, i) => i !== idx);
                                        setEditData({ ...editData, content: JSON.stringify(newItems) });
                                      }}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="space-y-1">
                                        <Label className="text-xs">Icon Name</Label>
                                        <Input 
                                          value={item.icon} 
                                          className="h-8 text-xs" 
                                          onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[idx] = { ...item, icon: e.target.value };
                                            setEditData({ ...editData, content: JSON.stringify(newItems) });
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs">Title</Label>
                                        <Input 
                                          value={item.title} 
                                          className="h-8 text-xs" 
                                          onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[idx] = { ...item, title: e.target.value };
                                            setEditData({ ...editData, content: JSON.stringify(newItems) });
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Description</Label>
                                      <Textarea 
                                        value={item.desc} 
                                        className="text-xs min-h-[60px]" 
                                        onChange={(e) => {
                                          const newItems = [...items];
                                          newItems[idx] = { ...item, desc: e.target.value };
                                          setEditData({ ...editData, content: JSON.stringify(newItems) });
                                        }}
                                      />
                                    </div>
                                  </div>
                                ));
                              } catch (e) {
                                return <p className="text-red-500 text-xs">Invalid JSON content</p>;
                              }
                            })()}
                          </div>
                        </div>
                      )}
                      <Separator />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(section.id)}
                          disabled={saving === section.id}
                          className="bg-[#0033A0] hover:bg-[#001e60]"
                        >
                          {saving === section.id ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Save className="w-3 h-3 mr-1" />
                          )}
                          Save Changes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            setEditData({});
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Title</span>
                          <p className="text-sm mt-0.5">{section.title || <span className="text-gray-300 italic">No title</span>}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Subtitle</span>
                          <p className="text-sm mt-0.5">{section.subtitle || <span className="text-gray-300 italic">No subtitle</span>}</p>
                        </div>
                      </div>
                      {section.description && (
                        <div>
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Description</span>
                          <p className="text-sm text-gray-600 mt-0.5 line-clamp-3">{section.description}</p>
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(section.id);
                          setEditData({ ...section });
                        }}
                      >
                        Edit Section
                      </Button>
                    </>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
