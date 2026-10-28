import { Redis } from '@upstash/redis';
import type { Track } from './soundcloud';

export interface SyncStatus {
  lastSync: string | null;
  nextSync: string | null;
  status: 'healthy' | 'degraded' | 'failed';
  trackCount: number;
  error: string | null;
  syncedAt: string | null;
}

export interface CatalogData {
  tracks: Track[];
  meta: {
    userId: number;
    permalink: string;
    profileUrl: string;
    syncedAt: string;
    trackCount: number;
  };
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const CATALOG_KEY = 'partybae:catalog';
const SYNC_STATUS_KEY = 'partybae:sync-status';
const SYNC_LOCK_KEY = 'partybae:sync-lock';

export async function getCatalog(): Promise<CatalogData | null> {
  try {
    const data = await redis.get<CatalogData>(CATALOG_KEY);
    return data;
  } catch {
    return null;
  }
}

export async function setCatalog(data: CatalogData): Promise<void> {
  await redis.set(CATALOG_KEY, data);
}

export async function getSyncStatus(): Promise<SyncStatus> {
  try {
    const status = await redis.get<SyncStatus>(SYNC_STATUS_KEY);
    return status || {
      lastSync: null,
      nextSync: null,
      status: 'failed',
      trackCount: 0,
      error: 'No sync status available',
      syncedAt: null,
    };
  } catch {
    return {
      lastSync: null,
      nextSync: null,
      status: 'failed',
      trackCount: 0,
      error: 'Redis unavailable',
      syncedAt: null,
    };
  }
}

export async function setSyncStatus(status: SyncStatus): Promise<void> {
  await redis.set(SYNC_STATUS_KEY, status);
}

export async function acquireSyncLock(): Promise<boolean> {
  const result = await redis.set(SYNC_LOCK_KEY, '1', { nx: true, ex: 300 });
  return result === 'OK';
}

export async function releaseSyncLock(): Promise<void> {
  await redis.del(SYNC_LOCK_KEY);
}

export async function incrementSyncAttempts(): Promise<number> {
  return await redis.incr('partybae:sync-attempts');
}

export async function resetSyncAttempts(): Promise<void> {
  await redis.set('partybae:sync-attempts', 0);
}