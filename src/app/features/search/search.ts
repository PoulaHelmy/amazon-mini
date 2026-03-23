import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslateModule, ProductCardComponent],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class SearchComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cartService = inject(CartService);
  private readonly translate = inject(TranslateService);

  private readonly allProducts = signal<Product[]>([]);

  // BUG (Task 3): searchTerm is local state — never reads from URL queryParams on init.
  // Pressing back after navigating away loses the search term entirely.
  searchTerm = '';

  readonly sortBy = signal<'relevance' | 'price_asc' | 'price_desc' | 'rating'>('relevance');

  readonly results = computed(() => {
    const term = this.searchTerm.toLowerCase();
    const all = this.allProducts();
    const sort = this.sortBy();

    let filtered = term
      ? all.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.nameAr.includes(term) ||
          p.category.toLowerCase().includes(term)
        )
      : all;

    switch (sort) {
      case 'price_asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price_desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  });

  ngOnInit(): void {
    // BUG: Should read from ActivatedRoute queryParams here, e.g.:
    // this.route.queryParams.subscribe(p => { this.searchTerm = p['q'] || ''; });
    this.http.get<Product[]>('/assets/data/products.json').subscribe(products => {
      this.allProducts.set(products);
    });
  }

  // BUG (Task 3): Typing in search input does NOT update the URL.
  // queryParams should be updated via Router.navigate so the URL is bookmarkable
  // and browser back/forward work correctly.
  onSearch(): void {
    // Should also call: this.router.navigate([], { queryParams: { q: this.searchTerm } })
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
