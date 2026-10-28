'use client';

import { motion } from 'motion/react';
import { SITE } from '@/data/site';

interface MarqueeProps {
  reverse?: boolean;
  speed?: number;
  className?: string;
}

export function Marquee({ reverse = false, speed = 30, className = '' }: MarqueeProps) {
  const phrases = [...SITE.marqueePhrases];
  const items = [...phrases, ...phrases];

  return (
    <div
      className={clsx('overflow-hidden', className)}
      aria-hidden="true"
      role="img"
      aria-label="Decorative marquee"
    >
      <div
        className="marquee-track"
        style={{
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} ${speed}s linear infinite`,
          animationPlayState: 'running',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {items.map((phrase, i) => (
          <span key={i} className="flex items-center gap-4 shrink-0 font-display font-bold uppercase select-none">
            {i % 2 === 0 ? (
              <span className="text-chrome/90">{phrase}</span>
            ) : (
              <span className="text-outline text-transparent">{phrase}</span>
            )}
            {i < items.length - 1 && <span className="text-bae">✦</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function clsx(...args: (string | undefined | false)[]) {
  return args.filter(Boolean).join(' ');
}