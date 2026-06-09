import { Component, OnDestroy, signal } from '@angular/core';
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
export class Home implements OnDestroy {
  heroSlides = [
    { image: 'assets/images/hero/hero-1.jpg', eyebrow: 'ממתקי התקווה · מאז 2010', title: 'טעם שנשאר', text: 'פירות יבשים, ממתקים ומארזי מתנה מהמובחרים שיש' },
    { image: 'assets/images/hero/hero-2.jpg', eyebrow: 'איכות שאפשר לטעום', title: 'מהטבע אל הסל', text: 'אגוזים, תמרים ופירות יבשים טריים ישירות אליכם' },
    { image: 'assets/images/hero/hero-3.jpg', eyebrow: 'לכל אירוע ומועד', title: 'מארזי מתנה', text: 'עיצוב אישי ומפנק לכל אירוע ולכל חג' },
    { image: 'assets/images/hero/hero-4.jpg', eyebrow: 'קולקציית הדגל', title: 'נבחרת השוקולד', text: 'שוקולד בלגי, פרלינים ובונבונים בעבודת יד' },
  ];

  currentSlide = signal(0);
  private timer = setInterval(() => this.next(), 5000);

  categories = [
    { route: '/products/cat1', icon: 'cake', image: 'assets/images/categories/sweets.jpg', title: 'המוצרים המתוקים', desc: 'שוקולד, סוכריות, גומי ועוד' },
    { route: '/products/cat2', icon: 'eco', image: 'assets/images/categories/dried-fruits.jpg', title: 'פירות יבשים', desc: 'שקדים, אגוזים, צימוקים ועוד' },
    { route: '/products/cat3', icon: 'card_giftcard', image: 'assets/images/categories/gifts.jpg', title: 'אירועים ומתנות', desc: 'מארזי מתנה לכל אירוע' },
    { route: '/products/cat2', icon: 'eco', image: 'assets/images/fruits/almonds.jpg', title: 'אגוזים טבעיים', desc: 'שקדים, קשיו, פיסטוק ועוד' },
  ];

  holidays = [
    { route: '/products/roshAshana', image: 'assets/images/fruits/dates.jpg', title: 'ראש השנה', desc: 'מארזים ומוצרים לחג' },
    { route: '/products/passover', image: 'assets/images/fruits/almonds.jpg', title: 'פסח', desc: 'מוצרים כשר לפסח' },
  ];

  next(): void {
    this.currentSlide.update(i => (i + 1) % this.heroSlides.length);
  }

  prev(): void {
    this.currentSlide.update(i => (i - 1 + this.heroSlides.length) % this.heroSlides.length);
  }

  goTo(index: number): void {
    this.currentSlide.set(index);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
