'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { motion, animate, useReducedMotion } from 'motion/react';

interface BootContextValue {
  booted: boolean;
  setBooted: (value: boolean) => void;
}

const BootContext = createContext<BootContextValue>({ booted: false, setBooted: () => {} });

export function BootProvider({ children }: { children: ReactNode }) {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasBooted = sessionStorage.getItem('pb-booted');
    if (hasBooted) {
      setBooted(true);
      return;
    }
  }, []);

  return <BootContext.Provider value={{ booted, setBooted }}>{children}</BootContext.Provider>;
}

export function useBoot() {
  return useContext(BootContext);
}

export function Preloader() {
  const { booted, setBooted } = useBoot();
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (booted || reduced) {
      setBooted?.(true);
      sessionStorage.setItem('pb-booted', 'true');
      return;
    }

    const hasBooted = sessionStorage.getItem('pb-booted');
    if (hasBooted) {
      setBooted(true);
      return;
    }

    const ctrl = animate(0, 100, {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setProgress(Math.round(v)),
      onComplete: () => {
        setExiting(true);
        setTimeout(() => {
          sessionStorage.setItem('pb-booted', 'true');
          setBooted(true);
        }, 500);
      },
    });

    const onClick = () => ctrl.stop();
    document.addEventListener('click', onClick, { once: true });
    return () => document.removeEventListener('click', onClick);
  }, [booted, reduced, setBooted]);

  if (booted || reduced) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-void flex flex-col items-center justify-center"
      initial={false}
      animate={{ opacity: exiting ? 0 : 1, y: exiting ? '-100%' : 0 }}
      transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
      onClick={() => setExiting(true)}
    >
      <div className="font-mono text-[11px] text-acid tracking-[0.4em] mb-8">
        INITIALIZING DIGITAL CHAOS
      </div>
      <div className="font-mono text-[11px] text-mist tracking-[0.4em] mb-10">
        LOCATING SIGNAL <span className="animate-blink">█</span>
      </div>
      <div className="relative w-64 h-1 bg-panel/50 rounded-full overflow-hidden mb-6 border border-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-pulse via-bae to-acid rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <div className="font-mono text-[14px] text-chrome tracking-[0.3em] tabular-nums">
        {progress}%
      </div>
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 font-display text-[clamp(2rem,8vw,5rem)] font-extrabold text-chrome"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: progress > 55 ? 1 : 0, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        PARTYBAE
      </motion.div>
      <div className="font-mono text-[10px] text-mist tracking-[0.5em] mt-16 opacity-60">
        CLICK TO SKIP
      </div>
    </motion.div>
  );
}