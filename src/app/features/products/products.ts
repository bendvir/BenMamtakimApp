import { Component, inject, signal, computed, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BasketService } from '../../core/services/basket.service';
import { ProductService } from '../../core/services/product.service';
import { CATEGORY_MAP } from '../../data/products.data';
import { Product } from '../../models/product.model';
import { MagnifierDirective } from '../../shared/directives/magnifier.directive';

@Component({
  selector: 'app-products',
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule, MagnifierDirective],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private route        = inject(ActivatedRoute);
  private basket       = inject(BasketService);
  private snackBar     = inject(MatSnackBar);
  private productSvc   = inject(ProductService);

  readonly categoryId = signal('');

  // Reacts automatically when API data arrives OR category changes
  readonly categoryData = computed(() => {
    const cat = this.categoryId();
    const apiProducts = this.productSvc.getCategoryProducts(cat);
    if (apiProducts.length > 0) {
      return { title: this.productSvc.getCategoryTitle(cat), products: apiProducts };
    }
    // Fallback to static data while backend is loading or unavailable
    return CATEGORY_MAP[cat] ?? { title: '', products: [] };
  });

  readonly categoryTitle = computed(() => this.categoryData().title);
  readonly products      = computed(() => this.categoryData().products);
  readonly isLoading     = computed(() =>
    this.productSvc.loading() && this.products().length === 0
  );

  selectedAmounts: Record<number, number> = {};
  weightOptions = [250, 500, 1000, 2000];
  unitOptions   = [1, 2, 3, 4];

  // Lightbox
  lightboxImg  = signal<string | null>(null);
  lightboxTitle = signal<string>('');

  openLightbox(product: { link: string; title: string }) {
    this.lightboxImg.set(product.link);
    this.lightboxTitle.set(product.title);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxImg.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape() { this.closeLightbox(); }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category') ?? '';
      this.categoryId.set(cat);
      this.initAmounts();
    });
  }

  private initAmounts() {
    this.selectedAmounts = {};
    this.products().forEach(p => {
      this.selectedAmounts[p.id] = p.priceType === 0 ? 250 : 1;
    });
  }

  selectAmount(product: Product, amount: number) {
    this.selectedAmounts[product.id] = amount;
  }

  changeUnitAmount(product: Product, delta: number) {
    const current = this.selectedAmounts[product.id] ?? 1;
    this.selectedAmounts[product.id] = Math.max(1, Math.min(999, current + delta));
  }

  onUnitInput(product: Product, event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (Number.isInteger(val) && val >= 1 && val <= 999) {
      this.selectedAmounts[product.id] = val;
    }
  }

  addToCart(product: Product) {
    const amount = this.selectedAmounts[product.id];
    this.basket.addProduct(product, amount);
    const label = product.priceType === 0
      ? (amount < 1000 ? `${amount}ג'` : `${amount / 1000}ק"ג`)
      : `${amount} יח'`;
    this.snackBar.open(`${product.title} (${label}) נוסף לסל!`, 'סגור', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  calcPrice(product: Product): number {
    const amount = this.selectedAmounts[product.id] ?? (product.priceType === 0 ? 250 : 1);
    return product.priceType === 0
      ? Math.round((product.price * amount) / 1000 * 100) / 100
      : product.price * amount;
  }
}
