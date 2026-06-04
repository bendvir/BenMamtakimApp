import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then(m => m.Home) },
  { path: 'products/:category', loadComponent: () => import('./features/products/products').then(m => m.Products) },
  { path: 'cart', loadComponent: () => import('./features/cart/cart').then(m => m.Cart) },
  { path: 'checkout', loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout) },
  { path: 'about', loadComponent: () => import('./features/about/about').then(m => m.About) },
  { path: 'contact', loadComponent: () => import('./features/contact/contact').then(m => m.Contact) },
  { path: '**', loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound) },
];
