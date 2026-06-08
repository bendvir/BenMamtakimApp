import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  features = [
    { icon: 'local_shipping', title: 'משלוח מהיר', desc: 'עד הבית תוך 24–48 שעות בכל רחבי הארץ' },
    { icon: 'verified', title: 'איכות מובטחת', desc: 'רק חומרי גלם טריים ומוצרים מהמותגים המובחרים' },
    { icon: 'card_giftcard', title: 'מארזי מתנה', desc: 'עיצוב אישי לכל אירוע — חתונות, ברית, חגים ועוד' },
    { icon: 'lock', title: 'תשלום מאובטח', desc: 'הצפנת SSL מלאה ואפשרויות תשלום מגוונות' },
  ];

  categories = [
    { icon: 'cake', title: 'ממתקים', desc: 'שוקולד, סוכריות, מרשמלו ועוד', route: '/products/cat1', color: '#DC2626' },
    { icon: 'eco', title: 'פירות יבשים', desc: 'שקדים, אגוזים, צימוקים ועוד', route: '/products/cat2', color: '#16a34a' },
    { icon: 'card_giftcard', title: 'מארזי מתנה', desc: 'מארזים מיוחדים לכל אירוע', route: '/products/cat3', color: '#CA8A04' },
  ];

  testimonials = [
    { name: 'שרה כהן', role: 'לקוחה קבועה', text: 'המוצרים מדהימים! הסדר הגיע מהר ואריזת המתנה הייתה מושלמת.', stars: 5 },
    { name: 'דוד לוי', role: 'בעל עסק', text: 'מזמין מארזי מתנה לכל עובדי החברה. איכות ללא פשרות בכל פעם.', stars: 5 },
    { name: 'מיכל אברהם', role: 'אם לשלושה', text: 'הילדים מתים על הממתקים! מחירים הגיוניים ושירות מצוין.', stars: 5 },
  ];

  stats = [
    { value: '10,000+', label: 'לקוחות מרוצים' },
    { value: '500+', label: 'מוצרים בקטלוג' },
    { value: '15+', label: 'שנות ניסיון' },
    { value: '4.9★', label: 'דירוג ממוצע' },
  ];

  featured = [
    { title: 'פרלינים בלגיים', sub: 'שוקולד מריר וחלב', price: '₪120 / 100ג', route: '/products/cat1', bg: 'linear-gradient(145deg,#3b1f0e,#6b3a1f)', label: 'בסטסלר' },
    { title: 'תערובת פירות יבשים', sub: 'שקדים, אגוזים ופיסטוקים', price: '₪90 / 100ג', route: '/products/cat2', bg: 'linear-gradient(145deg,#2d4a1e,#4a7a35)', label: 'טרי' },
    { title: 'מארז מתנה פרמיום', sub: 'לאירועים ומתנות עסקיות', price: 'מ-₪250', route: '/products/cat3', bg: 'linear-gradient(145deg,#3d2a00,#7a5500)', label: 'חדש' },
    { title: 'שוקולד בלגי', sub: 'קולקציית שוקולדים מובחרים', price: '₪80 / 100ג', route: '/products/cat1', bg: 'linear-gradient(145deg,#1a0a0a,#4a1515)', label: '' },
  ];
}
