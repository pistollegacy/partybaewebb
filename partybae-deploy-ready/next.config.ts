import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.sndcdn.com' },
      { protocol: 'https', hostname: 'i1.sndcdn.com' },
    ],
  },
  poweredByHeader: false,
}

export default nextConfig