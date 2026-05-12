'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Plus, Trash2, Save, ChevronUp, ChevronDown, ChevronRight, X,
  Image as ImageIcon,
} from 'lucide-react';
import { type MenuItem, apiFetch, LoadingSpinner, DynamicMenuIcon, MENU_ICON_OPTIONS } from './shared';

export default function MenuTab() {
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
