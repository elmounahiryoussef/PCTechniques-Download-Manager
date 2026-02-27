import React from 'react';
import { FileText, Image as ImageIcon, Video, Music, File, MoreVertical, Play, Pause, X } from 'lucide-react';
import { DownloadItem } from '@/src/types';
import { formatBytes } from '@/src/lib/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface DownloadListProps {
  items: DownloadItem[];
  onAction: (id: string, action: 'resume' | 'pause' | 'cancel') => void;
}

const CategoryIcon = ({ category }: { category: DownloadItem['category'] }) => {
  switch (category) {
    case 'document': return <FileText className="w-4 h-4 text-blue-400" />;
    case 'image': return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    case 'video': return <Video className="w-4 h-4 text-purple-400" />;
    case 'audio': return <Music className="w-4 h-4 text-pink-400" />;
    default: return <File className="w-4 h-4 text-gray-400" />;
  }
};

export const DownloadList: React.FC<DownloadListProps> = ({ items, onAction }) => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="data-grid data-grid-header sticky top-0 bg-bg z-10">
        <div className="px-4">Type</div>
        <div>Name</div>
        <div>Size</div>
        <div>Status</div>
        <div>Added</div>
        <div className="text-right px-4">Actions</div>
      </div>

      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="data-grid data-grid-row border-b border-border/50 group"
          >
            <div className="px-4 flex justify-center">
              <CategoryIcon category={item.category} />
            </div>
            <div className="truncate pr-4">
              <div className="text-sm font-medium truncate">{item.name}</div>
              <div className="text-[10px] text-text-secondary font-mono truncate">{item.url}</div>
            </div>
            <div className="text-xs font-mono text-text-secondary">
              {formatBytes(item.size)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  item.status === 'downloading' ? 'bg-accent animate-pulse' :
                  item.status === 'completed' ? 'bg-emerald-500' :
                  item.status === 'paused' ? 'bg-amber-500' : 'bg-text-secondary'
                }`} />
                <span className="text-xs capitalize">{item.status}</span>
              </div>
              {item.status === 'downloading' && (
                <div className="mt-1.5 w-24">
                  <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-accent h-full transition-all duration-300" 
                      style={{ width: `${(item.downloaded / item.size) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-text-secondary font-mono">
                      {Math.round((item.downloaded / item.size) * 100)}%
                    </span>
                    <span className="text-[9px] text-text-secondary font-mono">
                      {formatBytes(item.speed)}/s
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-xs text-text-secondary">
              {format(item.addedAt, 'MMM d, HH:mm')}
            </div>
            <div className="flex justify-end gap-1 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.status === 'paused' && (
                <button onClick={() => onAction(item.id, 'resume')} className="p-1.5 hover:bg-surface rounded-md text-emerald-400">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
              {item.status === 'downloading' && (
                <button onClick={() => onAction(item.id, 'pause')} className="p-1.5 hover:bg-surface rounded-md text-amber-400">
                  <Pause className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
              <button onClick={() => onAction(item.id, 'cancel')} className="p-1.5 hover:bg-surface rounded-md text-red-400">
                <X className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-surface rounded-md text-text-secondary">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-text-secondary">
          <DownloadItemIcon className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm">No downloads in queue</p>
        </div>
      )}
    </div>
  );
};

const DownloadItemIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
