'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { Nav } from '@/components/nav';
import { Hero } from '@/components/hero';
import { Marquee } from '@/components/marquee';
import { MusicSection } from '@/components/music';
import { About } from '@/components/about';
import { PlayStation } from '@/components/playstation';
import { Connect } from '@/components/connect';
import { Footer } from '@/components/footer';
import { BackgroundFX } from '@/components/background-fx';
import { Preloader, BootProvider } from '@/components/preloader';
import { CustomCursor } from '@/components/cursor';
import { PlayerDock } from '@/components/player-dock';
import { FloatingMusicController } from '@/components/floating-music-controller';
import { trackEmbedUrl, profileEmbedUrl } from '@/lib/soundcloud';
import type { Track } from '@/lib/soundcloud';

interface SiteShellProps {
  tracks: Track[];
  catalogSource: 'live' | 'snapshot';
  catalogFetchedAt: string;
}

export function SiteShell({ tracks, catalogSource, catalogFetchedAt }: SiteShellProps) {
  useEffect(() => {
    const handleHashChange = () => {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <BootProvider>
      <BackgroundFX />
      <CustomCursor />
      <Preloader />
      <Script
        src="https://w.soundcloud.com/player/api.js"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      <Nav />
      <main id="main-content">
        <Hero />
        <Marquee />
        <MusicSection
          tracks={tracks}
          catalogSource={catalogSource}
          catalogFetchedAt={catalogFetchedAt}
        />
        <About />
        <PlayStation />
        <Connect />
      </main>
      <Footer />
      <PlayerDock />
      <FloatingMusicController />
    </BootProvider>
  );
}