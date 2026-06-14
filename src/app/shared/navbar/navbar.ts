import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BasketService } from '../../core/services/basket.service';
import { ProductService } from '../../core/services/product.service';
import { CartDrawerService } from '../../core/services/cart-drawer.service';

interface SearchResult {
  id: number;
  title: string;
  category: string;
  categoryName: string;
  price: number;
  priceType: 0 | 1;
}

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink, RouterLinkActive,
    MatButtonModule, MatIconModule, MatBadgeModule, MatMenuModule,
    MatAutocompleteModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private router     = inject(Router);
  basket             = inject(BasketService);
  private productSvc = inject(ProductService);
  readonly cartDrawer = inject(CartDrawerService);

  mobileMenuOpen = signal(false);
  searchQuery    = signal('');
  searchOpen     = signal(false);

  readonly searchResults = computed((): SearchResult[] => {
    const q = this.searchQuery().trim().toLowerCase();
    if (q.length < 2) return [];
    return this.productSvc.categories()
      .flatMap(c => c.products.map(p => ({
        id:           p.id,
        title:        p.title,
        category:     c.id,
        categoryName: c.name_he,
        price:        p.price,
        priceType:    p.priceType,
      })))
      .filter(p => p.title.toLowerCase().includes(q))
      .slice(0, 8);
  });

  onSearchInput(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onSearchSelect(event: MatAutocompleteSelectedEvent) {
    const p: SearchResult = event.option.value;
    this.router.navigate(['/products', p.category]);
    this.searchQuery.set('');
    this.searchOpen.set(false);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  toggleSearch() {
    this.searchOpen.update(v => !v);
    if (!this.searchOpen()) this.searchQuery.set('');
  }

  openCart(event: Event) {
    event.preventDefault();
    this.cartDrawer.toggle();
    this.mobileMenuOpen.set(false);
  }

  toggleMenu() { this.mobileMenuOpen.update(v => !v); }
  closeMenu()  { this.mobileMenuOpen.set(false); }

  priceLabel(p: SearchResult): string {
    return p.priceType === 0 ? `₪${p.price}/ק"ג` : `₪${p.price}`;
  }
}
