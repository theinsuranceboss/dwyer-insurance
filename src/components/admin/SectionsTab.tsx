'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import { 
  Loader2, Save, Eye, EyeOff, ChevronDown, ChevronRight, X, 
  GripVertical, Plus, Trash2, ArrowUp, ArrowDown 
} from 'lucide-react';
import { 
  type PageSection, apiFetch, LoadingSpinner, 
  SECTION_LABELS, SECTION_ICONS, ICON_OPTIONS, DeleteButton 
} from './shared';

// ─── Sortable Item Component ──────────────────────────────────────────────────

function SortableSection({ 
  section, 
  expandedId, 
  setExpandedId, 
  editingId, 
  setEditingId, 
  editData, 
  setEditData, 
  saving, 
  handleSave, 
  toggleVisibility,
  handleDelete
}: { 
  section: PageSection;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editData: Partial<PageSection>;
  setEditData: (data: Partial<PageSection>) => void;
  saving: string | null;
  handleSave: (id: string) => void;
  toggleVisibility: (section: PageSection, checked: boolean) => void;
  handleDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const icon = SECTION_ICONS[section.section] || '📄';
  const label = SECTION_LABELS[section.section] || section.section;
  const isExpanded = expandedId === section.id || editingId === section.id;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`transition-all border shadow-sm ${
        isDragging ? 'ring-2 ring-blue-500' : ''
      } ${!section.visible ? 'opacity-60 border-dashed bg-gray-50' : 'border-[#0033A0]/10'}`}
    >
      <CardHeader className="pb-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              {...attributes} 
              {...listeners} 
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : section.id)}
              className="flex items-center gap-2 group"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              )}
            </button>
            <span className="text-xl">{icon}</span>
            <div>
              <CardTitle className="text-base">{label}</CardTitle>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                {section.id.slice(-6)} | type: {section.section}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Visible</span>
              <Switch
                checked={section.visible}
                onCheckedChange={(checked) => toggleVisibility(section, checked)}
                disabled={saving === section.id}
              />
            </div>
            <DeleteButton onConfirm={() => handleDelete(section.id)} />
          </div>
        </div>
      </CardHeader>

      {(isExpanded || editingId === section.id) && (
        <CardContent className="space-y-4 px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <Separator className="mb-4" />
          {editingId === section.id ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-gray-500">Section Title</Label>
                  <Input
                    value={editData.title || ''}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="e.g. Our Services"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-gray-500">Section Subtitle</Label>
                  <Input
                    value={editData.subtitle || ''}
                    onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })}
                    placeholder="e.g. Comprehensive Coverage"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-gray-500">Section Description</Label>
                <Textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={3}
                  placeholder="The main text for this section..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                  <Save className="w-3 h-3" /> Advanced Configuration & Scaling
                </p>
                
                {(() => {
                  let cd: any = {}; 
                  try { 
                    const p = JSON.parse(editData.content || '{}'); 
                    cd = Array.isArray(p) ? { items: p } : p; 
                  } catch(e) { cd = {}; }
                  
                  const set = (key: string, val: any) => {
                    setEditData({ ...editData, content: JSON.stringify({ ...cd, [key]: val }) });
                  };

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Title Size (%)</Label>
                          <Input type="number" value={cd.titleSizePct ?? 100} onChange={e => set('titleSizePct', Number(e.target.value))} className="h-8 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Subtitle Size (%)</Label>
                          <Input type="number" value={cd.subtitleSizePct ?? 100} onChange={e => set('subtitleSizePct', Number(e.target.value))} className="h-8 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Description Size (%)</Label>
                          <Input type="number" value={cd.descSizePct ?? 100} onChange={e => set('descSizePct', Number(e.target.value))} className="h-8 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Items Scaling (%)</Label>
                          <Input type="number" value={cd.itemTitleSizePct ?? 100} onChange={e => set('itemTitleSizePct', Number(e.target.value))} className="h-8 text-xs" />
                        </div>
                      </div>

                      {section.section === 'hero' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="space-y-1.5"><Label className="text-xs">Overlay Color</Label><Input type="color" value={cd.overlayColor || '#001e60'} onChange={e => set('overlayColor', e.target.value)} className="h-8 p-1" /></div>
                          <div className="space-y-1.5"><Label className="text-xs">Overlay Opacity (0-100)</Label><Input type="number" value={cd.overlayOpacity ?? 70} min={0} max={100} onChange={e => set('overlayOpacity', Number(e.target.value))} className="h-8 text-xs" /></div>
                        </div>
                      )}

                      {section.section === 'about' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="space-y-1.5"><Label className="text-xs">Photo Banner Image URL</Label><Input value={cd.photoBannerImage || ''} onChange={e => set('photoBannerImage', e.target.value)} className="h-8 text-xs" placeholder="https://..." /></div>
                          <div className="space-y-1.5"><Label className="text-xs">CTA Button Text</Label><Input value={cd.ctaText || ''} onChange={e => set('ctaText', e.target.value)} className="h-8 text-xs" placeholder="Schedule a Consultation" /></div>
                        </div>
                      )}

                      {(section.section === 'whyChooseUs' || section.section === 'services' || section.section === 'aboutValues') && (
                        <div className="space-y-4 pt-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold text-gray-600">List Items</Label>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 text-[10px] text-blue-600"
                              onClick={() => {
                                const items = cd.items || [];
                                set('items', [...items, { icon: 'Shield', title: 'New Item', desc: 'Description text...' }]);
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" /> Add Item
                            </Button>
                          </div>
                          <div className="grid gap-2">
                            {(cd.items || []).map((item: any, idx: number) => (
                              <div key={idx} className="p-3 border rounded bg-white relative group">
                                <button 
                                  onClick={() => set('items', cd.items.filter((_: any, i: number) => i !== idx))}
                                  className="absolute top-2 right-2 text-red-300 hover:text-red-500"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <div className="space-y-1"><Label className="text-[10px]">Icon</Label><Input value={item.icon} onChange={e => { const n = [...cd.items]; n[idx].icon = e.target.value; set('items', n); }} className="h-7 text-xs" /></div>
                                  <div className="space-y-1"><Label className="text-[10px]">Title</Label><Input value={item.title} onChange={e => { const n = [...cd.items]; n[idx].title = e.target.value; set('items', n); }} className="h-7 text-xs" /></div>
                                </div>
                                <div className="space-y-1"><Label className="text-[10px]">Description</Label><Textarea value={item.desc} onChange={e => { const n = [...cd.items]; n[idx].desc = e.target.value; set('items', n); }} className="text-xs min-h-[40px] py-1" /></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleSave(section.id)}
                  disabled={saving === section.id}
                  className="bg-[#0033A0] hover:bg-[#001e60]"
                >
                  {saving === section.id ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                  Save Section
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Title</span>
                  <p className="text-sm font-semibold">{section.title || <span className="text-gray-300 italic">Untitled</span>}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtitle</span>
                  <p className="text-sm">{section.subtitle || <span className="text-gray-300 italic">—</span>}</p>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description Preview</span>
                <p className="text-xs text-gray-600 line-clamp-2 italic">{section.description || "No description provided."}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingId(section.id);
                  setEditData({ ...section });
                }}
              >
                Edit Content & Scaling
              </Button>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function SectionsTab() {
  const { toast } = useToast();
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PageSection>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const handleCreate = async (type: string) => {
    setAdding(true);
    try {
      const res = await apiFetch('/api/admin/sections', {
        method: 'POST',
        body: JSON.stringify({ 
          section: type, 
          title: SECTION_LABELS[type] || 'New Section',
          order: sections.length 
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'New section added' });
      fetchSections();
    } catch {
      toast({ title: 'Error', description: 'Failed to create section', variant: 'destructive' });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await apiFetch(`/api/admin/sections?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Section deleted' });
      fetchSections();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete section', variant: 'destructive' });
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);

      try {
        await Promise.all(
          newSections.map((s, idx) => 
            apiFetch('/api/admin/sections', {
              method: 'PUT',
              body: JSON.stringify({ id: s.id, order: idx }),
            })
          )
        );
        toast({ title: 'Order Saved', description: 'Section sequence updated' });
      } catch {
        toast({ title: 'Error', description: 'Failed to save order', variant: 'destructive' });
        fetchSections();
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0033A0]">Page Sections Manager</h2>
          <p className="text-sm text-gray-500">Drag items to reorder how they appear on the homepage.</p>
        </div>
        <Select onValueChange={handleCreate} disabled={adding}>
          <SelectTrigger className="w-[200px] bg-blue-600 text-white border-0 hover:bg-blue-700">
            <div className="flex items-center gap-2">
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Add New Section</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SECTION_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-3">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                editingId={editingId}
                setEditingId={setEditingId}
                editData={editData}
                setEditData={setEditData}
                saving={saving}
                handleSave={handleSave}
                toggleVisibility={toggleVisibility}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50">
          <p className="text-gray-400">No sections found. Add one above to get started.</p>
        </div>
      )}
    </div>
  );
}
