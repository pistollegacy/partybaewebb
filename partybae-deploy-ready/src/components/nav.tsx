'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { clsx } from 'clsx';
import { Menu, X, ArrowUpRight, Gamepad2, Music } from 'lucide-react';
import { Magnetic } from '@/components/ui/magnetic';
import { SITE } from '@/data/site';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const delta = latest - lastScrollY.current;
    if (Math.abs(delta) < 4) return;
    if (!menuOpen) setHidden(latest > 80 && delta > 0);
    setScrolled(latest > 20);
    lastScrollY.current = latest;
  });

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      const firstLink = navRef.current?.querySelector('a');
      (firstLink as HTMLElement)?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      ref={navRef}
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled && 'bg-void/90 backdrop-blur-md border-b border-white/10',
        hidden && !menuOpen && '-translate-y-full'
      )}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-display font-semibold text-lg md:text-xl text-chrome" aria-label="PARTYBAE — Home">
            <WaveformMark size={28} />
            <span>PARTYBAE</span>
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {SITE.navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative group flex items-center gap-1.5 font-mono text-[10px] tracking-[0.35em] text-mist transition-colors hover:text-acid"
                onClick={closeMenu}
              >
                <span className="opacity-60">{item.num}</span>
                <span className="overflow-hidden h-5">
                  <motion.span className="block" initial={{ y: 0 }} whileHover={{ y: '-100%' }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                    {item.label}
                  </motion.span>
                  <motion.span className="block text-chrome" initial={{ y: '100%' }} whileHover={{ y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                    {item.label}
                  </motion.span>
                </span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#music"
              className="hidden sm:flex"
            >
              <Magnetic>
                <button className="relative group flex items-center gap-2 rounded-full bg-gradient-to-r from-pulse/20 via-bae/20 to-acid/20 px-5 py-2 font-mono text-[11px] tracking-[0.2em] text-chrome border border-white/10 hover:border-bae/50 hover:from-pulse/40 hover:via-bae/40 hover:to-acid/40 transition-all duration-300 overflow-hidden" data-cursor-hover>
                  <span className="relative z-10">LISTEN</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="absolute inset-0 bg-gradient-to-r from-pulse via-bae to-acid opacity-0 group-hover:opacity-20 transition-opacity" aria-hidden="true" />
                </button>
              </Magnetic>
            </a>

            <button
              className="md:hidden p-2 text-mist hover:text-chrome transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          id="mobile-menu"
          className="md:hidden overflow-hidden"
          initial={false}
          animate={{ height: menuOpen ? 'auto' : 0, opacity: menuOpen ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="py-6 border-t border-white/10">
            <div className="flex flex-col gap-6">
              {SITE.navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-4 font-display text-3xl md:text-4xl font-medium text-chrome hover:text-bae transition-colors"
                  onClick={closeMenu}
                >
                  <span className="font-mono text-[10px] text-acid tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">{item.num}</span>
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <a
                  href={SITE.soundcloud.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-mist hover:text-bae transition-colors"
                >
                  <Music className="h-5 w-5" aria-hidden="true" />
                  SOUNDCLOUD.COM/PARTYBAE
                  <ArrowUpRight className="h-4 w-4 ml-auto" aria-hidden="true" />
                </a>
                <button
                  onClick={() => { navigator.clipboard.writeText(SITE.playstation.psnId); closeMenu(); }}
                  className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-mist hover:text-pulse transition-colors"
                >
                  <Gamepad2 className="h-5 w-5" aria-hidden="true" />
                  COPY PSN: TOKYO-_-OCCULT
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

function WaveformMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="waveGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="55%" stopColor="#ff2d9b" />
          <stop offset="100%" stopColor="#c8ff2e" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#05010a" />
      <g transform="translate(8, 8)">
        {[12, 28, 44, 54, 44, 28, 12].map((h, i) => (
          <rect
            key={i}
            x={i * 8}
            y={32 - h / 2}
            width={4}
            height={h}
            rx={2}
            fill={i === 3 ? '#c8ff2e' : 'url(#waveGrad)'}
          />
        ))}
      </g>
    </svg>
  );
}