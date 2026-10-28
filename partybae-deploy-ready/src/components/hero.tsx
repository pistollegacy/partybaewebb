'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue, useSpring } from 'motion/react';
import { clsx } from 'clsx';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Magnetic } from '@/components/ui/magnetic';
import { Equalizer as EqualizerComp } from '@/components/ui/equalizer';
import { SITE } from '@/data/site';
import { useBoot } from '@/components/preloader';

const WORD = 'PARTYBAE'.split('');

export function Hero() {
  const { booted } = useBoot();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [chaosMode, setChaosMode] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [chaosIntensity, setChaosIntensity] = useState(0);

  const logoMouseX = useMotionValue(0);
  const logoMouseY = useMotionValue(0);
  const logoRotateX = useSpring(useTransform(logoMouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const logoRotateY = useSpring(useTransform(logoMouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
  const logoScale = useSpring(useMotionValue(1), { stiffness: 400, damping: 30 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const orbX = useTransform(mouseX, [-0.5, 0.5], [-40, 40]);
  const orbY = useTransform(mouseY, [-0.5, 0.5], [-40, 40]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      if (logoRef.current) {
        const logoRect = logoRef.current.getBoundingClientRect();
        logoMouseX.set((e.clientX - logoRect.left) / logoRect.width - 0.5);
        logoMouseY.set((e.clientY - logoRect.top) / logoRect.height - 0.5);
      }
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks >= 5) {
      setChaosMode(true);
      setChaosIntensity(1);
      setLogoClicks(0);
    }
  };

  const exitChaosMode = () => {
    setChaosMode(false);
    setChaosIntensity(0);
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Aurora orbs - mouse reactive */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(168, 85, 247, 0.2) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 70%, rgba(255, 45, 155, 0.15) 0%, transparent 55%)
          `,
          x: orbX,
          y: orbY,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 30% 40%, rgba(168, 85, 247, 0.25) 0%, transparent 45%),
            radial-gradient(circle at 70% 60%, rgba(255, 45, 155, 0.18) 0%, transparent 40%)
          `,
        }}
        animate={{ rotate: chaosMode ? [0, 360, 0] : [0, 360] }}
        transition={{ duration: chaosMode ? 5 : 60, repeat: Infinity, ease: 'linear' }}
      />

      {/* Chaos mode overlay */}
      {chaosMode && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 -z-5 bg-gradient-to-br from-pulse/20 via-bae/15 to-acid/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Floating shards - enhanced in chaos mode */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute rounded-lg blur-xl opacity-20"
          style={{
            width: [60, 80, 50, 90, 70, 55][i],
            height: [60, 80, 50, 90, 70, 55][i],
            left: [10, 85, 15, 75, 5, 90][i] + '%',
            top: [20, 15, 70, 80, 40, 60][i] + '%',
            background: [
              'rgba(168,85,247,0.6)',
              'rgba(255,45,155,0.5)',
              'rgba(200,255,46,0.4)',
              'rgba(216,217,232,0.3)',
              'rgba(168,85,247,0.4)',
              'rgba(255,45,155,0.4)',
            ][i],
          }}
          animate={{
            y: chaosMode ? [-30, 40, -20, 25, -15, 20][i] : [-15, 20, -10, 12, -8, 10][i],
            x: chaosMode ? [20, -30, 35, -15, 15, -25][i] : [10, -15, 18, -8, 5, -12][i],
            rotate: chaosMode ? [90, -60, 120, -30, 45, -45][i] : [45, -30, 60, -15, 20, -20][i],
          }}
          transition={{
            duration: chaosMode ? [3, 4, 3.5, 4.5, 3.2, 3.8][i] : [7, 9, 8, 10, 7.5, 8.5][i],
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Synthwave grid floor */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-72 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(180deg, black 0%, transparent 100%)',
          y: gridY,
        }}
      />

      {/* Eyebrow */}
      <div className="absolute left-5 md:left-10 top-1/2 -translate-y-1/2 hidden lg:block rotate-90 origin-left font-mono text-[10px] text-acid tracking-[0.5em] z-10">
        /// TRANSMISSION 001 — EUGENE, OREGON
      </div>

      {/* Right vertical label */}
      <div className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 hidden lg:block -rotate-90 origin-right font-mono text-[10px] text-mist tracking-[0.5em] z-10">
        PSN: TOKYO-_-OCCULT ✦ EST. 28
      </div>

      {/* Chaos mode indicator */}
      {chaosMode && (
        <motion.div
          className="absolute top-5 right-5 z-20 flex items-center gap-2 px-4 py-2 bg-acid/20 border border-acid/50 rounded-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.span className="h-2 w-2 rounded-full bg-acid animate-pulse-dot" />
          <span className="font-mono text-[10px] text-acid tracking-[0.2em]">CHAOS MODE ACTIVE</span>
          <button
            onClick={exitChaosMode}
            className="ml-2 p-1 rounded-full bg-acid/10 hover:bg-acid/30 text-acid transition-colors"
            aria-label="Exit Chaos Mode"
          >
            ✕
          </button>
        </motion.div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center px-5">
        {/* Eyebrow mobile */}
        <div className="mb-4 font-mono text-[10px] text-acid tracking-[0.4em] opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          /// TRANSMISSION 001 — EUGENE, OREGON
        </div>

        {/* Main Title - Interactive 3D */}
        <motion.div
          ref={logoRef}
          className="relative"
          style={{
            transform: reduced ? undefined : `perspective(1000px) rotateX(${logoRotateX.get()}deg) rotateY(${logoRotateY.get()}deg) scale(${logoScale.get()})`,
            transformStyle: 'preserve-3d',
          }}
          onClick={handleLogoClick}
          onMouseEnter={() => logoScale.set(1.02)}
          onMouseLeave={() => logoScale.set(1)}
          data-cursor-hover
        >
          <h1
            id="hero-title"
            className="relative font-display font-extrabold tracking-tight leading-[0.92] text-[clamp(3rem,13vw,11rem)] text-chrome glitch-auto"
            aria-label="PARTYBAE"
            style={{
              textShadow: '0 0 80px rgba(168,85,247,0.3), 0 0 160px rgba(255,45,155,0.2)',
              filter: chaosMode ? 'hue-rotate(45deg) saturate(1.5)' : 'none',
            }}
          >
            {WORD.map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden" aria-hidden="true">
                <motion.span
                  className="inline-block"
                  initial={{ y: reduced ? 0 : '110%' }}
                  animate={{ y: booted && !reduced ? '0%' : '110%' }}
                  transition={{ delay: 0.06 * i + 0.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    transform: chaosMode ? 'translateZ(20px)' : 'none',
                    textShadow: chaosMode ? '0 0 30px rgba(200,255,46,0.8)' : 'none',
                  }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
            {/* Glitch layers */}
            <span aria-hidden="true" className="absolute inset-0 -z-10 text-bae glitch-layer glitch-layer--pink" style={{ opacity: chaosMode ? 1 : 0 }}>PARTYBAE</span>
            <span aria-hidden="true" className="absolute inset-0 -z-10 text-acid glitch-layer glitch-layer--acid" style={{ opacity: chaosMode ? 1 : 0 }}>PARTYBAE</span>
          </h1>

          {/* Liquid chrome reflection */}
          <div
            className="absolute inset-0 -z-20 bg-gradient-to-b from-transparent via-chrome/10 to-transparent blur-xl"
            style={{
              transform: 'translateY(50%) scaleY(-0.5)',
              opacity: chaosMode ? 0.5 : 0.15,
              filter: chaosMode ? 'hue-rotate(90deg)' : 'none',
            }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-2 font-mono text-[clamp(10px,2.5vw,14px)] tracking-[0.6em] text-plasma uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: booted ? 1 : 0, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          HYPERPOP FROM ANOTHER DIMENSION.
        </motion.p>

        {/* Description */}
        <motion.p
          className="mt-6 font-display font-medium text-[clamp(1.1rem,3vw,2rem)] leading-snug text-chrome"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: booted ? 1 : 0, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Loud sounds. Digital chaos. No rules.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: booted ? 1 : 0, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <Magnetic>
            <a
              href="#music"
              className="relative group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pulse via-bae to-acid px-8 py-4 font-display font-medium text-[clamp(13px,2.5vw,16px)] tracking-[0.15em] text-black border border-white/20 hover:border-bae/50 hover:from-pulse hover:via-bae hover:to-acid transition-all duration-300 overflow-hidden shadow-glow"
              data-cursor-hover
            >
              <span className="relative z-10">EXPLORE THE MUSIC</span>
              <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              <span className="absolute inset-0 bg-gradient-to-r from-pulse via-bae to-acid opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              <span className="absolute inset-0 bg-white/10 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" aria-hidden="true" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#about"
              className="relative group flex items-center justify-center gap-3 rounded-full bg-white/[0.02] px-8 py-4 font-display font-medium text-[clamp(13px,2.5vw,16px)] tracking-[0.15em] text-chrome border border-white/10 hover:border-acid/60 hover:bg-white/[0.06] hover:text-acid transition-all duration-300 overflow-hidden"
              data-cursor-hover
            >
              <span className="relative z-10">ENTER MY WORLD</span>
              <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 transition-transform text-acid" aria-hidden="true" />
              <span className="absolute inset-0 bg-acid/10 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </a>
          </Magnetic>
        </motion.div>

        {/* Equalizer strip + scroll cue */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 w-full max-w-4xl px-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: booted ? 1 : 0, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <div className="w-full flex items-center justify-between">
            <EqualizerComp active={true} barCount={28} height={16} color="acid" className="flex-1" />
            <span className="font-mono text-[10px] text-acid tracking-[0.4em] px-4 whitespace-nowrap shrink-0">
              AUDIO SIGNAL // PARTYBAE.FM
            </span>
            <EqualizerComp active={true} barCount={28} height={16} color="bae" className="flex-1" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[9px] text-mist tracking-[0.5em]">SCROLL</span>
            <motion.div
              className="w-px h-10 bg-gradient-to-b from-acid via-acid/40 to-transparent"
              animate={{ scaleY: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <ArrowDown className="h-5 w-5 text-acid/60 animate-bounce" aria-hidden="true" />
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .glitch-layer {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          font: inherit;
        }
        .glitch-layer--pink {
          animation: var(--animate-glitch-flash) 7s steps(1) infinite;
        }
        .glitch-layer--acid {
          animation: var(--animate-glitch-flash) 7s steps(1) infinite;
          animation-delay: 3.5s;
        }
        @keyframes fade-in {
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}