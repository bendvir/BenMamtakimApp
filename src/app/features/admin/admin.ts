import { Component, inject, signal, OnInit } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService, AdminProduct, AdminCategory } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin',
  imports: [
    SlicePipe,
    ReactiveFormsModule,
    MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatSlideToggleModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private fb        = inject(FormBuilder);
  private snackBar  = inject(MatSnackBar);
  readonly adminSvc = inject(AdminService);

  readonly products   = signal<AdminProduct[]>([]);
  readonly categories = signal<AdminCategory[]>([]);
  readonly editingId  = signal<number | null>(null);
  readonly saving     = signal(false);
  readonly loadError  = signal<string | null>(null);

  // ── LOGIN FORM ──────────────────────────────────────────────────────────────
  loginForm = this.fb.group({ password: ['', Validators.required] });
  loginError = signal<string | null>(null);

  // ── PRODUCT FORM ────────────────────────────────────────────────────────────
  productForm = this.fb.group({
    title:       ['', Validators.required],
    price:       [0,  [Validators.required, Validators.min(0.01)]],
    priceType:   [0 as 0 | 1],
    categoryId:  ['', Validators.required],
    imageUrl:    [''],
    description: [''],
    inStock:     [true],
  });

  ngOnInit() {
    if (this.adminSvc.isLoggedIn()) this.loadData();
  }

  // ── AUTH ────────────────────────────────────────────────────────────────────
  login() {
    if (this.loginForm.invalid) return;
    const { password } = this.loginForm.value;
    this.adminSvc.login(password!).subscribe({
      next: () => { this.loginError.set(null); this.loadData(); },
      error: () => this.loginError.set('סיסמה שגויה — נסה שנית'),
    });
  }

  logout() {
    this.adminSvc.logout();
    this.products.set([]);
    this.resetForm();
  }

  // ── DATA ────────────────────────────────────────────────────────────────────
  private loadData() {
    this.adminSvc.getCategories().subscribe({
      next: cats => this.categories.set(cats),
      error: () => this.loadError.set('שגיאה בטעינת קטגוריות'),
    });
    this.adminSvc.getProducts().subscribe({
      next: prods => this.products.set(prods),
      error: () => this.loadError.set('שגיאה בטעינת מוצרים'),
    });
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  editProduct(p: AdminProduct) {
    this.editingId.set(p.id);
    this.productForm.patchValue({
      title:       p.title,
      price:       p.price,
      priceType:   p.price_type,
      categoryId:  p.category_id,
      imageUrl:    p.image_url,
      description: p.description,
      inStock:     p.in_stock === 1,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() { this.resetForm(); }

  saveProduct() {
    if (this.productForm.invalid) { this.productForm.markAllAsTouched(); return; }
    this.saving.set(true);
    const v = this.productForm.value;
    const payload = {
      title:       v.title!.trim(),
      price:       Number(v.price),
      priceType:   (v.priceType ?? 0) as 0 | 1,
      categoryId:  v.categoryId!,
      imageUrl:    v.imageUrl || '',
      description: v.description || '',
      inStock:     v.inStock !== false,
    };

    const op = this.editingId()
      ? this.adminSvc.updateProduct(this.editingId()!, payload)
      : this.adminSvc.createProduct(payload);

    op.subscribe({
      next: (res) => {
        this.saving.set(false);
        this.snackBar.open(res.message, '', { duration: 2500 });
        this.loadData();
        this.resetForm();
      },
      error: (err) => {
        this.saving.set(false);
        this.snackBar.open(err.error?.error ?? 'שגיאה בשמירה', '', { duration: 3000 });
      },
    });
  }

  deleteProduct(p: AdminProduct) {
    if (!confirm(`למחוק את "${p.title}"?`)) return;
    this.adminSvc.deleteProduct(p.id).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, '', { duration: 2000 });
        this.loadData();
        if (this.editingId() === p.id) this.resetForm();
      },
      error: () => this.snackBar.open('שגיאה במחיקה', '', { duration: 2500 }),
    });
  }

  private resetForm() {
    this.editingId.set(null);
    this.productForm.reset({ priceType: 0, inStock: true, price: 0 });
  }

  priceTypeLabel(t: number) { return t === 0 ? 'לפי ק"ג' : 'לפי יחידה'; }
  stockLabel(v: number)     { return v === 1 ? 'במלאי' : 'אזל'; }
}
