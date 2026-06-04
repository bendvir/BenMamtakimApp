import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { BasketService } from '../../core/services/basket.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatBadgeModule, MatMenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  basket = inject(BasketService);
  mobileMenuOpen = signal(false);

  toggleMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.mobileMenuOpen.set(false);
  }
}
