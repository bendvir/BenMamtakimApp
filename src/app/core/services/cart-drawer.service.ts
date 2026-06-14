import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CartDrawerService {
  private platformId = inject(PLATFORM_ID);
  readonly isOpen = signal(false);

  open() {
    this.isOpen.set(true);
    if (isPlatformBrowser(this.platformId)) document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen.set(false);
    if (isPlatformBrowser(this.platformId)) document.body.style.overflow = '';
  }

  toggle() { this.isOpen() ? this.close() : this.open(); }
}
