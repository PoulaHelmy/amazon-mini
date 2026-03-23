import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { PaymentProvider } from './core/models/payment.model';
import { PaymentConfigService } from './core/services/payment-config.service';

// BUG (Task 3): Static payment providers hardcoded here.
// Should be loaded dynamically from /assets/config/payments/{country}.json
// via AppConfigService.get().country, ideally in APP_INITIALIZER.
const PAYMENT_PROVIDERS: PaymentProvider[] = [
  { id: 'visa', name: 'Visa', icon: 'pi pi-credit-card', enabled: true },
  { id: 'mastercard', name: 'Mastercard', icon: 'pi pi-credit-card', enabled: true },
  { id: 'paypal', name: 'PayPal', icon: 'pi pi-paypal', enabled: true },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main class="main-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
    }
  `],
})
export class AppComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly paymentConfigService = inject(PaymentConfigService);

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.use(savedLang);
    // BUG: Payment providers set from static constant instead of API response
    this.paymentConfigService.setProviders(PAYMENT_PROVIDERS);
  }
}
