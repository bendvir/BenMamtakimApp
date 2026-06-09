import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BasketService } from '../../core/services/basket.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe, RouterLink, MatIconModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  basket = inject(BasketService);

  private weightOptions = [250, 500, 1000, 2000];

  increaseAmount(item: CartItem): void {
    if (item.priceType === 0) {
      const idx = this.weightOptions.indexOf(item.amount);
      if (idx < this.weightOptions.length - 1)
        this.basket.updateAmount(item.id, this.weightOptions[idx + 1]);
    } else {
      if (item.amount < 10) this.basket.updateAmount(item.id, item.amount + 1);
    }
  }

  decreaseAmount(item: CartItem): void {
    if (item.priceType === 0) {
      const idx = this.weightOptions.indexOf(item.amount);
      if (idx > 0) this.basket.updateAmount(item.id, this.weightOptions[idx - 1]);
    } else {
      if (item.amount > 1) this.basket.updateAmount(item.id, item.amount - 1);
    }
  }

  isMinAmount(item: CartItem): boolean {
    return item.priceType === 0
      ? this.weightOptions.indexOf(item.amount) === 0
      : item.amount <= 1;
  }

  isMaxAmount(item: CartItem): boolean {
    return item.priceType === 0
      ? this.weightOptions.indexOf(item.amount) === this.weightOptions.length - 1
      : item.amount >= 10;
  }

  formatAmount(item: CartItem): string {
    if (item.priceType === 0) {
      return item.amount < 1000 ? `${item.amount} גרם` : `${item.amount / 1000} ק"ג`;
    }
    return `${item.amount} יח'`;
  }

  remove(productId: number): void {
    this.basket.removeProduct(productId);
  }
}
