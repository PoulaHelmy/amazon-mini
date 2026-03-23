import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart.service';
import { AppConfigService } from '../../core/services/app-config.service';
import { Product } from '../../core/models/product.model';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, TranslateModule, CurrencyFormatPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly cartService = inject(CartService);
  private readonly translate = inject(TranslateService);
  private readonly configService = inject(AppConfigService);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  readonly config = signal(this.configService.get());

  get currentLang(): string {
    return this.translate.currentLang || 'en';
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<Product[]>('/assets/data/products.json').subscribe(products => {
      const found = products.find(p => p.id === id) || null;
      this.product.set(found);
      this.notFound.set(!found);
      this.loading.set(false);
    });
  }

  addToCart(): void {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p);
    }
  }
}
