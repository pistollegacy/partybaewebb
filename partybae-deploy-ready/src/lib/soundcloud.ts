import { TRACKS, CATALOG_META, type Track } from '@/data/tracks';

export type { Track };
export type CatalogSource = 'live' | 'snapshot';

export interface CatalogResult {
  tracks: Track[];
  source: CatalogSource;
  fetchedAt: string;
}

export interface SyncResult {
  success: boolean;
  tracksAdded: number;
  tracksRemoved: number;
  tracksUpdated: number;
  error: string | null;
  syncedAt: string;
}

export const SC_PROFILE_URL = 'https://soundcloud.com/partybae';
export const SC_USER_ID = 643183869;
const API_BASE = 'https://api-v2.soundcloud.com';

export function trackEmbedUrl(track: Track, opts?: { visual?: boolean; autoplay?: boolean; color?: string }): string {
  const params = new URLSearchParams({
    url: track.url,
    color: opts?.color ?? '#ff2d9b',
    auto_play: String(opts?.autoplay ?? false),
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    visual: String(opts?.visual ?? false),
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

export function profileEmbedUrl(visual = false): string {
  const params = new URLSearchParams({
    url: `https://api.soundcloud.com/users/${SC_USER_ID}`,
    color: '#ff2d9b',
    auto_play: 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    visual: String(visual),
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

async function fetchLive(): Promise<Track[] | null> {
  const cid = process.env.SC_CLIENT_ID;
  if (!cid) return null;

  const all: Track[] = [];
  let nextUrl: string | null = `${API_BASE}/users/${SC_USER_ID}/tracks?client_id=${cid}&limit=100&offset=0`;
  let pages = 0;
  const MAX_PAGES = 5;

  while (nextUrl && pages < MAX_PAGES) {
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 6000);
      const res: Response = await fetch(nextUrl, {
        headers: { accept: 'application/json' },
        signal: ctrl.signal,
        next: { revalidate: 3600 },
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const data = await res.json();
      const tracks = data.collection ?? [];

      for (const t of tracks) {
        all.push({
          id: t.id,
          title: t.title,
          permalink: t.permalink,
          url: `https://soundcloud.com/partybae/${t.permalink}`,
          createdAt: t.created_at,
          durationMs: t.duration ?? 0,
          artwork: t.artwork_url
            ? t.artwork_url.replace(/-large\.(jpg|png)$/i, '-t500x500.$1').replace(/-t\d+x\d+\.(jpg|png)$/i, '-t500x500.$1')
            : t.user?.avatar_url
              ? t.user.avatar_url.replace(/-large\.(jpg|png)$/i, '-t500x500.$1')
              : null,
          genre: t.genre ?? null,
          description: (t.description ?? '').trim(),
        });
      }

      nextUrl = data.next_href ? `${data.next_href}&client_id=${cid}` : null;
      pages++;
      if (!nextUrl) break;
    } catch {
      return null;
    }
  }

  return all.length > 0 ? all : null;
}

export async function getCatalog(): Promise<CatalogResult> {
  const live = await fetchLive();
  if (live && live.length > 0) {
    return { tracks: live, source: 'live', fetchedAt: new Date().toISOString() };
  }
  return { tracks: TRACKS, source: 'snapshot', fetchedAt: CATALOG_META.verifiedAt };
}

// Server-only functions (not exported for client)
async function fetchAllTracksInternal(clientId: string): Promise<Track[]> {
  const all: Track[] = [];
  let nextUrl: string | null = `${API_BASE}/users/${SC_USER_ID}/tracks?client_id=${clientId}&limit=100&offset=0`;
  let pages = 0;
  const MAX_PAGES = 10;

  while (nextUrl && pages < MAX_PAGES) {
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 8000);
      const res: Response = await fetch(nextUrl, {
        headers: { accept: 'application/json' },
        signal: ctrl.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const data = await res.json();
      const tracks = data.collection ?? [];

      for (const t of tracks) {
        all.push({
          id: t.id,
          title: t.title,
          permalink: t.permalink,
          url: `https://soundcloud.com/partybae/${t.permalink}`,
          createdAt: t.created_at,
          durationMs: t.duration ?? 0,
          artwork: t.artwork_url
            ? t.artwork_url.replace(/-large\.(jpg|png)$/i, '-t500x500.$1').replace(/-t\d+x\d+\.(jpg|png)$/i, '-t500x500.$1')
            : t.user?.avatar_url
              ? t.user.avatar_url.replace(/-large\.(jpg|png)$/i, '-t500x500.$1')
              : null,
          genre: t.genre ?? null,
          description: (t.description ?? '').trim(),
        });
      }

      nextUrl = data.next_href ? `${data.next_href}&client_id=${clientId}` : null;
      pages++;
      if (!nextUrl) break;
      await new Promise(r => setTimeout(r, 100));
    } catch {
      throw new Error('Failed to fetch tracks from SoundCloud');
    }
  }

  return all;
}

function reconcileCatalogs(current: Track[], fresh: Track[]): {
  toAdd: Track[];
  toRemove: Track[];
  toUpdate: Track[];
} {
  const currentMap = new Map(current.map(t => [t.id, t]));
  const freshMap = new Map(fresh.map(t => [t.id, t]));

  const toAdd: Track[] = [];
  const toUpdate: Track[] = [];
  const toRemove: Track[] = [];

  for (const freshTrack of fresh) {
    const existing = currentMap.get(freshTrack.id);
    if (!existing) {
      toAdd.push(freshTrack);
    } else if (
      existing.title !== freshTrack.title ||
      existing.artwork !== freshTrack.artwork ||
      existing.description !== freshTrack.description ||
      existing.genre !== freshTrack.genre
    ) {
      toUpdate.push(freshTrack);
    }
  }

  for (const currentTrack of current) {
    if (!freshMap.has(currentTrack.id)) {
      toRemove.push(currentTrack);
    }
  }

  return { toAdd, toRemove, toUpdate };
}

export async function performFullSync(): Promise<SyncResult> {
  const clientId = process.env.SC_CLIENT_ID;
  if (!clientId) {
    return {
      success: false,
      tracksAdded: 0,
      tracksRemoved: 0,
      tracksUpdated: 0,
      error: 'SC_CLIENT_ID not configured',
      syncedAt: new Date().toISOString(),
    };
  }

  try {
    const currentCatalog = await import('@/lib/db').then(m => m.getCatalog());
    const currentTracks = currentCatalog?.tracks || [];

    const freshTracks = await fetchAllTracksInternal(clientId);
    if (freshTracks.length === 0) {
      throw new Error('No tracks returned from SoundCloud API');
    }

    const { toAdd, toRemove, toUpdate } = reconcileCatalogs(currentTracks, freshTracks);

    const newTracks = freshTracks.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

    const newCatalog = {
      tracks: newTracks,
      meta: {
        userId: SC_USER_ID,
        permalink: 'partybae',
        profileUrl: SC_PROFILE_URL,
        syncedAt: new Date().toISOString(),
        trackCount: newTracks.length,
      },
    };

    await import('@/lib/db').then(m => m.setCatalog(newCatalog));

    const nextSync = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    await import('@/lib/db').then(m => m.setSyncStatus({
      lastSync: new Date().toISOString(),
      nextSync,
      status: 'healthy',
      trackCount: newTracks.length,
      error: null,
      syncedAt: new Date().toISOString(),
    }));

    await import('@/lib/db').then(m => m.resetSyncAttempts());

    return {
      success: true,
      tracksAdded: toAdd.length,
      tracksRemoved: toRemove.length,
      tracksUpdated: toUpdate.length,
      error: null,
      syncedAt: new Date().toISOString(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Sync failed:', error);

    const currentStatus = await import('@/lib/db').then(m => m.getSyncStatus());
    const attempts = (currentStatus as any).attempts + 1 || 1;
    const status = attempts >= 3 ? 'failed' : 'degraded';

    await import('@/lib/db').then(m => m.setSyncStatus({
      lastSync: currentStatus.lastSync,
      nextSync: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      status,
      trackCount: currentStatus.trackCount,
      error: errorMessage,
      syncedAt: currentStatus.syncedAt,
    }));

    return {
      success: false,
      tracksAdded: 0,
      tracksRemoved: 0,
      tracksUpdated: 0,
      error: errorMessage,
      syncedAt: new Date().toISOString(),
    };
  }
}