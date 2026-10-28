'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface EqualizerProps {
  active?: boolean;
  barCount?: number;
  className?: string;
  height?: number;
  color?: 'acid' | 'bae' | 'pulse' | 'chrome';
}

export function Equalizer({ active = false, barCount = 12, className = '', height = 28, color = 'acid' }: EqualizerProps) {
  const reduced = useReducedMotion();
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (reduced) return;
    if (!active) {
      setBars(Array(barCount).fill(4));
      return;
    }
    const interval = setInterval(() => {
      setBars(Array.from({ length: barCount }, () => Math.floor(Math.random() * 90) + 10));
    }, 120);
    return () => clearInterval(interval);
  }, [active, barCount, reduced]);

  const colors = {
    acid: 'bg-acid/90',
    bae: 'bg-bae/90',
    pulse: 'bg-pulse/90',
    chrome: 'bg-chrome/90',
  };

  return (
    <div className={`flex items-end gap-1 h-[${height}px] ${className}`} aria-hidden="true" role="img" aria-label="Audio equalizer visualization">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${colors[color]} ${active ? 'animate-eq' : ''}`}
          style={{
            height: `${h}%`,
            transformOrigin: 'bottom',
            animationDelay: `${(i * 137) % 1000}ms`,
            animationDuration: `${0.8 + (i * 0.07) % 0.6}s`,
          }}
        />
      ))}
      {!active && bars.length === 0 && Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full ${colors[color]}`}
          style={{ height: `${4 + (i * 13) % 30}%` }}
        />
      ))}
    </div>
  );
}