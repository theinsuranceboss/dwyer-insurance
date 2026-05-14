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
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="space-y-2 sm:col-span-1">
                          <Label className="text-sm font-medium">Title</Label>
                          <Input
                            value={editData.title || ''}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            placeholder="Section title..."
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-1">
                          <Label className="text-sm font-medium">Subtitle</Label>
                          <Input
                            value={editData.subtitle || ''}
                            onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })}
                            placeholder="Section subtitle..."
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-1">
                          <Label className="text-sm font-medium">Icon</Label>
                          <Select 
                            value={editData.content && !Array.isArray(JSON.parse(editData.content)) ? (JSON.parse(editData.content).sectionIcon || 'FileText') : 'FileText'} 
                            onValueChange={(v) => {
                              const content = editData.content && !Array.isArray(JSON.parse(editData.content)) ? JSON.parse(editData.content) : {};
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
                        <div className="space-y-2 sm:col-span-1">
                          <Label className="text-sm font-medium">Title Size (px)</Label>
                          <Input
                            type="number"
                            value={editData.content && !Array.isArray(JSON.parse(editData.content)) ? (JSON.parse(editData.content).titleSize || '') : ''}
                            onChange={(e) => {
                              const content = editData.content && !Array.isArray(JSON.parse(editData.content)) ? JSON.parse(editData.content) : {};
                              setEditData({ ...editData, content: JSON.stringify({ ...content, titleSize: parseInt(e.target.value) || '' }) });
                            }}
                            placeholder="e.g. 48"
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-1">
                          <Label className="text-sm font-medium">Subtitle Size (px)</Label>
                          <Input
                            type="number"
                            value={editData.content && !Array.isArray(JSON.parse(editData.content)) ? (JSON.parse(editData.content).subtitleSize || '') : ''}
                            onChange={(e) => {
                              const content = editData.content && !Array.isArray(JSON.parse(editData.content)) ? JSON.parse(editData.content) : {};
                              setEditData({ ...editData, content: JSON.stringify({ ...content, subtitleSize: parseInt(e.target.value) || '' }) });
                            }}
                            placeholder="e.g. 14"
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-1">
                          <Label className="text-sm font-medium">Desc Size (px)</Label>
                          <Input
                            type="number"
                            value={editData.content && !Array.isArray(JSON.parse(editData.content)) ? (JSON.parse(editData.content).descriptionSize || '') : ''}
                            onChange={(e) => {
                              const content = editData.content && !Array.isArray(JSON.parse(editData.content)) ? JSON.parse(editData.content) : {};
                              setEditData({ ...editData, content: JSON.stringify({ ...content, descriptionSize: parseInt(e.target.value) || '' }) });
                            }}
                            placeholder="e.g. 18"
                          />
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
 
                       {section.section === 'ctaBanner' && (
                         <div className="grid grid-cols-1 gap-4 border-t pt-4 mt-2">
                           <div className="space-y-2">
                             <Label className="text-sm font-medium">CTA Title (Overwrites Default)</Label>
                             <Input 
                               value={editData.content && !Array.isArray(JSON.parse(editData.content)) ? (JSON.parse(editData.content).ctaTitle || '') : ''} 
                               onChange={(e) => {
                                 const current = editData.content ? JSON.parse(editData.content) : {};
                                 setEditData({ ...editData, content: JSON.stringify({ ...current, ctaTitle: e.target.value }) });
                               }}
                               placeholder="Ready to Get Protected?"
                             />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-sm font-medium">CTA Description (Overwrites Default)</Label>
                             <Textarea 
                               value={editData.content && !Array.isArray(JSON.parse(editData.content)) ? (JSON.parse(editData.content).ctaDescription || '') : ''} 
                               onChange={(e) => {
                                 const current = editData.content ? JSON.parse(editData.content) : {};
                                 setEditData({ ...editData, content: JSON.stringify({ ...current, ctaDescription: e.target.value }) });
                               }}
                               rows={3}
                               placeholder="Get a personalized quote today. Bundle and save up to 25% on your premiums!"
                             />
                           </div>
                         </div>
                       )}

                        {(section.section === 'whyChooseUs' || section.section === 'services') && (
                         <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t pt-4 mt-2">
                           <div className="space-y-2">
                             <Label className="text-xs font-bold">Item Icon Size (px)</Label>
                             <Input 
                               type="number"
                               value={editData.content && !Array.isArray(JSON.parse(editData.content)) ? (JSON.parse(editData.content).itemIconSize || '') : ''} 
                               onChange={(e) => {
                                 const current = editData.content && !Array.isArray(JSON.parse(editData.content)) ? JSON.parse(editData.content) : { items: JSON.parse(editData.content || '[]') };
                                 setEditData({ ...editData, content: JSON.stringify({ ...current, itemIconSize: parseInt(e.target.value) || '' }) });
                               }}
                               placeholder="Default: 32"
                             />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs font-bold">Item Title Size (px)</Label>
                             <Input 
                               type="number"
                               value={editData.content && !Array.isArray(JSON.parse(editData.content)) ? (JSON.parse(editData.content).itemTitleSize || '') : ''} 
                               onChange={(e) => {
                                 const current = editData.content && !Array.isArray(JSON.parse(editData.content)) ? JSON.parse(editData.content) : { items: JSON.parse(editData.content || '[]') };
                                 setEditData({ ...editData, content: JSON.stringify({ ...current, itemTitleSize: parseInt(e.target.value) || '' }) });
                               }}
                               placeholder="Default: 13"
                             />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs font-bold">Item Desc Size (px)</Label>
                             <Input 
                               type="number"
                               value={editData.content && !Array.isArray(JSON.parse(editData.content)) ? (JSON.parse(editData.content).itemDescSize || '') : ''} 
                               onChange={(e) => {
                                 const current = editData.content && !Array.isArray(JSON.parse(editData.content)) ? JSON.parse(editData.content) : { items: JSON.parse(editData.content || '[]') };
                                 setEditData({ ...editData, content: JSON.stringify({ ...current, itemDescSize: parseInt(e.target.value) || '' }) });
                               }}
                               placeholder="Default: 12"
                             />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs font-bold">Item Subtitle Size (px)</Label>
                             <Input 
                               type="number"
                               value={editData.content && !Array.isArray(JSON.parse(editData.content)) ? (JSON.parse(editData.content).itemSubtitleSize || '') : ''} 
                               onChange={(e) => {
                                 const current = editData.content && !Array.isArray(JSON.parse(editData.content)) ? JSON.parse(editData.content) : { items: JSON.parse(editData.content || '[]') };
                                 setEditData({ ...editData, content: JSON.stringify({ ...current, itemSubtitleSize: parseInt(e.target.value) || '' }) });
                               }}
                               placeholder="Default: 14"
                             />
                           </div>
                         </div>
                       )}

                      {(section.section === 'whyChooseUs' || section.section === 'about') && (
                        <div className="space-y-4 border-t pt-4 mt-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-bold">
                              {section.section === 'whyChooseUs' ? 'Reasons List (JSON Content)' : 'Features List (JSON Content)'}
                            </Label>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                const isArray = editData.content && Array.isArray(JSON.parse(editData.content));
                                const currentData = editData.content ? JSON.parse(editData.content) : (section.section === 'whyChooseUs' ? [] : { items: [] });
                                
                                if (section.section === 'whyChooseUs' && isArray) {
                                  const newItems = [...currentData, { icon: 'Shield', title: 'New Reason', desc: 'Description here' }];
                                  setEditData({ ...editData, content: JSON.stringify(newItems) });
                                } else {
                                  const items = currentData.items || [];
                                  const newItems = [...items, { icon: 'ShieldCheck', title: 'New Feature', desc: 'Description here' }];
                                  setEditData({ ...editData, content: JSON.stringify({ ...currentData, items: newItems }) });
                                }
                              }}
                            >
                              Add Item
                            </Button>
                          </div>
                          <div className="grid gap-4">
                            {(() => {
                              try {
                                const content = editData.content ? JSON.parse(editData.content) : (section.section === 'whyChooseUs' ? [] : { items: [] });
                                const items = Array.isArray(content) ? content : (content.items || []);
                                
                                return items.map((item: any, idx: number) => (
                                  <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-3 relative group">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => {
                                        const newItems = items.filter((_: any, i: number) => i !== idx);
                                        if (Array.isArray(content)) {
                                          setEditData({ ...editData, content: JSON.stringify(newItems) });
                                        } else {
                                          setEditData({ ...editData, content: JSON.stringify({ ...content, items: newItems }) });
                                        }
                                      }}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                      <div className="space-y-1">
                                        <Label className="text-xs">Icon Name</Label>
                                        <Input 
                                          value={item.icon} 
                                          className="h-8 text-xs" 
                                          onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[idx] = { ...item, icon: e.target.value };
                                            if (Array.isArray(content)) {
                                              setEditData({ ...editData, content: JSON.stringify(newItems) });
                                            } else {
                                              setEditData({ ...editData, content: JSON.stringify({ ...content, items: newItems }) });
                                            }
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
                                            if (Array.isArray(content)) {
                                              setEditData({ ...editData, content: JSON.stringify(newItems) });
                                            } else {
                                              setEditData({ ...editData, content: JSON.stringify({ ...content, items: newItems }) });
                                            }
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-gray-400">Override Title Size</Label>
                                        <Input 
                                          type="number"
                                          value={item.titleSize || ''} 
                                          className="h-7 text-xs bg-white" 
                                          placeholder={!Array.isArray(content) ? (content.itemTitleSize || 'Global') : 'Global'}
                                          onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[idx] = { ...item, titleSize: parseInt(e.target.value) || '' };
                                            if (Array.isArray(content)) {
                                              setEditData({ ...editData, content: JSON.stringify(newItems) });
                                            } else {
                                              setEditData({ ...editData, content: JSON.stringify({ ...content, items: newItems }) });
                                            }
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-gray-400">Override Desc Size</Label>
                                        <Input 
                                          type="number"
                                          value={item.descSize || ''} 
                                          className="h-7 text-xs bg-white" 
                                          placeholder={!Array.isArray(content) ? (content.itemDescSize || 'Global') : 'Global'}
                                          onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[idx] = { ...item, descSize: parseInt(e.target.value) || '' };
                                            if (Array.isArray(content)) {
                                              setEditData({ ...editData, content: JSON.stringify(newItems) });
                                            } else {
                                              setEditData({ ...editData, content: JSON.stringify({ ...content, items: newItems }) });
                                            }
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
                                          if (Array.isArray(content)) {
                                            setEditData({ ...editData, content: JSON.stringify(newItems) });
                                          } else {
                                            setEditData({ ...editData, content: JSON.stringify({ ...content, items: newItems }) });
                                          }
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
