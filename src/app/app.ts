import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { ProductService } from './core/services/product.service';
import { AccessibilityWidget } from './shared/accessibility-widget/accessibility-widget';
import { CartDrawer } from './shared/cart-drawer/cart-drawer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, AccessibilityWidget, CartDrawer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Inject ProductService at root level so polling starts immediately on app load
  readonly productService = inject(ProductService);
}
