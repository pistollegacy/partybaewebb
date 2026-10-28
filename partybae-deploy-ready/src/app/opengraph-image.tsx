import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'PARTYBAE — Hyperpop Artist // Digital Chaos';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: '#05010a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient blobs */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: `
              radial-gradient(ellipse 60% 50% at 20% 10%, rgba(168, 85, 247, 0.25) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 80% 90%, rgba(255, 45, 155, 0.2) 0%, transparent 55%)
            `,
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
          {/* Equalizer bars */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 32,
              alignItems: 'flex-end',
              height: 80,
            }}
          >
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  width: 8,
                  borderRadius: 2,
                  background: `linear-gradient(180deg, #a855f7, #ff2d9b ${i % 3 === 0 ? 50 : 100}%, #c8ff2e)`,
                  opacity: 0.6 + (i % 4) * 0.1,
                  height: `${20 + (i * 7) % 60}px`,
                }}
              />
            ))}
          </div>

          {/* Chromatic title — layered for RGB split */}
          <div style={{ position: 'relative', lineHeight: 1, display: 'flex' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                fontSize: 180,
                fontWeight: 800,
                color: '#ff2d9b',
                transform: 'translate(-4px, 3px)',
                opacity: 0.8,
                pointerEvents: 'none',
              }}
            >
              PARTYBAE
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                fontSize: 180,
                fontWeight: 800,
                color: '#c8ff2e',
                transform: 'translate(4px, -3px)',
                opacity: 0.8,
                pointerEvents: 'none',
              }}
            >
              PARTYBAE
            </div>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                fontSize: 180,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-4px',
              }}
            >
              PARTYBAE
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: 'flex',
              marginTop: 120,
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#a855f7',
              textShadow: '0 0 30px rgba(168,85,247,0.6)',
            }}
          >
            HYPERPOP ARTIST  //  DIGITAL CHAOS
          </div>

          {/* Bottom tag */}
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              left: 80,
              right: 80,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: '0.2em',
              color: '#9d9ab4',
              fontFamily: 'monospace',
            }}
          >
            <span style={{ display: 'flex' }}>SOUNDCLOUD.COM/PARTYBAE</span>
            <span style={{ display: 'flex' }}>WELCOME TO MY WORLD</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}