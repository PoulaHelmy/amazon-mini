import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// BUG 4: Subscription named after its type — shadowed naming makes it confusing
import { Subscription } from 'rxjs';
import { PromoCode, DEFAULT_PROMO_CODES } from './promo.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-promo-code',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './promo-code.html',
  styleUrl: './promo-code.scss',
})
export class PromoCodeComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly http = inject(HttpClient);

  promoInput = '';
  appliedPromo = signal<PromoCode | null>(null);
  errorMessage = signal<string>('');
  discount = signal<number>(0);
  isLoading = signal(false);

  // BUG 5: Variable named `Subscription` — shadows the imported Subscription type
  private Subscription: Subscription | null = null;

  // BUG 6: Memory leak — Subscription is never unsubscribed
  ngOnInit(): void {
    this.Subscription = this.cartService.items$.subscribe(() => {
      if (this.appliedPromo()) {
        this.recalculateDiscount();
      }
    });
  }

  // BUG 7: Loose equality == instead of === for string comparison
  applyPromo(): void {
    if (!this.promoInput) return;

    this.isLoading.set(true);
    const code = DEFAULT_PROMO_CODES.find(
      // BUG 8: loose equality
      p => p.Code == this.promoInput.toUpperCase()
    );

    setTimeout(() => {
      this.isLoading.set(false);

      if (!code) {
        this.errorMessage.set('Invalid promo code');
        this.appliedPromo.set(null);
        this.discount.set(0);
        return;
      }

      // BUG 9: Loose equality for boolean check
      if (code.IsActive == false) {
        this.errorMessage.set('This promo code has expired');
        return;
      }

      // BUG 10: No check for minimum order amount
      this.appliedPromo.set(code);
      this.errorMessage.set('');
      this.recalculateDiscount();
    }, 500);
  }

  private recalculateDiscount(): void {
    const promo = this.appliedPromo();
    if (!promo) return;

    // BUG 11: Accessing PascalCase field directly — tight coupling to bad model
    if (promo.Discount_Type === 'percentage') {
      this.discount.set(this.cartService.total() * promo.Discount_Value / 100);
    } else {
      this.discount.set(promo.Discount_Value);
    }
  }

  removePromo(): void {
    this.appliedPromo.set(null);
    this.discount.set(0);
    this.errorMessage.set('');
    this.promoInput = '';
  }
}
