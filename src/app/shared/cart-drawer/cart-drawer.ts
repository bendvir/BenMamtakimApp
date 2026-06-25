import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BasketService } from '../../core/services/basket.service';
import { CartDrawerService } from '../../core/services/cart-drawer.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart-drawer',
  imports: [RouterLink],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
})
export class CartDrawer {
  readonly basket = inject(BasketService);
  readonly drawer = inject(CartDrawerService);

  readonly weightOptions = [250, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

  close() { this.drawer.close(); }

  weightLabel(grams: number): string {
    return grams < 1000 ? `${grams} גרם` : `${grams / 1000} ק"ג`;
  }

  amountLabel(item: CartItem): string {
    if (item.priceType === 0) return this.weightLabel(item.amount);
    return `${item.amount} יח'`;
  }

  onWeightSelect(item: CartItem, event: Event) {
    this.basket.updateAmount(item.id, Number((event.target as HTMLSelectElement).value));
  }

  changeUnits(item: CartItem, delta: number) {
    const next = Math.max(1, Math.min(999, item.amount + delta));
    this.basket.updateAmount(item.id, next);
  }

  remove(item: CartItem) {
    this.basket.removeProduct(item.id);
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace(/\.00$/, '');
  }
}
