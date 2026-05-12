'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Star } from 'lucide-react';
import { type Testimonial, apiFetch, LoadingSpinner, DeleteButton } from './shared';

export default function TestimonialsTab() {
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
