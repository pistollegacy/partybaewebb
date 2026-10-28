'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useScroll, useTransform, motion } from 'motion/react';

export function BackgroundFX() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const hue = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.5';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    let raf: number;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number; size: number;
      hue: number; alpha: number; baseX: number; baseY: number;
    }> = [];

    function resize() {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 80000));
    for (let i = 0; i < count; i++) {
      const hueVal = Math.random() < 0.02 ? 100 : (Math.random() < 0.5 ? 280 : 330);
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.1 - Math.random() * 0.25,
        size: 0.5 + Math.random() * 1.5,
        hue: hueVal,
        alpha: 0.1 + Math.random() * 0.3,
        baseX: 0,
        baseY: 0,
      });
    }

    let lastScrollY = window.scrollY;
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scrollDelta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      const boost = Math.min(Math.abs(scrollDelta) * 0.02, 1.5);

      const targetX = mouse.x * canvas.width;
      const targetY = mouse.y * canvas.height;

      for (const p of particles) {
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 400) * 0.02;

        p.vx += (dx / (dist || 1)) * influence;
        p.vy += (dy / (dist || 1)) * influence;
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy - (scrollDelta > 0 ? boost : 0);

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * devicePixelRatio * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${p.alpha})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 90%, 65%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * devicePixelRatio * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.remove();
    };
  }, [reduced, mouse.x, mouse.y]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 15% 15%, rgba(168, 85, 247, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 45% at 85% 85%, rgba(255, 45, 155, 0.1) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(200, 255, 46, 0.04) 0%, transparent 50%)
          `,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          filter: `hue-rotate(${hue}deg)`,
          background: `
            radial-gradient(ellipse 50% 35% at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(168, 85, 247, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at ${(1 - mouse.x) * 100}% ${(1 - mouse.y) * 100}%, rgba(255, 45, 155, 0.12) 0%, transparent 50%)
          `,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255, 45, 155, 0.06) 0%, transparent 35%)
          `,
        }}
      />
      {/* Mouse-reactive glow */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(255, 45, 155, 0.06) 0%, transparent 30%),
            radial-gradient(circle at ${(1 - mouse.x) * 100}% ${(1 - mouse.y) * 100}%, rgba(168, 85, 247, 0.05) 0%, transparent 25%)
          `,
        }}
      />
    </>
  );
}