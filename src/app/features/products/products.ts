import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { BasketService } from '../../core/services/basket.service';
import { CATEGORY_MAP } from '../../data/products.data';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  imports: [MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatSnackBarModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private route = inject(ActivatedRoute);
  private basket = inject(BasketService);
  private snackBar = inject(MatSnackBar);

  categoryTitle = signal('');
  products = signal<Product[]>([]);
  selectedAmounts: Record<number, number> = {};

  weightOptions = [250, 500, 1000, 2000];
  unitOptions = [1, 2, 3, 4];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('category') ?? '';
      const data = CATEGORY_MAP[cat];
      if (data) {
        this.categoryTitle.set(data.title);
        this.products.set(data.products);
        this.selectedAmounts = {};
        data.products.forEach(p => {
          this.selectedAmounts[p.id] = p.priceType === 0 ? 250 : 1;
        });
      }
    });
  }

  addToCart(product: Product) {
    const amount = this.selectedAmounts[product.id];
    this.basket.addProduct(product, amount);
    const label = product.priceType === 0 ? `${amount}ג'` : `${amount} יח'`;
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
