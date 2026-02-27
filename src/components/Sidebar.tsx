import React from 'react';
import { Download, Image as ImageIcon, Wand2, Settings, Shield } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { View } from '@/src/types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'generator', label: 'AI Generator', icon: ImageIcon },
    { id: 'editor', label: 'AI Editor', icon: Wand2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-bold text-lg tracking-tight">NEXUS</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
              currentView === item.id
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-bg/50 rounded-lg p-3">
          <div className="flex justify-between text-[10px] text-text-secondary uppercase font-bold mb-2">
            <span>Storage</span>
            <span>72%</span>
          </div>
          <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
            <div className="bg-accent h-full w-[72%]" />
          </div>
        </div>
      </div>
    </aside>
  );
};
