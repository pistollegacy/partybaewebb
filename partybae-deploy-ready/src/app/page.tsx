import { getCatalog } from '@/lib/soundcloud';
import { SiteShell } from '@/components/site-shell';

export const revalidate = 3600;

export default async function Page() {
  const { tracks, source, fetchedAt } = await getCatalog();

  return <SiteShell tracks={tracks} catalogSource={source} catalogFetchedAt={fetchedAt} />;
}