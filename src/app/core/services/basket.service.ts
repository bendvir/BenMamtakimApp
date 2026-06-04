import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((sum, item) => sum + item.amount, 0)
  );

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, item) => sum + item.pricePerUnit, 0)
  );

  addProduct(product: Product, amount: number): void {
    const pricePerUnit = product.priceType === 0
      ? (product.price * amount) / 1000
      : product.price * amount;

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
        const pricePerUnit = item.priceType === 0
          ? (item.price * amount) / 1000
          : item.price * amount;
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
