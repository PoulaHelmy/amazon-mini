import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { CartService } from '../../core/services/cart.service';
import { Product, Category } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslateModule, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cartService = inject(CartService);
  private readonly translate = inject(TranslateService);

  readonly categories = signal<Category[]>([]);
  readonly featuredProducts = signal<Product[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.http.get<Category[]>('/assets/data/categories.json').subscribe(cats => {
      this.categories.set(cats);
    });

    this.http.get<Product[]>('/assets/data/products.json').subscribe(products => {
      this.featuredProducts.set(products.filter(p => p.isFeatured).slice(0, 8));
      this.loading.set(false);
    });
  }

  get currentLang(): string {
    return this.translate.currentLang || 'en';
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
