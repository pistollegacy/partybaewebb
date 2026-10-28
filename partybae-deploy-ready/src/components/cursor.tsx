'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hoverType, setHoverType] = useState<'default' | 'play' | 'explore' | 'view'>('default');

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const trailX = useMotionValue(0);
  const trailY = useMotionValue(0);
  const trail = useRef<Array<{ x: number; y: number }>>([]);

  const springX = useSpring(x, { stiffness: 400, damping: 40, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 400, damping: 40, mass: 0.6 });
  const trailSpringX = useSpring(trailX, { stiffness: 200, damping: 30 });
  const trailSpringY = useSpring(trailY, { stiffness: 200, damping: 30 });

  // Label position motion values
  const labelX = useMotionValue(0);
  const labelY = useMotionValue(0);
  const labelSpringX = useSpring(labelX, { stiffness: 300, damping: 30 });
  const labelSpringY = useSpring(labelY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersFine = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersFine || reducedMotion) return;

    document.documentElement.classList.add('has-custom-cursor');
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement;
      const isPlay = !!target.closest('[data-cursor-play]');
      const isExplore = !!target.closest('[data-cursor-explore]');
      const isView = !!target.closest('[data-cursor-view]');
      const isInteractive = !!target.closest('a, button, [data-cursor-hover], .magnetic');

      if (isPlay) setHoverType('play');
      else if (isExplore) setHoverType('explore');
      else if (isView) setHoverType('view');
      else setHoverType('default');

      setHovering(isInteractive || isPlay || isExplore || isView);
    };

    const onMouseDown = () => setPressed(true);
    const onMouseUp = () => setPressed(false);
    const onLeave = () => {
      setVisible(false);
      setHovering(false);
      setHoverType('default');
    };
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    // Trail animation loop
    let raf: number;
    const updateTrail = () => {
      trail.current.push({ x: x.get(), y: y.get() });
      if (trail.current.length > 8) trail.current.shift();

      if (trail.current.length > 0) {
        const last = trail.current[trail.current.length - 1];
        trailX.set(last.x);
        trailY.set(last.y);
      }
      raf = requestAnimationFrame(updateTrail);
    };
    raf = requestAnimationFrame(updateTrail);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, [x, y]);

  // Update label position
  useEffect(() => {
    labelX.set(x.get() + 20);
    labelY.set(y.get() - 10);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Trail dots */}
      {trail.current.map((pos, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="fixed top-0 left-0 z-[95] pointer-events-none mix-blend-difference"
          style={{ x: pos.x, y: pos.y }}
          animate={{ opacity: (i + 1) / trail.current.length * 0.3, scale: (i + 1) / trail.current.length * 0.5 }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-acid/50" />
        </motion.div>
      ))}

      {/* Main cursor dot */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[100] pointer-events-none mix-blend-difference"
        style={{ x: springX, y: springY }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-acid transition-all duration-100" />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[99] pointer-events-none transition-opacity duration-200"
        style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}
        animate={{
          scale: hovering ? (hoverType === 'play' ? 3 : 2.5) : 1,
          borderColor: hoverType === 'play' ? 'rgba(200, 255, 46, 0.9)' :
                      hoverType === 'explore' ? 'rgba(255, 45, 155, 0.9)' :
                      hoverType === 'view' ? 'rgba(168, 85, 247, 0.9)' :
                      'rgba(216, 217, 232, 0.4)',
        }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-2 transition-all duration-200" />
      </motion.div>

      {/* Hover label */}
      {hovering && (
        <motion.div
          aria-hidden="true"
          className="fixed top-0 left-0 z-[101] pointer-events-none font-mono text-[10px] text-chrome/80 whitespace-nowrap"
          style={{ x: labelSpringX, y: labelSpringY }}
          animate={{ opacity: visible ? 1 : 0 }}
        >
          {hoverType === 'play' && 'PLAY'}
          {hoverType === 'explore' && 'EXPLORE'}
          {hoverType === 'view' && 'VIEW'}
          {hoverType === 'default' && ''}
        </motion.div>
      )}

      <style jsx global>{`
        .has-custom-cursor * {
          cursor: none !important;
        }
        .has-custom-cursor input,
        .has-custom-cursor textarea,
        .has-custom-cursor select {
          cursor: text !important;
        }
      `}</style>
    </>
  );
}