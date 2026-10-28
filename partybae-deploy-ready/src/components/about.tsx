'use client';

import { useInView } from 'motion/react';
import { motion } from 'motion/react';
import { useRef } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { ExternalLink, Sparkles, Zap, Brain, Heart, Music as MusicIcon } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { SITE } from '@/data/site';

const bioLines = [
  { text: "Yo, I'm ", highlights: [] },
  { text: 'PARTYBAE', highlights: ['bae'] },
  { text: ". I'm 28 years old and I make ", highlights: [] },
  { text: 'hyperpop', highlights: ['pulse'] },
  { text: ' music. ', highlights: [] },
  { text: 'Welcome to my world of ', highlights: [] },
  { text: 'digital chaos', highlights: ['acid'] },
  { text: ', ', highlights: [] },
  { text: 'distorted sounds', highlights: ['pulse'] },
  { text: ', and ', highlights: [] },
  { text: 'experimental energy', highlights: ['bae'] },
  { text: '. ', highlights: [] },
  { text: 'Music is where I get to ', highlights: [] },
  { text: 'be myself', highlights: ['acid'] },
  { text: ', ', highlights: [] },
  { text: 'break the rules', highlights: ['pulse'] },
  { text: ', and ', highlights: [] },
  { text: 'create whatever I feel', highlights: ['bae'] },
  { text: '. ', highlights: [] },
  { text: 'Turn it up, ', highlights: [] },
  { text: 'explore my tracks', highlights: ['acid'] },
  { text: ', and ', highlights: [] },
  { text: 'enjoy the ride.', highlights: ['bae'] },
];

function HighlightedText({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return <span className="text-chrome/90">{text}</span>;
  const colors: Record<string, string> = {
    bae: 'text-bae',
    pulse: 'text-pulse',
    acid: 'text-acid',
  };
  return <span className={clsx('font-display font-medium', colors[highlight])}>{text}</span>;
}

export function About() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftInView = useInView(leftRef, { once: true, margin: '-10%' });
  const rightInView = useInView(rightRef, { once: true, margin: '-10%' });

  return (
    <section id="about" className="relative py-28 md:py-36" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left: Identity Spec */}
          <div ref={leftRef} className="space-y-8">
            <SectionHeading
              index="02"
              label="IDENTITY"
              title="BEHIND THE CHAOS."
              id="about-heading"
            />

            {/* Spec Card */}
            <motion.div
              className="relative bg-panel/50 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8 space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'AGE', value: String(SITE.identity.age) },
                  { label: 'GENRE', value: SITE.identity.genre },
                  { label: 'ARTIST', value: SITE.identity.artist },
                  { label: 'STATUS', value: SITE.identity.status },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="relative p-4 bg-black/30 backdrop-blur border border-white/10 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: leftInView ? 1 : 0, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.1, duration: 0.5 }}
                  >
                    <span className="font-mono text-[10px] text-mist tracking-[0.2em] block mb-1">{item.label}</span>
                    <span className="font-display font-bold text-lg text-chrome">{item.value}</span>
                    {item.label === 'STATUS' && (
                      <motion.span
                        className="absolute top-4 right-4 h-2 w-2 rounded-full bg-acid animate-pulse-dot"
                        aria-hidden="true"
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                {[
                  { label: 'BASE', value: SITE.location },
                  { label: 'SIGNAL', value: `"${SITE.bio.quote}"` },
                  { label: 'SOUND', value: '@partybae', link: SITE.soundcloud.profileUrl },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center justify-between py-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: leftInView ? 1 : 0, x: 0 }}
                    transition={{ delay: 0.1 * i + 0.4, duration: 0.4 }}
                  >
                    <span className="font-mono text-[10px] text-mist tracking-[0.2em]">{item.label}</span>
                    <span className="font-display font-medium text-chrome text-right max-w-[70%]">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noreferrer" className="hover:text-bae transition-colors flex items-center gap-1">
                          {item.value}
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      ) : (
                        item.value
                      )}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Avatar Chip */}
            <motion.div
              className="flex items-center gap-4 p-4 bg-panel/50 backdrop-blur border border-white/10 rounded-xl max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: leftInView ? 1 : 0, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                <Image
                  src="https://i1.sndcdn.com/avatars-jICFXDFIJpM1P4td-qwkaMQ-t500x500.jpg"
                  alt="PARTYBAE avatar"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                <motion.div
                  className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-acid border-2 border-void animate-pulse-dot"
                  aria-label="Online"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] text-mist tracking-[0.2em] block">PROFILE</span>
                <a href={SITE.soundcloud.profileUrl} target="_blank" rel="noreferrer" className="font-display font-medium text-chrome hover:text-bae transition-colors flex items-center gap-1">
                  soundcloud.com/partybae
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right: Biography */}
          <div ref={rightRef} className="space-y-6">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: rightInView ? 1 : 0, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 hidden lg:block rotate-90 origin-left font-display font-extrabold text-[clamp(4rem,15vw,12rem)] text-outline opacity-5" aria-hidden="true">
                CHAOS
              </div>
            </motion.div>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: rightInView ? 1 : 0 }}
              transition={{ delay: 0.3 }}
            >
              {bioLines.map((line, i) => (
                <motion.p
                  key={i}
                  className="font-display font-medium text-[clamp(1.1rem,2.5vw,1.5rem)] leading-relaxed"
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: rightInView ? 1 : 0, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.6, delay: 0.1 * i + 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line.text.split(' ').map((word, wi) => {
                    const hl = line.highlights[wi] ?? line.highlights[0];
                    return <HighlightedText key={wi} text={word + (wi < line.text.split(' ').length - 1 ? ' ' : '')} highlight={hl} />;
                  })}
                </motion.p>
              ))}
            </motion.div>

            <motion.div
              className="mt-10 pt-6 border-t border-white/10 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: rightInView ? 1 : 0, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <span className="font-mono text-[10px] text-acid tracking-[0.2em]">— PARTYBAE</span>
              <motion.span className="text-bae animate-pulse-dot">✦</motion.span>
              <span className="font-mono text-[10px] text-mist">EUGENE, OREGON</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}