'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useReducedMotion } from 'motion/react';
import { clsx } from 'clsx';
import { Copy, Check, ExternalLink, Gamepad2, Triangle, Circle, X, Square } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { Magnetic } from '@/components/ui/magnetic';
import { SITE, PS_COLORS } from '@/data/site';

export function PlayStation() {
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.playstation.psnId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = SITE.playstation.psnId;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card || reduced) return;

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) / (rect.width / 2));
      mouseY.set((e.clientY - cy) / (rect.height / 2));
    };

    const onLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, [mouseX, mouseY, reduced]);

  const rotateX = useSpring(useTransform(springY, [-1, 1], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(springX, [-1, 1], [-8, 8]), { stiffness: 300, damping: 30 });

  return (
    <section id="psn" className="relative py-28 md:py-36 overflow-hidden" aria-labelledby="psn-heading">
      {/* Section BG */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-pulse/10 via-transparent to-bae/5" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }} />
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10">
        <SectionHeading
          index="03"
          label="GAMING"
          title="OFFLINE? NEVER."
        />

        <motion.p
          className="max-w-2xl mx-auto text-center font-mono text-[13px] md:text-[15px] text-mist tracking-[0.15em] leading-relaxed mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          When I'm not making music, you'll probably find me gaming.
        </motion.p>

        {/* PSN Identity Card */}
        <motion.div
          ref={cardRef}
          className="relative max-w-xl mx-auto"
          style={{
            transform: reduced ? undefined : `perspective(1000px) rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg)`,
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Card */}
          <div className="relative rounded-2xl overflow-hidden p-1 bg-gradient-to-br from-chrome/60 via-pulse/40 to-bae/60">
            <div className="relative rounded-[15px] bg-abyss/95 backdrop-blur p-8 md:p-10 border border-white/5">
              {/* PS Shapes Row */}
              <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
                {[
                  { icon: Triangle, color: PS_COLORS.triangle, label: '△' },
                  { icon: Circle, color: PS_COLORS.circle, label: '○' },
                  { icon: X, color: PS_COLORS.cross, label: '✕' },
                  { icon: Square, color: PS_COLORS.square, label: '□' },
                ].map(({ icon: Icon, color, label }, i) => (
                  <motion.div
                    key={label}
                    className="flex items-center justify-center h-10 w-10 rounded-full"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${color}80, ${color}20)`, boxShadow: `0 0 20px ${color}40` }}
                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1 * i + 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
                  </motion.div>
                ))}
              </div>

              {/* Header */}
              <div className="text-center mb-6">
                <span className="font-mono text-[10px] text-mist tracking-[0.3em] block mb-2">PLAYSTATION NETWORK // IDENTITY CARD</span>
              </div>

              {/* Avatar Area */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative h-24 w-24 rounded-xl border-2 flex items-center justify-center" style={{ borderColor: 'rgba(216,217,232,0.3)' }}>
                  <motion.div
                    className="relative z-10 h-20 w-20 rounded-lg bg-gradient-to-br from-pulse/20 via-bae/10 to-acid/20 flex items-center justify-center"
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="font-display font-extrabold text-3xl text-chrome">PⒷ</span>
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-acid border-2 border-abyss animate-pulse-dot"
                    aria-label="Online"
                  />
                </div>
                <div className="text-center">
                  <span className="font-mono text-[10px] text-mist tracking-[0.2em] block mb-1">PSN ID</span>
                  <span className="font-display font-bold text-[clamp(1.5rem,4vw,2.5rem)] text-chrome break-all select-all">
                    {SITE.playstation.psnId}
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                {[
                  { label: 'STATUS', value: 'ONLINE-ISH' },
                  { label: 'REGION', value: 'WWW' },
                  { label: 'MODE', value: 'DIGITAL CHAOS' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="p-3 bg-black/30 backdrop-blur border border-white/10 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.4 }}
                  >
                    <span className="font-mono text-[9px] text-mist tracking-[0.15em] block mb-1">{item.label}</span>
                    <span className="font-display font-medium text-chrome">{item.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* Copy Button */}
              <Magnetic>
                <button
                  onClick={handleCopy}
                  className={clsx(
                    'w-full flex items-center justify-center gap-3 px-6 py-4 font-mono text-[11px] tracking-[0.15em] rounded-full transition-all',
                    copied
                      ? 'bg-acid/20 border-acid/50 text-acid'
                      : 'bg-white/5 border-white/10 text-chrome hover:border-bae/50 hover:bg-white/10'
                  )}
                  data-cursor-hover
                  aria-label={copied ? 'Copied to clipboard' : 'Copy PSN username'}
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5" aria-hidden="true" />
                      COPIED TO CLIPBOARD
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" aria-hidden="true" />
                      COPY PSN USERNAME
                    </>
                  )}
                </button>
              </Magnetic>

              {/* Holographic Sheen */}
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-[15px]"
                style={{
                  background: `radial-gradient(circle at ${springX.get() * 50 + 50}% ${springY.get() * 50 + 50}%, rgba(255,255,255,0.12) 0%, transparent 50%)`,
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Floating PS Shapes */}
          {!reduced && (
            <>
              <motion.div
                className="absolute -top-10 -right-10 h-24 w-24 rounded-full opacity-10 blur-xl"
                style={{ background: PS_COLORS.triangle }}
                animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute bottom-20 -left-10 h-20 w-20 rounded-full opacity-10 blur-xl"
                style={{ background: PS_COLORS.circle }}
                animate={{ x: [0, -15, 10, 0], y: [0, 20, -10, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full opacity-5 blur-2xl"
                style={{ background: PS_COLORS.square }}
                animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
            </>
          )}
        </motion.div>

        <motion.p
          className="mt-10 text-center font-mono text-[11px] text-mist/60 tracking-[0.3em]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          INSERT COIN // ADD ME // NO SCOPE NO LOVE
        </motion.p>
      </div>
    </section>
  );
}

function handleCopy() {
  // This is a placeholder - the real handler is in the component
}