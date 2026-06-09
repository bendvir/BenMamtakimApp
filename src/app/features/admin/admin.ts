import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService, AdminProduct, AdminCategory } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin',
  imports: [
    SlicePipe,
    ReactiveFormsModule,
    MatButtonModule, MatIconModule,
    MatSnackBarModule, MatSlideToggleModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private fb       = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  readonly adminSvc = inject(AdminService);

  readonly products   = signal<AdminProduct[]>([]);
  readonly categories = signal<AdminCategory[]>([]);
  readonly editingId  = signal<number | null>(null);
  readonly saving     = signal(false);
  readonly loadError  = signal<string | null>(null);
  readonly searchQuery    = signal('');
  readonly filterCategory = signal('');

  readonly filteredProducts = computed(() => {
    const q   = this.searchQuery().toLowerCase().trim();
    const cat = this.filterCategory();
    return this.products().filter(p =>
      (!q   || p.title.toLowerCase().includes(q)) &&
      (!cat || p.category_id === cat)
    );
  });

  // ── Login: two-step OTP ──────────────────────────────────────────────────
  readonly loginStep      = signal<'password' | 'otp'>('password');
  readonly loginSending   = signal(false);
  readonly otpSessionId   = signal<string | null>(null);
  readonly loginError     = signal<string | null>(null);

  loginForm = this.fb.group({ password: ['', Validators.required] });
  otpForm   = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d{6}$/)]]
  });

  // ── Product form ─────────────────────────────────────────────────────────
  productForm = this.fb.group({
    title:       ['', Validators.required],
    price:       [0,  [Validators.required, Validators.min(0.01)]],
    priceType:   [0 as 0 | 1],
    categoryId:  ['', Validators.required],
    imageUrl:    [''],
    description: [''],
    inStock:     [true],
    isNew:       [true],
  });

  ngOnInit() {
    if (this.adminSvc.isLoggedIn()) this.loadData();
  }

  // Step 1 — send password, receive OTP
  requestOtp() {
    if (this.loginForm.invalid) return;
    this.loginSending.set(true);
    this.loginError.set(null);
    this.adminSvc.requestOtp(this.loginForm.value.password!).subscribe({
      next: res => {
        this.loginSending.set(false);
        this.otpSessionId.set(res.sessionId);
        this.loginStep.set('otp');
      },
      error: err => {
        this.loginSending.set(false);
        this.loginError.set(err.error?.error ?? 'שגיאה בכניסה');
      },
    });
  }

  // Step 2 — verify OTP code
  verifyOtp() {
    if (this.otpForm.invalid) return;
    const sessionId = this.otpSessionId();
    if (!sessionId) return;
    this.loginSending.set(true);
    this.loginError.set(null);
    this.adminSvc.verifyOtp(sessionId, this.otpForm.value.code!).subscribe({
      next: () => {
        this.loginSending.set(false);
        this.loginStep.set('password');
        this.otpForm.reset();
        this.loadData();
      },
      error: err => {
        this.loginSending.set(false);
        this.loginError.set(err.error?.error ?? 'קוד שגוי');
      },
    });
  }

  backToPassword() {
    this.loginStep.set('password');
    this.otpSessionId.set(null);
    this.otpForm.reset();
    this.loginError.set(null);
  }

  logout() {
    this.adminSvc.logout();
    this.products.set([]);
    this.resetForm();
  }

  private loadData() {
    this.adminSvc.getCategories().subscribe({
      next:  cats  => this.categories.set(cats),
      error: ()    => this.loadError.set('שגיאה בטעינת קטגוריות'),
    });
    this.adminSvc.getProducts().subscribe({
      next:  prods => this.products.set(prods),
      error: ()    => this.loadError.set('שגיאה בטעינת מוצרים'),
    });
  }

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
      isNew:       (p as any).is_new === 1,
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
      priceType:   Number(v.priceType ?? 0) as 0 | 1,
      categoryId:  v.categoryId!,
      imageUrl:    v.imageUrl  || '',
      description: v.description || '',
      inStock:     v.inStock !== false,
      isNew:       v.isNew === true,
    };

    const op = this.editingId()
      ? this.adminSvc.updateProduct(this.editingId()!, payload)
      : this.adminSvc.createProduct(payload);

    op.subscribe({
      next:  res => { this.saving.set(false); this.snackBar.open(res.message, '', { duration: 2500 }); this.loadData(); this.resetForm(); },
      error: err => { this.saving.set(false); this.snackBar.open(err.error?.error ?? 'שגיאה בשמירה', '', { duration: 3000 }); },
    });
  }

  deleteProduct(p: AdminProduct) {
    if (!confirm(`למחוק את "${p.title}"?`)) return;
    this.adminSvc.deleteProduct(p.id).subscribe({
      next:  res => { this.snackBar.open(res.message, '', { duration: 2000 }); this.loadData(); if (this.editingId() === p.id) this.resetForm(); },
      error: ()  => this.snackBar.open('שגיאה במחיקה', '', { duration: 2500 }),
    });
  }

  private resetForm() {
    this.editingId.set(null);
    this.productForm.reset({ priceType: 0, inStock: true, price: 0, isNew: true });
  }

  priceTypeLabel(t: number) { return t === 0 ? 'לפי ק"ג' : 'לפי יחידה'; }
  stockLabel(v: number)     { return v === 1 ? 'במלאי' : 'אזל'; }
}
