import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'הושלם' | 'בעיבוד' | 'נשלח';
  date: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, MatButtonModule, RouterLink, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  kpis = [
    { icon: 'shopping_bag', label: 'הזמנות החודש', value: '284', change: '+12%', up: true, color: '#1E40AF' },
    { icon: 'payments', label: 'הכנסה החודש', value: '₪42,380', change: '+8%', up: true, color: '#16a34a' },
    { icon: 'people', label: 'לקוחות חדשים', value: '61', change: '+23%', up: true, color: '#9333ea' },
    { icon: 'star', label: 'דירוג ממוצע', value: '4.9', change: '+0.1', up: true, color: '#CA8A04' },
  ];

  salesData = [
    { month: 'ינו׳', value: 32000, max: 50000 },
    { month: 'פבר׳', value: 28000, max: 50000 },
    { month: 'מרץ', value: 41000, max: 50000 },
    { month: 'אפר׳', value: 38000, max: 50000 },
    { month: 'מאי', value: 45000, max: 50000 },
    { month: 'יוני', value: 42380, max: 50000 },
  ];

  categoryStats = [
    { name: 'ממתקים', sales: 142, revenue: 18400, percent: 43, color: '#DC2626' },
    { name: 'פירות יבשים', sales: 89, revenue: 14200, percent: 34, color: '#16a34a' },
    { name: 'מארזי מתנה', sales: 53, revenue: 9780, percent: 23, color: '#CA8A04' },
  ];

  recentOrders: Order[] = [
    { id: '#1084', customer: 'שרה כהן', product: 'מארז שוקולד פרמיום', amount: 289, status: 'הושלם', date: '06/06/2026' },
    { id: '#1083', customer: 'דוד לוי', product: 'פירות יבשים מעורבים 1ק״ג', amount: 145, status: 'נשלח', date: '06/06/2026' },
    { id: '#1082', customer: 'מיכל אברהם', product: 'מארז חג מתנה', amount: 380, status: 'בעיבוד', date: '05/06/2026' },
    { id: '#1081', customer: 'יוסי ברק', product: 'שקדים מולבנים 500ג', amount: 89, status: 'הושלם', date: '05/06/2026' },
    { id: '#1080', customer: 'רחל שמיר', product: 'סלסלת פירות יבשים', amount: 220, status: 'נשלח', date: '04/06/2026' },
    { id: '#1079', customer: 'אמיר נחמן', product: 'מארז ממתקים לאירוע', amount: 560, status: 'הושלם', date: '04/06/2026' },
  ];

  getBarHeight(value: number, max: number): string {
    return `${Math.round((value / max) * 100)}%`;
  }

  statusClass(status: string): string {
    if (status === 'הושלם') return 'status--done';
    if (status === 'נשלח') return 'status--sent';
    return 'status--processing';
  }

  totalRevenue = this.salesData.reduce((s, d) => s + d.value, 0);
}
