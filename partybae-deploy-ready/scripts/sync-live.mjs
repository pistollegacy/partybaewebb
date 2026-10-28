// scripts/sync-live.mjs
// Live sync script for production use - uses Upstash Redis for persistence
// Usage: UPSTASH_REDIS_REST_URL=xxx UPSTASH_REDIS_REST_TOKEN=xxx SC_CLIENT_ID=xxx node scripts/sync-live.mjs

import { Redis } from '@upstash/redis';

const USER_ID = process.env.SOUNDCLOUD_USER_ID ?? '643183869';
const PERMALINK = 'partybae';
const PAGE_LIMIT = 100;
const MAX_PAGES = 10;
const API_BASE = 'https://api-v2.soundcloud.com';
const CLIENT_ID = process.env.SC_CLIENT_ID;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const CATALOG_KEY = 'partybae:catalog';
const SYNC_STATUS_KEY = 'partybae:sync-status';
const SYNC_LOCK_KEY = 'partybae:sync-lock';

if (!CLIENT_ID) {
  console.error('✖ SC_CLIENT_ID not set. Set it to run live sync.');
  process.exit(1);
}

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.error('✖ Upstash Redis credentials not set. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
  process.exit(1);
}

function upgradeArtwork(url) {
  if (!url) return null;
  return url.replace(/-large\.(jpg|png)$/i, '-t500x500.$1').replace(/-t\d+x\d+\.(jpg|png)$/i, '-t500x500.$1');
}

async function fetchPage(url) {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchAllTracks() {
  const all = [];
  let nextUrl = `${API_BASE}/users/${USER_ID}/tracks?client_id=${CLIENT_ID}&limit=${PAGE_LIMIT}&offset=0`;
  let pages = 0;

  while (nextUrl && pages < MAX_PAGES) {
    console.log(`  Fetching page ${pages + 1}...`);
    const data = await fetchPage(nextUrl);
    const tracks = data.collection ?? [];
    console.log(`    Got ${tracks.length} tracks`);
    all.push(...tracks);
    nextUrl = data.next_href ? `${data.next_href}&client_id=${CLIENT_ID}` : null;
    pages++;
    if (!nextUrl) break;
    await new Promise(r => setTimeout(r, 200));
  }
  return all;
}

function mapTrack(t) {
  return {
    id: t.id,
    title: t.title,
    permalink: t.permalink,
    url: `https://soundcloud.com/${PERMALINK}/${t.permalink}`,
    createdAt: t.created_at,
    durationMs: t.duration ?? 0,
    artwork: upgradeArtwork(t.artwork_url ?? t.user?.avatar_url ?? null),
    genre: t.genre ?? null,
    description: (t.description ?? '').trim(),
  };
}

async function acquireLock() {
  const result = await redis.set(SYNC_LOCK_KEY, '1', { nx: true, ex: 300 });
  return result === 'OK';
}

async function releaseLock() {
  await redis.del(SYNC_LOCK_KEY);
}

async function getCurrentCatalog() {
  return await redis.get(CATALOG_KEY);
}

async function setCatalog(data) {
  await redis.set(CATALOG_KEY, data);
}

async function setSyncStatus(status) {
  await redis.set(SYNC_STATUS_KEY, status);
}

async function main() {
  console.log('🎵 Live syncing PARTYBAE SoundCloud catalog...');

  const lockAcquired = await acquireLock();
  if (!lockAcquired) {
    console.error('✖ Sync already in progress');
    process.exit(1);
  }

  try {
    const current = await getCurrentCatalog();
    const currentTracks = current?.tracks || [];

    const raw = await fetchAllTracks();
    const tracks = raw.map(mapTrack).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

    const seen = new Set();
    const uniq = tracks.filter(t => (seen.has(t.id) ? false : (seen.add(t.id), true)));

    console.log(`✅ Total unique tracks: ${uniq.length}`);

    const now = new Date().toISOString();
    const newCatalog = {
      tracks: uniq,
      meta: {
        userId: parseInt(USER_ID),
        permalink: PERMALINK,
        profileUrl: `https://soundcloud.com/${PERMALINK}`,
        syncedAt: now,
        trackCount: uniq.length,
      },
    };

    await setCatalog(newCatalog);

    const nextSync = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    await setSyncStatus({
      lastSync: now,
      nextSync,
      status: 'healthy',
      trackCount: uniq.length,
      error: null,
      syncedAt: now,
    });

    console.log(`📝 Catalog synced to Redis (${uniq.length} tracks)`);
  } catch (err) {
    console.error('✖ Sync failed:', err);
    const status = {
      lastSync: new Date().toISOString(),
      nextSync: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      status: 'failed',
      trackCount: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
      syncedAt: new Date().toISOString(),
    };
    await setSyncStatus(status);
    process.exit(1);
  } finally {
    await releaseLock();
  }
}

main().catch(err => {
  console.error('✖ Sync failed:', err);
  process.exit(1);
});