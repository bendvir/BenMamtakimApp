import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminProduct {
  id: number;
  title: string;
  price: number;
  price_type: 0 | 1;
  category_id: string;
  category_name: string;
  image_url: string;
  description: string;
  in_stock: number;
  created_at: string;
  updated_at: string;
}

export interface AdminCategory {
  id: string;
  name_he: string;
  sort_order: number;
}

export interface ImageSearchResult {
  name:     string;
  brand:    string;
  imageUrl: string;
  thumbUrl: string;
}

export interface ProductPayload {
  title: string;
  price: number;
  priceType: 0 | 1;
  categoryId: string;
  imageUrl: string;
  description: string;
  inStock: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  private _token = signal<string | null>(localStorage.getItem('admin_token'));
  readonly isLoggedIn = computed(() => this._token() !== null);

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this._token()}` });
  }

  /** Step 1 — password check; returns sessionId for OTP step */
  requestOtp(password: string): Observable<{ step: string; sessionId: string }> {
    return this.http.post<{ step: string; sessionId: string }>(
      `${environment.apiUrl}/admin/login`,
      { password }
    );
  }

  /** Step 2 — OTP code verification; returns JWT token */
  verifyOtp(sessionId: string, code: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/admin/verify-otp`,
      { sessionId, code }
    ).pipe(
      tap(res => {
        localStorage.setItem('admin_token', res.token);
        this._token.set(res.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    this._token.set(null);
  }

  getCategories(): Observable<AdminCategory[]> {
    return this.http.get<AdminCategory[]>(`${environment.apiUrl}/admin/categories`, { headers: this.headers() });
  }

  getProducts(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(`${environment.apiUrl}/admin/products`, { headers: this.headers() });
  }

  createProduct(data: ProductPayload): Observable<{ id: number; message: string }> {
    return this.http.post<{ id: number; message: string }>(`${environment.apiUrl}/admin/products`, data, { headers: this.headers() });
  }

  updateProduct(id: number, data: ProductPayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${environment.apiUrl}/admin/products/${id}`, data, { headers: this.headers() });
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/admin/products/${id}`, { headers: this.headers() });
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<{ imageUrl: string }>(`${environment.apiUrl}/admin/upload`, form, { headers: this.headers() });
  }

  searchProductImage(query: string): Observable<ImageSearchResult[]> {
    const url = `https://world.openfoodfacts.net/api/v2/search?q=${encodeURIComponent(query)}&sort_by=unique_scans_n&page_size=24&fields=product_name,brands,image_front_url,image_front_small_url,image_url`;
    return this.http.get<any>(url).pipe(
      map((data: any) =>
        ((data.products as any[]) || [])
          .filter((p: any) => p.image_front_url || p.image_url)
          .slice(0, 9)
          .map((p: any) => ({
            name:     p.product_name || '',
            brand:    p.brands       || '',
            imageUrl: p.image_front_url || p.image_url,
            thumbUrl: p.image_front_small_url || p.image_front_url || p.image_url,
          }))
      )
    );
  }

  patchProductImage(id: number, imageUrl: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${environment.apiUrl}/admin/products/${id}/image`,
      { imageUrl },
      { headers: this.headers() }
    );
  }
}
