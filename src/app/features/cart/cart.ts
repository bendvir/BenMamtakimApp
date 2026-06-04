import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { BasketService } from '../../core/services/basket.service';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe, RouterLink, MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  basket = inject(BasketService);

  weightOptions = [250, 500, 1000, 2000];
  unitOptions = [1, 2, 3, 4];

  updateAmount(productId: number, amount: number) {
    this.basket.updateAmount(productId, amount);
  }

  remove(productId: number) {
    this.basket.removeProduct(productId);
  }

  labelForAmount(priceType: 0 | 1, amount: number): string {
    if (priceType === 0) return amount < 1000 ? `${amount}ג'` : `${amount / 1000}ק"ג`;
    return `${amount} יח'`;
  }
}
