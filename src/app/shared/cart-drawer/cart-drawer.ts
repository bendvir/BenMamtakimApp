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

  close() { this.drawer.close(); }

  amountLabel(item: CartItem): string {
    if (item.priceType === 0) return this.kgDisplay(item.amount);
    return `${item.amount} יח'`;
  }

  kgDisplay(grams: number): string {
    const kg = grams / 1000;
    return (kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(1)) + ' ק"ג';
  }

  changeKg(item: CartItem, delta: number) {
    const next = Math.max(500, Math.min(10000, item.amount + delta));
    this.basket.updateAmount(item.id, next);
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
