import { getCatalog, getSyncStatus } from '@/lib/db';
import { getCatalog as getCatalogLib } from '@/lib/soundcloud';

export const runtime = 'edge';

export async function GET() {
  const catalog = await getCatalog();
  const syncStatus = await getSyncStatus();

  if (!catalog) {
    const fallback = await getCatalogLib();
    return Response.json({
      tracks: fallback.tracks,
      source: fallback.source,
      fetchedAt: fallback.fetchedAt,
      syncStatus: {
        ...syncStatus,
        status: 'degraded',
      },
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  }

  return Response.json({
    tracks: catalog.tracks,
    source: syncStatus.status === 'healthy' ? 'live' : 'snapshot',
    fetchedAt: catalog.meta.syncedAt,
    syncStatus,
  }, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  });
}