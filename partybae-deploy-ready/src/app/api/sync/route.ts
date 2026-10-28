import { performFullSync } from '@/lib/soundcloud';

export const runtime = 'edge';

export async function POST() {
  const result = await performFullSync();

  return Response.json(result, {
    status: result.success ? 200 : 500,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}