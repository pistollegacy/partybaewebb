'use client';

import { useSyncExternalStore } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, ExternalLink, Loader2, X } from 'lucide-react';
import { subscribe, getSnapshot, getServerSnapshot, setPlayerState, patchPlayerState, toggleActiveWidget } from '@/lib/player-store';
import { Equalizer as EqualizerComp } from '@/components/ui/equalizer';

export function PlayerDock() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!state || !state.canControl) return null;

  return (
    <motion.div
      className="fixed bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3 rounded-full bg-panel/95 backdrop-blur-md border border-white/10 shadow-glow px-5 py-3 min-w-[280px] max-w-[90vw]">
        <EqualizerComp active={state.isPlaying} barCount={10} height={20} color="acid" className="mr-1" />
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="font-mono text-[10px] text-acid tracking-[0.15em] shrink-0">
            {state.isPlaying ? 'NOW PLAYING' : 'PAUSED'}
          </span>
          <motion.span
            className="font-display font-medium truncate text-chrome"
            key={state.trackTitle}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            — {state.trackTitle}
          </motion.span>
        </div>
        <button
          onClick={toggleActiveWidget}
          disabled={!state.canControl}
          className="shrink-0 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-chrome hover:text-acid transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={state.isPlaying ? 'Pause' : 'Play'}
        >
          {state.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <a
          href={state.trackUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-chrome hover:text-bae transition-colors"
          aria-label="Open on SoundCloud"
        >
          <ExternalLink className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </motion.div>
  );
}