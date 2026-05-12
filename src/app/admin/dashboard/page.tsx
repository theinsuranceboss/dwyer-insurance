'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Loader2, LogOut, GripVertical } from 'lucide-react';
import type { TabId } from '@/components/admin/shared';

// Lazy-load each tab component to reduce initial bundle size
const SettingsTab = dynamic(() => import('@/components/admin/SettingsTab'), { ssr: false });
const BrandingTab = dynamic(() => import('@/components/admin/BrandingTab'), { ssr: false });
const AppearanceTab = dynamic(() => import('@/components/admin/AppearanceTab'), { ssr: false });
const MenuTab = dynamic(() => import('@/components/admin/MenuTab'), { ssr: false });
const InsuranceTab = dynamic(() => import('@/components/admin/InsuranceTab'), { ssr: false });
const SectionsTab = dynamic(() => import('@/components/admin/SectionsTab'), { ssr: false });
const AgentTab = dynamic(() => import('@/components/admin/AgentTab'), { ssr: false });
const TestimonialsTab = dynamic(() => import('@/components/admin/TestimonialsTab'), { ssr: false });
const FaqsTab = dynamic(() => import('@/components/admin/FaqsTab'), { ssr: false });

// Tab definitions — icons imported inline to keep this file small
import {
  Settings,
  Menu,
  Shield,
  LayoutTemplate,
  UserCircle,
  Star,
  HelpCircle,
  Image as ImageIcon,
  Palette,
} from 'lucide-react';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'settings', label: 'Site Settings', icon: <Settings className="w-4 h-4" /> },
  { id: 'branding', label: 'Logo & Branding', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'appearance', label: 'Page Appearance', icon: <Palette className="w-4 h-4" /> },
  { id: 'menu', label: 'Menu Items', icon: <Menu className="w-4 h-4" /> },
  { id: 'insurance', label: 'Insurance Pages', icon: <Shield className="w-4 h-4" /> },
  { id: 'sections', label: 'Page Sections', icon: <LayoutTemplate className="w-4 h-4" /> },
  { id: 'agent', label: 'Agent Info', icon: <UserCircle className="w-4 h-4" /> },
  { id: 'testimonials', label: 'Testimonials', icon: <Star className="w-4 h-4" /> },
  { id: 'faqs', label: 'FAQs', icon: <HelpCircle className="w-4 h-4" /> },
];

const TAB_COMPONENTS: Record<TabId, React.ReactNode> = {
  settings: <SettingsTab />,
  branding: <BrandingTab />,
  appearance: <AppearanceTab />,
  menu: <MenuTab />,
  insurance: <InsuranceTab />,
  sections: <SectionsTab />,
  agent: <AgentTab />,
  testimonials: <TestimonialsTab />,
  faqs: <FaqsTab />,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('settings');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('admin_token');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#0033A0]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-[#001e60] text-white flex flex-col transition-all duration-300 flex-shrink-0`}
      >
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img src="/logo.png" alt="Dwyer Insurance Group" className="w-full h-full object-cover" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm leading-tight">Admin Panel</h1>
              <p className="text-[10px] text-blue-200 truncate">Dwyer Insurance Group CMS</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-2 overflow-y-auto max-h-[calc(100vh-140px)]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-blue-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.icon}
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-blue-200 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <GripVertical className="w-4 h-4" />
            {sidebarOpen && <span>Toggle Sidebar</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#001e60]">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-sm text-gray-500">Manage your website content</p>
          </div>
          <a
            href="/"
            target="_blank"
            className="text-sm text-[#0033A0] hover:underline"
          >
            View Site &rarr;
          </a>
        </header>

        <div className="p-6">
          {TAB_COMPONENTS[activeTab]}
        </div>
      </main>
    </div>
  );
}
