import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly totalItems = computed(() => this._items().length);

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, item) => sum + item.pricePerUnit, 0)
  );

  readonly totalSavings = computed(() =>
    this._items().reduce((sum, item) => {
      if (item.priceType === 1 && (item.promoQty ?? 0) > 0 && (item.promoPrice ?? 0) > 0 && item.amount >= item.promoQty!) {
        const regular = item.price * item.amount;
        const promo   = this.calcUnitPrice(item, item.amount);
        sum += Math.max(0, regular - promo);
      }
      return sum;
    }, 0)
  );

  private calcUnitPrice(product: Pick<Product, 'price' | 'promoQty' | 'promoPrice'>, amount: number): number {
    const qty   = product.promoQty   ?? 0;
    const price = product.promoPrice ?? 0;
    if (qty > 0 && price > 0 && amount >= qty) {
      const sets      = Math.floor(amount / qty);
      const remainder = amount % qty;
      return sets * price + remainder * product.price;
    }
    return product.price * amount;
  }

  private calcItemPrice(product: Product | CartItem, amount: number): number {
    if (product.priceType === 0) {
      return (product.price * amount) / 1000;
    }
    return this.calcUnitPrice(product, amount);
  }

  addProduct(product: Product, amount: number): void {
    const pricePerUnit = this.calcItemPrice(product, amount);

    this._items.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i =>
          i.id === product.id ? { ...i, amount, pricePerUnit } : i
        );
      }
      return [...items, { ...product, amount, pricePerUnit }];
    });
  }

  updateAmount(productId: number, amount: number): void {
    this._items.update(items =>
      items.map(item => {
        if (item.id !== productId) return item;
        const pricePerUnit = this.calcItemPrice(item, amount);
        return { ...item, amount, pricePerUnit };
      })
    );
  }

  removeProduct(productId: number): void {
    this._items.update(items => items.filter(i => i.id !== productId));
  }

  clearCart(): void {
    this._items.set([]);
  }
}
