import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product.model';

export interface ApiCategory {
  id: string;
  name_he: string;
  sort_order: number;
  products: Product[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  readonly categories = signal<ApiCategory[]>([]);
  readonly loading    = signal(false);
  readonly lastSync   = signal<Date | null>(null);
  readonly error      = signal<string | null>(null);

  readonly allCategories = computed(() => this.categories());

  constructor() {
    // Start polling immediately, then every syncIntervalMs
    timer(0, environment.syncIntervalMs).pipe(
      switchMap(() => {
        this.loading.set(true);
        this.error.set(null);
        return this.http.get<ApiCategory[]>(`${environment.apiUrl}/products`).pipe(
          catchError(err => {
            console.warn('[ProductService] Backend unavailable:', err.message);
            this.error.set('לא ניתן להתחבר לשרת');
            return of(null);
          })
        );
      })
    ).subscribe(data => {
      this.loading.set(false);
      if (data) {
        this.categories.set(data);
        this.lastSync.set(new Date());
      }
    });
  }

  getCategoryProducts(categoryId: string): Product[] {
    return this.categories().find(c => c.id === categoryId)?.products ?? [];
  }

  getCategoryTitle(categoryId: string): string {
    return this.categories().find(c => c.id === categoryId)?.name_he ?? '';
  }
}
