'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save } from 'lucide-react';
import { type FaqItem, apiFetch, LoadingSpinner, DeleteButton } from './shared';

export default function FaqsTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<FaqItem>>({});
  const [newItem, setNewItem] = useState({ question: '', answer: '', order: 0, visible: true });

  const fetchItems = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/faqs');
      const data = await res.json();
      setItems(data.faqs || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load FAQs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleAdd = async () => {
    try {
      const res = await apiFetch('/api/admin/faqs', {
        method: 'POST',
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'FAQ created' });
      setShowAdd(false);
      setNewItem({ question: '', answer: '', order: 0, visible: true });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to create FAQ', variant: 'destructive' });
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const res = await apiFetch('/api/admin/faqs', {
        method: 'PUT',
        body: JSON.stringify({ id: editingId, ...editData }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'FAQ updated' });
      setEditingId(null);
      setEditData({});
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to update FAQ', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await apiFetch('/api/admin/faqs', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'FAQ deleted' });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete FAQ', variant: 'destructive' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{items.length} FAQs</p>
        <Button onClick={() => setShowAdd(true)} className="bg-[#0033A0] hover:bg-[#001e60]">
          <Plus className="w-4 h-4 mr-2" /> Add FAQ
        </Button>
      </div>

      {showAdd && (
        <Card className="border-[#0033A0]/20">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-[#001e60]">New FAQ</h3>
            <div className="space-y-2">
              <Label>Question</Label>
              <Input value={newItem.question} onChange={(e) => setNewItem({ ...newItem, question: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea value={newItem.answer} onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })} rows={3} />
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
                <h3 className="font-semibold text-[#001e60]">Edit FAQ</h3>
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Input value={editData.question || ''} onChange={(e) => setEditData({ ...editData, question: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Answer</Label>
                  <Textarea value={editData.answer || ''} onChange={(e) => setEditData({ ...editData, answer: e.target.value })} rows={3} />
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
                      <span className="font-semibold text-sm">{item.question}</span>
                      {!item.visible && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.answer}</p>
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
