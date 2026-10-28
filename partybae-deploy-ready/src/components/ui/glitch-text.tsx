'use client';

import { motion } from 'motion/react';

interface GlitchTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  intensity?: 'subtle' | 'medium' | 'heavy';
}

export function GlitchText({ children, className = '', as: Tag = 'h1', intensity = 'medium' }: GlitchTextProps) {
  const offsets = {
    subtle: [{ x: -1, y: 1, clip: 'inset(30% 0 50% 0)' }, { x: 1, y: -1, clip: 'inset(50% 0 30% 0)' }],
    medium: [{ x: -3, y: 2, clip: 'inset(20% 0 60% 0)' }, { x: 2, y: -2, clip: 'inset(60% 0 20% 0)' }],
    heavy: [{ x: -5, y: 3, clip: 'inset(15% 0 65% 0)' }, { x: 4, y: -3, clip: 'inset(65% 0 15% 0)' }],
  };

  const [o1, o2] = offsets[intensity];

  return (
    <Tag className={`relative inline-block ${className}`} data-text={children}>
      <motion.span
        className="relative z-10"
        aria-hidden="true"
        style={{ willChange: 'transform, opacity, clip-path' }}
      >
        {children}
      </motion.span>
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 text-bae"
        style={{
          transform: `translate(${o1.x}px, ${o1.y}px)`,
          clipPath: o1.clip,
          opacity: 0,
        }}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 text-acid"
        style={{
          transform: `translate(${o2.x}px, ${o2.y}px)`,
          clipPath: o2.clip,
          opacity: 0,
        }}
      >
        {children}
      </span>
      <style jsx>{`
        ${Tag}:hover span:nth-of-type(2) {
          opacity: 0.9;
        }
        ${Tag}:hover span:nth-of-type(3) {
          opacity: 0.9;
        }
      `}</style>
    </Tag>
  );
}