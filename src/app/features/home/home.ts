import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  categories = [
    { route: '/products/cat1', icon: '🍫', title: 'המוצרים המתוקים', desc: 'שוקולד, סוכריות, גומי ועוד' },
    { route: '/products/cat2', icon: '🥜', title: 'פירות יבשים', desc: 'שקדים, אגוזים, צימוקים ועוד' },
    { route: '/products/cat3', icon: '🎁', title: 'אירועים ומתנות', desc: 'מארזי מתנה לכל אירוע' },
  ];

  holidays = [
    { route: '/products/passover', icon: '🍷', title: 'פסח', desc: 'מוצרים כשר לפסח' },
    { route: '/products/roshAshana', icon: '🍎', title: 'ראש השנה', desc: 'מארזים לחג' },
  ];
}
