import { performFullSync } from '@/lib/soundcloud';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const signature = request.headers.get('x-soundcloud-signature');
  const webhookSecret = process.env.SOUNDCLOUD_WEBHOOK_SECRET;

  if (webhookSecret && signature) {
    const body = await request.text();
    const crypto = await import('crypto');
    const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
    
    if (signature !== expectedSignature) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  const result = await performFullSync();

  return Response.json({
    success: result.success,
    message: result.success ? 'Sync triggered successfully' : result.error,
    syncedAt: result.syncedAt,
  }, {
    status: result.success ? 200 : 500,
  });
}