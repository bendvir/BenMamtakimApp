import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatSnackBarModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  sent = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^0\d{8,9}$/)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.snackBar.open('ההודעה נשלחה! נחזור אליך בקרוב.', 'תודה', { duration: 4000 });
    this.sent.set(true);
    this.form.reset();
  }
}
