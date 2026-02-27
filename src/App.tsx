import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DownloadList } from './components/DownloadList';
import { AIGenerator } from './components/AIGenerator';
import { AIEditor } from './components/AIEditor';
import { DownloadItem, View } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Link as LinkIcon, Loader2 } from 'lucide-react';

const MOCK_DOWNLOADS: DownloadItem[] = [
  {
    id: '1',
    name: 'ubuntu-22.04.3-desktop-amd64.iso',
    url: 'https://releases.ubuntu.com/22.04/ubuntu-22.04.3-desktop-amd64.iso',
    size: 4939212800,
    downloaded: 1240000000,
    status: 'downloading',
    category: 'other',
    addedAt: Date.now() - 3600000,
    speed: 12500000,
  },
  {
    id: '2',
    name: 'project-presentation.pdf',
    url: 'https://example.com/docs/presentation.pdf',
    size: 15400000,
    downloaded: 15400000,
    status: 'completed',
    category: 'document',
    addedAt: Date.now() - 86400000,
    speed: 0,
  },
  {
    id: '3',
    name: 'vacation-photos.zip',
    url: 'https://cloud.storage/s/vacation.zip',
    size: 850000000,
    downloaded: 425000000,
    status: 'paused',
    category: 'image',
    addedAt: Date.now() - 172800000,
    speed: 0,
  }
];

export default function App() {
  const [view, setView] = useState<View>('downloads');
  const [downloads, setDownloads] = useState<DownloadItem[]>(MOCK_DOWNLOADS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  // Simulate download progress
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads(prev => prev.map(item => {
        if (item.status === 'downloading') {
          const newDownloaded = Math.min(item.size, item.downloaded + item.speed);
          const newStatus = newDownloaded === item.size ? 'completed' : 'downloading';
          const newSpeed = newStatus === 'completed' ? 0 : Math.max(1000000, item.speed + (Math.random() - 0.5) * 500000);
          
          return {
            ...item,
            downloaded: newDownloaded,
            status: newStatus,
            speed: newSpeed
          };
        }
        return item;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAction = (id: string, action: 'resume' | 'pause' | 'cancel') => {
    setDownloads(prev => prev.map(item => {
      if (item.id === id) {
        if (action === 'resume') return { ...item, status: 'downloading', speed: 5000000 };
        if (action === 'pause') return { ...item, status: 'paused', speed: 0 };
        if (action === 'cancel') return null;
      }
      return item;
    }).filter(Boolean) as DownloadItem[]);
  };

  const handleAddDownload = () => {
    if (!newUrl.trim()) return;

    const id = Math.random().toString(36).substring(7);
    const name = newUrl.split('/').pop() || 'unknown-file';
    const category = name.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' :
                   name.match(/\.(mp4|mkv|avi)$/i) ? 'video' :
                   name.match(/\.(mp3|wav|flac)$/i) ? 'audio' :
                   name.match(/\.(pdf|doc|docx|txt)$/i) ? 'document' : 'other';

    const newItem: DownloadItem = {
      id,
      name,
      url: newUrl,
      size: 50000000 + Math.random() * 500000000, // Random size for demo
      downloaded: 0,
      status: 'downloading',
      category,
      addedAt: Date.now(),
      speed: 2000000 + Math.random() * 8000000,
    };

    setDownloads([newItem, ...downloads]);
    setNewUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-bg text-text-primary overflow-hidden">
      <Sidebar currentView={view} onViewChange={setView} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header items={downloads} onAddDownload={() => setIsAddModalOpen(true)} />
        
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {view === 'downloads' && (
                <DownloadList items={downloads} onAction={handleAction} />
              )}
              {view === 'generator' && <AIGenerator />}
              {view === 'editor' && <AIEditor />}
              {view === 'settings' && (
                <div className="p-8 flex items-center justify-center h-full text-text-secondary">
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-2">Settings</h3>
                    <p className="text-sm">Configuration options coming soon.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Add Download Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-accent" />
                  Add New Download
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-text-secondary hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">URL Address</label>
                  <input
                    autoFocus
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com/file.zip"
                    className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div className="bg-bg/50 p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <p>Nexus will automatically detect file type and optimize download segments.</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-bg/30 flex justify-end gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDownload}
                  disabled={!newUrl.trim()}
                  className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-accent/20"
                >
                  Start Download
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
