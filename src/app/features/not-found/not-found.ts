import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="not-found">
      <span>404</span>
      <h2>הדף לא נמצא</h2>
      <p>הדף שחיפשת אינו קיים</p>
      <a routerLink="/" mat-raised-button color="primary">חזרה לדף הבית</a>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; min-height: 60vh; text-align: center; gap: 1rem;
      span { font-size: 6rem; font-weight: 900; color: var(--primary); line-height: 1; }
      h2 { font-size: 2rem; font-weight: 700; }
      p { color: var(--text-muted); }
    }
  `],
})
export class NotFound {}
