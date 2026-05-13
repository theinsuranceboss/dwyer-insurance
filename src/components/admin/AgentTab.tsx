'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Phone, Mail, MapPin, Globe, MessageSquare, UserCircle, Image as ImageIcon } from 'lucide-react';
import { type AgentInfoItem, apiFetch, LoadingSpinner } from './shared';

export default function AgentTab() {
  const { toast } = useToast();
  const [agentInfo, setAgentInfo] = useState<AgentInfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAgent = useCallback(async () => {
    try {
      const res = await apiFetch('/api/admin/agent');
      const data = await res.json();
      setAgentInfo(data.agentInfo || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load agent info', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchAgent(); }, [fetchAgent]);

  const updateValue = (key: string, value: string) => {
    setAgentInfo((prev) => prev.map((a) => (a.key === key ? { ...a, value } : a)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/api/admin/agent', {
        method: 'PUT',
        body: JSON.stringify({ items: agentInfo.map(({ key, value }) => ({ key, value })) }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Success', description: 'Agent info saved' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save agent info', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const getIcon = (key: string) => {
    if (key.toLowerCase().includes('phone')) return <Phone className="w-4 h-4" />;
    if (key.toLowerCase().includes('email')) return <Mail className="w-4 h-4" />;
    if (key.toLowerCase().includes('address') || key.toLowerCase().includes('state')) return <MapPin className="w-4 h-4" />;
    if (key.toLowerCase().includes('url') || key.toLowerCase().includes('photo')) return <ImageIcon className="w-4 h-4" />;
    if (key.toLowerCase().includes('language')) return <Globe className="w-4 h-4" />;
    if (key.toLowerCase().includes('tagline')) return <MessageSquare className="w-4 h-4" />;
    return <UserCircle className="w-4 h-4" />;
  };

  if (loading) return <LoadingSpinner />;

  const photoUrl = agentInfo.find((a) => a.key.toLowerCase().includes('photo'))?.value;

  return (
    <div className="space-y-6 max-w-4xl">
      {photoUrl && (
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={photoUrl} alt="Agent photo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-medium">Agent Photo Preview</p>
              <p className="text-xs text-gray-500">Update the photoUrl field below to change</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Agent Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {agentInfo.map((item) => (
            <div key={item.id} className="grid grid-cols-[180px_1fr] items-center gap-4">
              <Label className="text-sm text-gray-600 flex items-center gap-2">
                {getIcon(item.key)}
                {item.label || item.key}
              </Label>
              {item.type === 'image' ? (
                <div className="flex items-center gap-2">
                  <Input value={item.value} onChange={(e) => updateValue(item.key, e.target.value)} />
                  {item.value && (
                    <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.value} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                <Input
                  value={item.value}
                  onChange={(e) => updateValue(item.key, e.target.value)}
                  type={item.type === 'phone' ? 'tel' : item.type === 'email' ? 'email' : 'text'}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="bg-[#0033A0] hover:bg-[#001e60]">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Agent Info
      </Button>
    </div>
  );
}
