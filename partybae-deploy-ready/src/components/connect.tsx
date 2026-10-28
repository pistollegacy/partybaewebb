'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { Copy, Check, ExternalLink, Gamepad2, Music, Sparkles, Loader2 } from 'lucide-react';
import { Magnetic } from '@/components/ui/magnetic';
import { SectionHeading } from '@/components/section-heading';
import { SITE } from '@/data/site';

interface SocialLinkProps {
  name: string;
  handle: string;
  href?: string;
  action?: 'copy';
  value?: string;
  icon: 'soundcloud' | 'gamepad';
  accent: 'bae' | 'pulse' | 'acid';
  note: string;
}

function SocialLinkCard({ name, handle, href, action, value, icon, accent, note }: SocialLinkProps) {
  const [copied, setCopied] = useState(false);
  const accentColors = { bae: 'text-bae', pulse: 'text-pulse', acid: 'text-acid' };
  const borderColors = { bae: 'border-bae/50', pulse: 'border-pulse/50', acid: 'border-acid/50' };
  const bgColors = { bae: 'bg-bae/20', pulse: 'bg-pulse/20', acid: 'bg-acid/20' };

  const handleAction = async () => {
    if (action === 'copy' && value) {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    }
  };

  const Icon = icon === 'soundcloud' ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.373 18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-9.72-1.26-.42.12-.66-.12-.72-.48-.12-.42.18-.72.6-.78 4.32-1.08 8.76-.42 10.86 1.98.36.42.18.9-.36.96z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.373 18.627 0 12 0zm-1.8 10.08c-1.68 0-3.12-.78-3.96-1.98-.72-1.02-.72-2.46 0-3.48 2.28-1.32 5.04-1.02 6.9 0 .66.9.6 2.34-.48 3.12-1.5 1.2-3.3 1.5-5.22 1.02-.72-.24-1.26-.66-1.56-.12-.18.3-.12.66.12.78z"/>
    </svg>
  ) : (
    <Gamepad2 className="h-6 w-6" aria-hidden="true" />
  );

  return (
    <motion.div
      className={clsx(
        'relative group p-6 md:p-8 bg-panel/50 backdrop-blur border rounded-2xl transition-all duration-500',
        'hover:border-accent/50 hover:shadow-glow',
        accent === 'bae' ? 'hover:shadow-glow-bae' : accent === 'pulse' ? 'hover:shadow-glow' : 'hover:shadow-glow-acid'
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className={clsx('flex-shrink-0 h-14 w-14 rounded-xl flex items-center justify-center', bgColors[accent])}>
          <span className={clsx('text-xl', accentColors[accent])}>{Icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[10px] text-mist tracking-[0.2em] block mb-1">{name}</span>
          <span className="font-display font-bold text-xl text-chrome truncate block">{handle}</span>
        </div>
      </div>

      <p className="font-mono text-[10px] text-mist/70 tracking-[0.15em] mb-6 line-clamp-2">{note}</p>

      {href ? (
        <Magnetic>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={clsx(
              'w-full flex items-center justify-center gap-2 px-5 py-3 font-mono text-[11px] tracking-[0.15em] rounded-full transition-all',
              accent === 'bae' ? 'bg-gradient-to-r from-pulse/20 via-bae/20 to-acid/20 border border-white/10 text-chrome hover:border-bae/50 hover:from-pulse/40 hover:via-bae/40 hover:to-acid/40' :
              accent === 'pulse' ? 'bg-white/5 border-white/10 text-chrome hover:border-pulse/50 hover:bg-white/10' :
              'bg-white/5 border-white/10 text-chrome hover:border-acid/50 hover:bg-white/10'
            )}
            data-cursor-hover
          >
            {action === 'copy' ? 'COPY' : 'OPEN'}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </Magnetic>
      ) : (
        <Magnetic>
          <button
            onClick={handleAction}
            className={clsx(
              'w-full flex items-center justify-center gap-2 px-5 py-3 font-mono text-[11px] tracking-[0.15em] rounded-full transition-all',
              copied
                ? `${bgColors[accent]} ${borderColors[accent]} ${accentColors[accent]}`
                : 'bg-white/5 border-white/10 text-chrome hover:border-accent/50 hover:bg-white/10'
            )}
            data-cursor-hover
            aria-label={copied ? 'Copied to clipboard' : `Copy ${handle}`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                COPIED
              </>
            ) : action === 'copy' ? (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                COPY
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                OPEN
              </>
            )}
            </button>
        </Magnetic>
      )}

      {/* HUD corners */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="hud-corner hud-corner-tl top-0 left-0" />
        <div className="hud-corner hud-corner-tr top-0 right-0" />
        <div className="hud-corner hud-corner-bl bottom-0 left-0" />
        <div className="hud-corner hud-corner-br bottom-0 right-0" />
      </div>
    </motion.div>
  );
}

function ComingSoonCard() {
  return (
    <motion.div
      className="relative p-6 md:p-8 bg-panel/30 backdrop-blur border border-white/5 rounded-2xl border-dashed"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-mist/50" aria-hidden="true" />
        </div>
        <div>
          <span className="font-mono text-[10px] text-mist/50 tracking-[0.2em] block">NEXT CHANNEL</span>
          <span className="font-display font-medium text-chrome/50">COMING SOON</span>
        </div>
      </div>
      <p className="font-mono text-[10px] text-mist/40 tracking-[0.15em]">
        ONLY REAL, VERIFIED LINKS GET ADDED HERE. THE SYSTEM IS READY.
      </p>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="hud-corner hud-corner-tl top-0 left-0 border-mist/20" />
        <div className="hud-corner hud-corner-tr top-0 right-0 border-mist/20" />
        <div className="hud-corner hud-corner-bl bottom-0 left-0 border-mist/20" />
        <div className="hud-corner hud-corner-br bottom-0 right-0 border-mist/20" />
      </div>
    </motion.div>
  );
}

export function Connect() {
  return (
    <section id="connect" className="relative py-28 md:py-36" aria-labelledby="connect-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          index="04"
          label="SIGNAL"
          title="CONNECT WITH PARTYBAE"
          id="connect-heading"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {SITE.socialLinks.map((link) => (
            <SocialLinkCard key={link.name} {...link} />
          ))}
          <ComingSoonCard />
        </div>
      </div>
    </section>
  );
}