import type { Metadata, Viewport } from 'next';
import { Unbounded, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { NoiseOverlay } from '@/components/noise-overlay';
import { Vignette } from '@/components/vignette';

const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-unbounded',
  display: 'swap',
  weight: ['400', '500', '700', '800'],
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jbmono',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://partybae.vercel.app'),
  title: {
    default: 'PARTYBAE — Hyperpop Artist // Digital Chaos',
    template: '%s — PARTYBAE',
  },
  description: 'The official home of PARTYBAE — hyperpop artist from Eugene, Oregon. Stream the full verified SoundCloud catalog, explore the digital chaos, and catch me on PlayStation as TOKYO-_-OCCULT.',
  keywords: ['PARTYBAE', 'hyperpop', 'SoundCloud', 'digital chaos', 'music', 'TOKYO-_-OCCULT', 'experimental', 'underground'],
  authors: [{ name: 'PARTYBAE' }],
  creator: 'PARTYBAE',
  publisher: 'PARTYBAE',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'PARTYBAE',
    title: 'PARTYBAE — Hyperpop Artist // Digital Chaos',
    description: 'The official home of PARTYBAE — hyperpop artist from Eugene, Oregon. Stream the full verified SoundCloud catalog, explore the digital chaos.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'PARTYBAE — Hyperpop Artist // Digital Chaos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PARTYBAE — Hyperpop Artist // Digital Chaos',
    description: 'The official home of PARTYBAE — hyperpop artist from Eugene, Oregon. Stream the full verified SoundCloud catalog.',
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  themeColor: '#05010a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${unbounded.variable} ${grotesk.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="preconnect" href="https://w.soundcloud.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i1.sndcdn.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-void text-white font-body antialiased">
        <NoiseOverlay />
        <Vignette />
        {children}
      </body>
    </html>
  );
}