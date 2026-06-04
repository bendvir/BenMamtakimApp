import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BasketService } from '../../core/services/basket.service';
import { CITIES } from '../../data/products.data';

@Component({
  selector: 'app-checkout',
  imports: [
    DecimalPipe, RouterLink, ReactiveFormsModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatRadioModule, MatSelectModule,
    MatDividerModule, MatSnackBarModule,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  basket = inject(BasketService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  cities = CITIES;
  submitting = signal(false);
  deliveryFee = 25;

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^0\d{8,9}$/)]],
    email: ['', [Validators.required, Validators.email]],
    deliveryType: ['delivery', Validators.required],
    city: [''],
    address: [''],
  });

  get isDelivery() { return this.form.value.deliveryType === 'delivery'; }

  get finalTotal() {
    return this.basket.totalPrice() + (this.isDelivery ? this.deliveryFee : 0);
  }

  onDeliveryChange() {
    const city = this.form.get('city');
    const address = this.form.get('address');
    if (this.isDelivery) {
      city?.setValidators(Validators.required);
      address?.setValidators(Validators.required);
    } else {
      city?.clearValidators();
      address?.clearValidators();
    }
    city?.updateValueAndValidity();
    address?.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    setTimeout(() => {
      this.snackBar.open('ההזמנה התקבלה! נצור איתך קשר בקרוב.', 'תודה', { duration: 5000 });
      this.basket.clearCart();
      this.router.navigate(['/']);
      this.submitting.set(false);
    }, 1500);
  }
}
