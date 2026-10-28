'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { Wifi, WifiOff, AlertCircle, RotateCcw } from 'lucide-react';

interface SyncStatusData {
  lastSync: string | null;
  nextSync: string | null;
  status: 'healthy' | 'degraded' | 'failed';
  trackCount: number;
  error: string | null;
  syncedAt: string | null;
}

export function SyncStatus() {
  const [status, setStatus] = useState<SyncStatusData>({
    lastSync: null,
    nextSync: null,
    status: 'healthy',
    trackCount: 0,
    error: null,
    syncedAt: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/catalog');
      if (res.ok) {
        const data = await res.json();
        setStatus(data.syncStatus || data);
      }
    } catch {
      // Silently fail
    }
  };

  const triggerSync = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/sync', { method: 'POST' });
      await fetchStatus();
    } catch {
      // Silently fail
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    healthy: 'text-acid border-acid/50 bg-acid/10',
    degraded: 'text-bae border-bae/50 bg-bae/10',
    failed: 'text-red-400 border-red-400/50 bg-red-400/10',
  };

  const statusIcons = {
    healthy: <Wifi className="h-4 w-4" />,
    degraded: <WifiOff className="h-4 w-4" />,
    failed: <AlertCircle className="h-4 w-4" />,
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  };

  return (
    <motion.div
      className={clsx(
        'flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300',
        statusColors[status.status]
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      {statusIcons[status.status]}
      <span className="font-mono text-[10px] tracking-[0.15em] whitespace-nowrap">
        {status.status === 'healthy' && '● SOUNDCLOUD SYNC ACTIVE'}
        {status.status === 'degraded' && '◐ SYNC DEGRADED'}
        {status.status === 'failed' && '✕ SYNC FAILED'}
      </span>
      <span className="w-px h-4 bg-current/30 mx-2" aria-hidden="true" />
      <span className="font-mono text-[10px] text-mist/70 tracking-[0.15em] whitespace-nowrap">
        {status.trackCount} TRACKS
      </span>
      <span className="w-px h-4 bg-current/30 mx-2" aria-hidden="true" />
      <span className="font-mono text-[10px] text-mist/70 tracking-[0.15em] whitespace-nowrap">
        LAST: {formatTime(status.lastSync)}
      </span>
      <span className="w-px h-4 bg-current/30 mx-2" aria-hidden="true" />
      <span className="font-mono text-[10px] text-mist/70 tracking-[0.15em] whitespace-nowrap">
        NEXT: {formatTime(status.nextSync)}
      </span>
      {status.error && (
        <>
          <span className="w-px h-4 bg-current/30 mx-2" aria-hidden="true" />
          <span className="font-mono text-[10px] text-current/70 tracking-[0.15em] whitespace-nowrap truncate max-w-[200px]">
            {status.error}
          </span>
        </>
      )}
      <button
        onClick={triggerSync}
        disabled={refreshing}
        className="ml-2 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-current transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Trigger manual sync"
      >
        <RotateCcw className={clsx('h-4 w-4', refreshing && 'animate-spin')} aria-hidden="true" />
      </button>
    </motion.div>
  );
}