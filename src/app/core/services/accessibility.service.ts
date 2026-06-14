import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type FontSize = 'normal' | 'large' | 'xlarge';

export interface A11yState {
  fontSize: FontSize;
  highContrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  stopAnimations: boolean;
  readableFont: boolean;
}

const DEFAULTS: A11yState = {
  fontSize: 'normal',
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  stopAnimations: false,
  readableFont: false,
};

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private platformId = inject(PLATFORM_ID);
  readonly state = signal<A11yState>({ ...DEFAULTS });

  constructor() {
    this.load();
    this.apply();
  }

  private load() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const raw = localStorage.getItem('a11y-prefs');
      if (raw) this.state.set({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* ignore parse errors */ }
  }

  private save() {
    if (!isPlatformBrowser(this.platformId)) return;
    try { localStorage.setItem('a11y-prefs', JSON.stringify(this.state())); } catch { /* ignore */ }
  }

  private apply() {
    if (!isPlatformBrowser(this.platformId)) return;
    const html = document.documentElement;
    const s = this.state();

    html.classList.remove('a11y-font-lg', 'a11y-font-xl');
    if (s.fontSize === 'large')  html.classList.add('a11y-font-lg');
    if (s.fontSize === 'xlarge') html.classList.add('a11y-font-xl');

    html.classList.toggle('a11y-contrast',  s.highContrast);
    html.classList.toggle('a11y-grayscale', s.grayscale);
    html.classList.toggle('a11y-links',     s.underlineLinks);
    html.classList.toggle('a11y-no-anim',   s.stopAnimations);
    html.classList.toggle('a11y-readable',  s.readableFont);
  }

  setFontSize(size: FontSize) {
    this.state.update(s => ({ ...s, fontSize: size }));
    this.apply();
    this.save();
  }

  toggle(key: keyof Omit<A11yState, 'fontSize'>) {
    this.state.update(s => ({ ...s, [key]: !s[key] }));
    this.apply();
    this.save();
  }

  reset() {
    this.state.set({ ...DEFAULTS });
    this.apply();
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem('a11y-prefs');
  }
}
