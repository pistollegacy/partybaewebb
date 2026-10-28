interface SCWidget {
  play(): void;
  pause(): void;
  toggle(): void;
  getCurrentSound(callback: (sound: { title: string; permalink_url: string } | null) => void): void;
  bind(eventName: string, callback: () => void): void;
  unbind(eventName: string): void;
  isPaused(callback: (paused: boolean) => void): void;
  getVolume(callback: (volume: number) => void): void;
  setVolume(volume: number): void;
  getDuration(callback: (duration: number) => void): void;
  getPosition(callback: (position: number) => void): void;
  seekTo(position: number): void;
  getSoundUrl(callback: (url: string) => void): void;
}

interface SCWidgetEvents {
  LOAD_PROGRESS: 'loadProgress';
  PLAY_PROGRESS: 'playProgress';
  PLAY: 'play';
  PAUSE: 'pause';
  FINISH: 'finish';
  SEEK: 'seek';
  READY: 'ready';
  ERROR: 'error';
}

interface Window {
  SC?: {
    Widget: (element: HTMLIFrameElement) => SCWidget;
    WidgetEvents?: SCWidgetEvents;
  };
}