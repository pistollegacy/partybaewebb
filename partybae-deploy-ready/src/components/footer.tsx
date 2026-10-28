'use client';

import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { ArrowUp, ExternalLink, Gamepad2, Music } from 'lucide-react';
import { SITE } from '@/data/site';

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-16 md:py-24" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Wordmark */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span
            className="font-display font-extrabold text-[clamp(3rem,10vw,9rem)] text-outline tracking-tight select-none"
            style={{ WebkitTextStrokeWidth: '1px' }}
          >
            PARTYBAE
          </span>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Sitemap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="font-mono text-[10px] text-acid tracking-[0.3em] mb-4">SITEMAP</h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3 font-display font-medium">
                {SITE.navItems.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-chrome hover:text-bae transition-colors group relative">
                      <span className="inline-block">{item.label}</span>
                      <motion.span className="ml-2 inline-block opacity-0 group-hover:opacity-100 translate-x-1 transition-all" aria-hidden="true">→</motion.span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            viewport={{ once: true }}
          >
            <h4 className="font-mono text-[10px] text-acid tracking-[0.3em] mb-4">SIGNALS</h4>
            <ul className="space-y-3">
              <li>
                <a href={SITE.soundcloud.profileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-[11px] text-mist hover:text-bae transition-colors">
                  <Music className="h-4 w-4" aria-hidden="true" />
                  SOUNDCLOUD.COM/PARTYBAE
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
              <li>
                <button className="flex items-center gap-2 font-mono text-[11px] text-mist hover:text-pulse transition-colors">
                  <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                  COPY PSN: TOKYO-_-OCCULT
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Credits */}
          <motion.div
            className="text-right md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            viewport={{ once: true }}
          >
            <div className="space-y-3 font-mono text-[10px] text-mist/60 tracking-[0.15em]">
              <p>© 2026 PARTYBAE — ALL NOISE RESERVED</p>
              <p>DESIGN: DIGITAL CHAOS SYSTEM</p>
              <p>POWERED BY SOUNDCLOUD</p>
              <p>BUILT WITH DISTORTION ✦ EUGENE, OREGON</p>
            </div>
            <div className="mt-6 flex items-center justify-end md:justify-start gap-3">
              <a href="#top" className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-mono text-[10px] tracking-[0.15em] text-chrome hover:text-acid transition-colors">
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
                REWIND
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-[10px] text-mist/50 tracking-[0.15em]">
            PARTYBAE // HYPERPOP // DIGITAL CHAOS //
          </p>
          <div className="flex items-center gap-4">
            <a href={SITE.soundcloud.profileUrl} target="_blank" rel="noreferrer" className="text-mist/50 hover:text-bae transition-colors" aria-label="SoundCloud">
              <Music className="h-5 w-5" aria-hidden="true" />
            </a>
            <span className="text-mist/50 text-[10px]">TOKYO-_-OCCULT</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}