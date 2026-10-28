'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { clsx } from 'clsx';
import { Play, ExternalLink, Loader2 } from 'lucide-react';
import { Track } from '@/lib/soundcloud';
import { fmtDuration } from '@/lib/utils';

interface TrackCardProps {
  track: Track;
  index: number;
  isPlaying?: boolean;
  onPlay: (track: Track) => void;
  onOpenSC: (track: Track) => void;
}

export function TrackCard({ track, index, isPlaying, onPlay, onOpenSC }: TrackCardProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(springY, [-1, 1], [8, -8]);
  const rotateY = useTransform(springX, [-1, 1], [-8, 8]);
  const scale = useTransform(useSpring(mouseX, { stiffness: 200, damping: 30 }), [-1, 1], [1, 1.02]);

  useEffect(() => {
    const card = ref.current;
    if (!card || reduced) return;

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) / (rect.width / 2));
      mouseY.set((e.clientY - cy) / (rect.height / 2));
    };

    const onLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, [mouseX, mouseY, reduced]);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay(track);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPlay(track);
    }
  };

  return (
    <article
      ref={ref}
      className={clsx(
        'group relative',
        isPlaying && 'ring-2 ring-acid/60 ring-offset-2 ring-offset-void'
      )}
    >
      <div
        className="relative overflow-hidden border border-white/10 bg-panel rounded-xl transition-all duration-500 hover:border-bae/30"
        style={{
          transform: reduced ? undefined : `perspective(1000px) rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg) scale(${scale.get()})`,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          onClick={handlePlay}
          onKeyDown={handleKeyDown}
          className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          aria-label={isPlaying ? `Now playing: ${track.title}` : `Play ${track.title} on SoundCloud player`}
          data-cursor-play
        >
          <div className="relative aspect-square overflow-hidden">
            {track.artwork ? (
              <Image
                src={track.artwork}
                alt={`${track.title} artwork`}
                fill
                className={clsx(
                  'object-cover transition-all duration-700',
                  'group-hover:scale-[1.04]',
                  isPlaying && 'saturate-150 brightness-110'
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                onLoad={() => setLoading(false)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pulse/20 via-bae/10 to-acid/20 flex items-center justify-center">
                <span className="font-display font-bold text-4xl text-chrome/30">PARTYBAE</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute inset-0 scanlines" aria-hidden="true" />

            {/* Index badge */}
            <div className="absolute top-3 left-3 font-mono text-[10px] text-acid tracking-[0.2em] bg-black/60 backdrop-blur px-2 py-0.5 rounded border border-white/10">
              T-{index.toString().padStart(2, '0')}
            </div>

            {/* Duration badge */}
            <div className="absolute top-3 right-3 font-mono text-[10px] text-chrome bg-black/60 backdrop-blur px-2 py-0.5 rounded border border-white/10">
              {fmtDuration(track.durationMs)}
            </div>

            {/* Play overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
              animate={{ scale: isPlaying ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <motion.div className="h-10 w-10 animate-spin border-2 border-acid/30 border-t-acid rounded-full" aria-label="Loading" />
              ) : isPlaying ? (
                <motion.div
                  className="flex items-center gap-3 px-6 py-3 bg-acid/20 backdrop-blur border border-acid/50 rounded-full text-acid font-mono text-[11px] tracking-[0.15em]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <EqualizerMini />
                  NOW PLAYING
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center gap-2 px-6 py-3 bg-black/70 backdrop-blur border border-white/20 rounded-full text-chrome font-mono text-[11px] tracking-[0.15em]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  PLAY
                </motion.div>
              )}
            </motion.div>

            {/* HUD corners */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="hud-corner hud-corner-tl top-0 left-0" />
              <div className="hud-corner hud-corner-tr top-0 right-0" />
              <div className="hud-corner hud-corner-bl bottom-0 left-0" />
              <div className="hud-corner hud-corner-br bottom-0 right-0" />
            </div>
          </div>

          <div className="p-4 pt-3">
            <motion.h3
              className="font-display font-bold text-lg md:text-xl text-chrome glitch-hover line-clamp-2"
              data-text={track.title}
              initial={false}
              whileInView={{ opacity: [0, 1], y: [10, 0] }}
              viewport={{ once: true }}
            >
              {track.title}
            </motion.h3>
            <div className="mt-2 flex items-center gap-3 font-mono text-[10px] text-mist tracking-[0.15em]">
              <time dateTime={track.createdAt}>
                {new Date(track.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' }).toUpperCase()}
              </time>
              <span className="w-px h-4 bg-white/10 mx-1" aria-hidden="true" />
              <span>{fmtDuration(track.durationMs)}</span>
            </div>
          </div>
        </button>

        {/* SoundCloud link */}
        <a
          href={track.url}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-3 right-3 font-mono text-[9px] text-mist hover:text-bae transition-colors flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur rounded border border-white/10"
          aria-label={`Open ${track.title} on SoundCloud`}
          onClick={(e) => e.stopPropagation()}
          data-cursor-view
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          SC
        </a>
      </div>
    </article>
  );
}

function EqualizerMini() {
  return (
    <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-acid"
          animate={{ height: [8, 16, 4, 12, 8][i % 4] }}
          transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
          style={{ transformOrigin: 'bottom' }}
        />
      ))}
    </div>
  );
}