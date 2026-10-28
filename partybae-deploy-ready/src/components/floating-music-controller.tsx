'use client';

import { useState } from 'react';
import { useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Music, ExternalLink } from 'lucide-react';
import { subscribe, getSnapshot, getServerSnapshot, patchPlayerState, toggleActiveWidget } from '@/lib/player-store';

export function FloatingMusicController() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(0.7);

  if (!state || !state.canControl) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    const activeWidget = (window as any).__SC_ACTIVE_WIDGET__;
    if (activeWidget) {
      activeWidget.setVolume(newVolume);
    }
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.7);
    const activeWidget = (window as any).__SC_ACTIVE_WIDGET__;
    if (activeWidget) {
      activeWidget.setVolume(volume > 0 ? 0 : 0.7);
    }
  };

  const closeController = () => {
    const activeWidget = (window as any).__SC_ACTIVE_WIDGET__;
    if (activeWidget) {
      activeWidget.pause();
    }
    patchPlayerState({ isPlaying: false });
    setExpanded(false);
  };

  if (reduced) return null;

  return (
    <>
      {/* Collapsed state - floating button */}
      <motion.button
        className="fixed bottom-6 right-6 z-40 rounded-full bg-gradient-to-r from-pulse via-bae to-acid p-3 shadow-glow-bae flex items-center justify-center"
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        onClick={() => setExpanded(true)}
        aria-label="Open music controller"
        data-cursor-hover
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="h-6 w-6"
          animate={{ rotate: state.isPlaying ? 360 : 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <Music className="h-6 w-6 text-black" aria-hidden="true" />
        </motion.div>
        {state.isPlaying && (
          <motion.span
            className="absolute -right-2 -top-2 h-3 w-3 rounded-full bg-acid animate-pulse-dot"
            aria-hidden="true"
          />
        )}
      </motion.button>

      {/* Expanded state - full controller */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 w-80 md:w-96"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-panel/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-glow overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pulse/20 via-bae/10 to-acid/20 flex items-center justify-center">
                <Music className="h-5 w-5 text-chrome" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-acid tracking-[0.2em] truncate">NOW PLAYING</p>
                <motion.p
                  className="font-display font-medium text-chrome truncate"
                  key={state.trackTitle}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {state.trackTitle}
                </motion.p>
              </div>
            </div>
            <button
              onClick={closeController}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-mist hover:text-acid transition-colors"
              aria-label="Close controller"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress bar placeholder */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-mist/60">
              <span>0:00</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pulse via-bae to-acid"
                  animate={{ width: state.isPlaying ? '100%' : '0%' }}
                  transition={{ duration: 30, ease: 'linear' }}
                />
              </div>
              <span>{Math.floor(state.trackUrl.length / 1000)}:{Math.floor(state.trackUrl.length / 60) % 60}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 pb-4 gap-3">
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-chrome hover:text-bae transition-colors"
                aria-label="Previous"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <motion.button
                onClick={toggleActiveWidget}
                className="p-3 rounded-full bg-gradient-to-r from-pulse via-bae to-acid text-black hover:from-pulse hover:via-bae hover:to-acid transition-all shadow-glow"
                aria-label={state.isPlaying ? 'Pause' : 'Play'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {state.isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </motion.button>
              <button
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-chrome hover:text-bae transition-colors"
                aria-label="Next"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-chrome hover:text-bae transition-colors"
                aria-label={volume > 0 ? 'Mute' : 'Unmute'}
              >
                {volume > 0 ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-white/10 rounded-full appearance-none accent-acid cursor-pointer input-range-styled"
                aria-label="Volume"
              />
            </div>
          </div>

          {/* External link */}
          <div className="px-4 pb-4 border-t border-white/10">
            <a
              href={state.trackUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-chrome font-mono text-[10px] tracking-[0.15em] transition-colors"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              OPEN ON SOUNDCLOUD
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
  const newVolume = parseFloat(e.target.value);
  const activeWidget = (window as any).__SC_ACTIVE_WIDGET__;
  if (activeWidget) {
    activeWidget.setVolume(newVolume);
  }
}

function toggleMute() {
  // This is handled by the component state
}

function closeController() {
  // This is handled by the component state
}