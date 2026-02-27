export interface DownloadItem {
  id: string;
  name: string;
  url: string;
  size: number; // in bytes
  downloaded: number; // in bytes
  status: 'queued' | 'downloading' | 'paused' | 'completed' | 'error';
  category: 'document' | 'image' | 'video' | 'audio' | 'other';
  addedAt: number;
  speed: number; // bytes per second
}

export type View = 'downloads' | 'generator' | 'editor' | 'settings';

export interface AIImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  type: 'generated' | 'edited';
}
