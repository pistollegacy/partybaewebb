'use client';

export interface PlayerState {
  trackTitle: string;
  trackUrl: string;
  isPlaying: boolean;
  canControl: boolean;
}

type Listener = () => void;

let state: PlayerState | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): PlayerState | null {
  return state;
}

export function getServerSnapshot(): null {
  return null;
}

export function setPlayerState(next: PlayerState | null) {
  state = next;
  emit();
}

export function patchPlayerState(patch: Partial<PlayerState>) {
  if (!state) return;
  state = { ...state, ...patch };
  emit();
}

// Widget registry
interface SCWidget {
  play(): void;
  pause(): void;
  toggle(): void;
  getCurrentSound(callback: (sound: { title: string; permalink_url: string } | null) => void): void;
  bind(eventName: string, callback: () => void): void;
  unbind(eventName: string): void;
  setVolume(volume: number): void;
}

const widgets = new Map<string, SCWidget>();

export function registerWidget(key: string, widget: SCWidget) {
  widgets.set(key, widget);
  if (key === 'featured' || key === 'profile') {
    // Store reference for floating controller
    (window as any).__SC_ACTIVE_WIDGET__ = widget;
  }
  widget.bind('PLAY', () => {
    if (widgets.get('active') !== widget) {
      widgets.set('active', widget);
      (window as any).__SC_ACTIVE_WIDGET__ = widget;
    }
    widget.getCurrentSound((sound) => {
      if (sound) {
        setPlayerState({
          trackTitle: sound.title,
          trackUrl: sound.permalink_url,
          isPlaying: true,
          canControl: true,
        });
      }
    });
  });
  widget.bind('PAUSE', () => {
    if (widgets.get('active') === widget) {
      patchPlayerState({ isPlaying: false });
    }
  });
  widget.bind('FINISH', () => {
    if (widgets.get('active') === widget) {
      patchPlayerState({ isPlaying: false });
    }
  });
}

export function unregisterWidget(key: string) {
  const widget = widgets.get(key);
  if (widget) {
    widget.unbind('PLAY');
    widget.unbind('PAUSE');
    widget.unbind('FINISH');
    widgets.delete(key);
    if (widgets.get('active') === widget) {
      widgets.delete('active');
      if ((window as any).__SC_ACTIVE_WIDGET__ === widget) {
        (window as any).__SC_ACTIVE_WIDGET__ = null;
      }
      setPlayerState(null);
    }
  }
}

export function toggleActiveWidget() {
  const active = widgets.get('active');
  active?.toggle();
}