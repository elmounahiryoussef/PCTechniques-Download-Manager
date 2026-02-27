import React from 'react';
import { Plus, Search, Activity, Globe, Zap } from 'lucide-react';
import { DownloadItem } from '@/src/types';
import { formatBytes } from '@/src/lib/utils';

interface HeaderProps {
  items: DownloadItem[];
  onAddDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ items, onAddDownload }) => {
  const activeDownloads = items.filter(i => i.status === 'downloading');
  const totalSpeed = activeDownloads.reduce((acc, curr) => acc + curr.speed, 0);
  const completedCount = items.filter(i => i.status === 'completed').length;

  return (
    <header className="h-20 border-b border-border bg-surface flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-8">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search downloads..."
            className="bg-bg border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent w-64"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-tighter leading-none">Global Speed</span>
              <span className="text-xs font-mono font-medium">{formatBytes(totalSpeed)}/s</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-tighter leading-none">Completed</span>
              <span className="text-xs font-mono font-medium">{completedCount} files</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-tighter leading-none">Active</span>
              <span className="text-xs font-mono font-medium">{activeDownloads.length} tasks</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onAddDownload}
        className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-accent/20"
      >
        <Plus className="w-4 h-4" />
        Add URL
      </button>
    </header>
  );
};
