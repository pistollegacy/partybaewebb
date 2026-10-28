'use client';

import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  meta?: string;
  id?: string;
  className?: string;
}

export function SectionHeading({ index, label, title, meta, id, className = '' }: SectionHeadingProps) {
  const headingId = id ?? `heading-${index.toLowerCase()}`;

  return (
    <div className={clsx('mb-12 md:mb-16', className)}>
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-acid">
        <span>//</span>
        <span>SECTION {index} — {label}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-acid/40 via-transparent to-transparent ml-4" />
      </div>
      <motion.h2
        id={headingId}
        className="font-display font-extrabold leading-none mt-4 text-[clamp(2.2rem,7vw,5.5rem)] text-chrome glitch-hover"
        data-text={title}
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-15%' }}
      >
        {title}
      </motion.h2>
      {meta && (
        <motion.p
          className="mt-6 text-right font-mono text-[11px] text-mist tracking-[0.2em]"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15%' }}
        >
          {meta}
        </motion.p>
      )}
    </div>
  );
}