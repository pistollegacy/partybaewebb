'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { Loader2, ExternalLink, ChevronUp, ChevronDown, Music, Heart, Share2, RotateCcw, Zap } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { TrackCard } from '@/components/track-card';
import { PlayerDock } from '@/components/player-dock';
import { Equalizer as EqualizerComp } from '@/components/ui/equalizer';
import { Marquee } from '@/components/marquee';
import { Magnetic } from '@/components/ui/magnetic';
import { GlitchText } from '@/components/ui/glitch-text';
import { trackEmbedUrl, profileEmbedUrl, type Track, type CatalogSource } from '@/lib/soundcloud';
import { SITE } from '@/data/site';
import { fmtDate, fmtDuration } from '@/lib/utils';
import { SyncStatus } from '@/components/sync-status';

type SortMode = 'latest' | 'oldest' | 'alpha';

interface MusicSectionProps {
  tracks: Track[];
  catalogSource: CatalogSource;
  catalogFetchedAt: string;
}

export function MusicSection({ tracks, catalogSource, catalogFetchedAt }: MusicSectionProps) {
  const [sort, setSort] = useState<SortMode>('latest');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [featuredAutoplay, setFeaturedAutoplay] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const featuredRef = useRef<HTMLDivElement>(null);
  const profileIframeRef = useRef<HTMLIFrameElement>(null);
  const reduced = useReducedMotion();

  const filteredAndSortedTracks = useMemo(() => {
    let arr = [...tracks];
    
    if (searchQuery) {
      arr = arr.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    switch (sort) {
      case 'latest':
        return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      case 'oldest':
        return arr.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
      case 'alpha':
        return arr.sort((a, b) => a.title.localeCompare(b.title));
    }
  }, [tracks, sort, searchQuery]);

  const featuredTrack = currentTrack ?? filteredAndSortedTracks[0];

  const handlePlay = useCallback((track: Track) => {
    setLoadingTrack(track.id);
    setCurrentTrack(track);
    setFeaturedAutoplay(true);
    setTimeout(() => {
      setLoadingTrack(null);
      featuredRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const resetFeatured = useCallback(() => {
    setCurrentTrack(null);
    setFeaturedAutoplay(false);
  }, []);

  useEffect(() => {
    if (currentTrack && featuredRef.current) {
      featuredRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentTrack]);

  const sourceLabel = catalogSource === 'live'
    ? `LIVE SYNC — FETCHED ${new Date(catalogFetchedAt).toLocaleString('en-US', { timeZone: 'UTC' })} UTC`
    : `VERIFIED SNAPSHOT — ${new Date(catalogFetchedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} — SET SC_CLIENT_ID FOR LIVE SYNC`;

  return (
    <section id="music" className="relative py-28 md:py-36" aria-labelledby="music-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <SectionHeading
            index="01"
            label="DISCOGRAPHY"
            title="THE SOUND OF PARTYBAE."
            id="music-heading"
            meta={`Every release. Every sound. Straight from SoundCloud.`}
          />
          <SyncStatus />
        </div>

        {/* Featured / Now Playing Panel */}
        <motion.div
          ref={featuredRef}
          className="relative mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
        >
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 md:gap-12 items-start">
            {/* Artwork Panel */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-white/10 bg-panel relative group" data-cursor-play>
                {featuredTrack.artwork ? (
                  <Image
                    src={featuredTrack.artwork}
                    alt={`${featuredTrack.title} artwork`}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-[1.02]"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pulse/20 via-bae/10 to-acid/20 flex items-center justify-center">
                    <span className="font-display font-bold text-5xl text-chrome/30">PARTYBAE</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute inset-0 scanlines" aria-hidden="true" />

                {/* HUD corners */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                  <div className="hud-corner hud-corner-tl top-0 left-0" />
                  <div className="hud-corner hud-corner-tr top-0 right-0" />
                  <div className="hud-corner hud-corner-bl bottom-0 left-0" />
                  <div className="hud-corner hud-corner-br bottom-0 right-0" />
                </div>

                {/* Meta overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                  <div className="font-mono text-[10px] text-acid tracking-[0.3em]">
                    {currentTrack ? 'NOW PLAYING' : 'LATEST TRANSMISSION'}
                  </div>
                  <div className="font-mono text-[10px] text-mist tracking-[0.2em]">
                    {fmtDate(featuredTrack.createdAt)} • {fmtDuration(featuredTrack.durationMs)}
                  </div>
                </div>
              </div>

              {/* Floating glow */}
              <motion.div
                className="absolute -inset-4 -z-10 rounded-3xl blur-3xl opacity-20"
                style={{
                  background: 'radial-gradient(circle, rgba(255,45,155,0.5) 0%, rgba(168,85,247,0.3) 50%, transparent 70%)',
                }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Info & Player Panel */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-acid tracking-[0.3em]">
                  {currentTrack ? 'NOW PLAYING' : 'LATEST RELEASE'}
                </span>
                {currentTrack && (
                  <motion.button
                    onClick={resetFeatured}
                    className="ml-auto p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-mist hover:text-acid transition-colors"
                    aria-label="Back to latest release"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <ChevronUp className="h-4 w-4 rotate-180" aria-hidden="true" />
                  </motion.button>
                )}
              </div>

              <GlitchText as="h3" className="font-display font-extrabold text-[clamp(1.8rem,5vw,3rem)] leading-tight text-chrome" intensity="subtle">
                {featuredTrack.title}
              </GlitchText>

              <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-mist tracking-[0.15em] border-t border-white/10 pt-4">
                <span>RELEASED: {fmtDate(featuredTrack.createdAt)}</span>
                <span className="w-px h-4 bg-white/10" aria-hidden="true" />
                <span>LENGTH: {fmtDuration(featuredTrack.durationMs)}</span>
                <span className="w-px h-4 bg-white/10" aria-hidden="true" />
                <span>SC TAG: {featuredTrack.genre ?? 'HIP-HOP & RAP'}</span>
              </div>

              {featuredTrack.description && (
                <p className="font-mono text-[11px] text-mist/80 leading-relaxed line-clamp-3 border-t border-white/10 pt-4">
                  {featuredTrack.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                <a
                  href={featuredTrack.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-chrome font-mono text-[10px] tracking-[0.15em] transition-colors"
                >
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  OPEN ON SOUNDCLOUD
                </a>
                <Magnetic>
                  <button className="px-4 py-2 bg-gradient-to-r from-pulse/20 via-bae/20 to-acid/20 border border-white/10 rounded-full text-chrome font-mono text-[10px] tracking-[0.15em] hover:border-bae/50 transition-colors" data-cursor-hover>
                    SHARE TRANSMISSION
                    <Share2 className="h-3 w-3 ml-1" aria-hidden="true" />
                  </button>
                </Magnetic>
              </div>

              {/* Embedded Player */}
              <div className="relative border border-white/10 rounded-xl overflow-hidden bg-black/40">
                <iframe
                  key={currentTrack ? `playing-${currentTrack.id}` : 'featured-latest'}
                  src={trackEmbedUrl(featuredTrack, { autoplay: featuredAutoplay, visual: false })}
                  title={`${featuredTrack.title} — SoundCloud player`}
                  allow="autoplay"
                  className="w-full aspect-[16/9] md:aspect-[21/9] min-h-[166px]"
                  loading="lazy"
                  onLoad={() => {
                    // Widget binding handled by PlayerDock via SC API
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Sort Toolbar */}
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <input
                type="search"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-full text-chrome font-mono text-[11px] tracking-[0.15em] placeholder:text-mist/50 focus:outline-none focus:border-acid/50 focus:bg-white/10 transition-all"
                aria-label="Search tracks"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-acid transition-colors"
                  aria-label="Clear search"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2" role="group" aria-label="Sort tracks">
              {(['latest', 'oldest', 'alpha'] as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSort(mode)}
                  className={clsx(
                    'relative px-4 py-2 font-mono text-[10px] tracking-[0.2em] rounded-full transition-all',
                    sort === mode
                      ? 'bg-acid/20 text-acid border border-acid/50'
                      : 'bg-white/5 text-mist hover:text-chrome hover:bg-white/10 border border-white/10'
                  )}
                  aria-pressed={sort === mode}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="font-mono text-[10px] text-mist tracking-[0.2em] hidden sm:block">
            {filteredAndSortedTracks.length} TRANSMISSIONS // SORTED BY {sort.toUpperCase()}
            {searchQuery && ` • FILTERED`}
          </div>
        </motion.div>

        {/* Track Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
        >
          {filteredAndSortedTracks.map((track, i) => (
            <motion.div
              key={track.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <TrackCard
                track={track}
                index={i + 1}
                isPlaying={currentTrack?.id === track.id}
                onPlay={handlePlay}
                onOpenSC={() => {}}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredAndSortedTracks.length === 0 && (
          <motion.div
            className="text-center py-12 text-mist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Zap className="h-12 w-12 mx-auto mb-4 text-acid/50" />
            <p className="font-mono text-[11px] tracking-[0.2em]">No tracks found matching "{searchQuery}"</p>
          </motion.div>
        )}

        {/* Profile Embed */}
        <motion.div
          className="mt-16 pt-12 border-t border-white/10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-mono text-[10px] text-acid tracking-[0.3em]">EXPLORE FULL PROFILE</span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-chrome mt-1">SOUNDCLOUD.COM/PARTYBAE</h3>
            </div>
            <a
              href={SITE.soundcloud.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pulse/20 via-bae/20 to-acid/20 border border-white/10 rounded-full text-chrome font-mono text-[10px] tracking-[0.15em] hover:border-bae/50 hover:from-pulse/40 hover:via-bae/40 hover:to-acid/40 transition-all"
            >
              OPEN PROFILE
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="relative border border-white/10 rounded-xl overflow-hidden bg-black/40">
            <iframe
              ref={profileIframeRef}
              src={profileEmbedUrl(false)}
              title="PARTYBAE SoundCloud profile — full catalog player"
              allow="autoplay"
              className="w-full h-[450px]"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Source Footnote */}
        <motion.p
          className="mt-10 text-center font-mono text-[10px] text-mist/60 tracking-[0.2em]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          CATALOG STATUS: {catalogSource === 'live' ? 'LIVE SYNC ACTIVE' : 'VERIFIED SNAPSHOT (OCT 28 2026) — LIVE SYNC READY VIA SC_CLIENT_ID'}
        </motion.p>
      </div>
    </section>
  );
}