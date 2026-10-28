export const SITE = {
  name: 'PARTYBAE',
  tagline: 'HYPERPOP ARTIST // DIGITAL CHAOS',
  description: 'The official home of PARTYBAE — hyperpop artist from Eugene, Oregon. Stream the full verified SoundCloud catalog, explore the digital chaos, and catch me on PlayStation as TOKYO-_-OCCULT.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://partybae.vercel.app',
  ogImage: '/opengraph-image.png',
  location: 'EUGENE, OREGON // US',
  soundcloud: {
    username: 'partybae',
    userId: 643183869,
    profileUrl: 'https://soundcloud.com/partybae',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Fusers%2F643183869&color=%23ff2d9b&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false',
    visualEmbedUrl: 'https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Fusers%2F643183869&color=%23ff2d9b&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true',
  },
  playstation: {
    psnId: 'TOKYO-_-OCCULT',
    profileUrl: 'https://profile.playstation.net/TOKYO-_-OCCULT',
  },
  bio: {
    quote: 'Just for fun  (The King Of Hyperpop dY``)',
    firstPerson: `Yo, I'm PARTYBAE. I'm 28 years old and I make hyperpop music. Welcome to my world of digital chaos, distorted sounds, and experimental energy. Music is where I get to be myself, break the rules, and create whatever I feel. Turn it up, explore my tracks, and enjoy the ride.`,
  },
  identity: {
    age: 28,
    genre: 'HYPERPOP',
    artist: 'PARTYBAE',
    status: 'CREATING CHAOS',
  },
  marqueePhrases: [
    'PARTYBAE',
    'HYPERPOP',
    'DIGITAL CHAOS',
    'TURN IT UP',
    'TOKYO-_-OCCULT',
    'WELCOME TO MY WORLD',
    'EST. 28',
    'SIGNAL FOUND',
  ],
  navItems: [
    { label: 'MUSIC', href: '#music', num: '01' },
    { label: 'ABOUT', href: '#about', num: '02' },
    { label: 'PLAYSTATION', href: '#psn', num: '03' },
    { label: 'CONNECT', href: '#connect', num: '04' },
  ],
  socialLinks: [
    {
      name: 'SOUNDCLOUD',
      handle: '@partybae',
      href: 'https://soundcloud.com/partybae',
      icon: 'soundcloud',
      accent: 'bae',
      note: 'OFFICIAL — ALL TRACKS + LIVE UPLOADS',
    },
    {
      name: 'PLAYSTATION',
      handle: 'TOKYO-_-OCCULT',
      action: 'copy',
      value: 'TOKYO-_-OCCULT',
      icon: 'gamepad',
      accent: 'pulse',
      note: 'COPY PSN ID TO ADD ME',
    },
  ],
} as const;

export const PS_SHAPES = {
  triangle: { color: '#2ECC71', label: '△' },
  circle: { color: '#FF4655', label: '○' },
  cross: { color: '#3B8EF0', label: '✕' },
  square: { color: '#FF2D9B', label: '□' },
} as const;

export const PS_COLORS = {
  triangle: '#2ECC71',
  circle: '#FF4655',
  cross: '#3B8EF0',
  square: '#FF2D9B',
} as const;