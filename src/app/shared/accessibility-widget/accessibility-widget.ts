import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccessibilityService, FontSize } from '../../core/services/accessibility.service';

@Component({
  selector: 'app-accessibility-widget',
  imports: [RouterLink],
  templateUrl: './accessibility-widget.html',
  styleUrl: './accessibility-widget.scss',
})
export class AccessibilityWidget {
  readonly a11y = inject(AccessibilityService);
  readonly panelOpen = signal(false);

  togglePanel() { this.panelOpen.update(v => !v); }

  setFontSize(size: FontSize) { this.a11y.setFontSize(size); }

  toggle(key: Parameters<AccessibilityService['toggle']>[0]) {
    this.a11y.toggle(key);
  }

  reset() { this.a11y.reset(); }
}
