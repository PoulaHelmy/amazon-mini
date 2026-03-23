import { Injectable, signal } from '@angular/core';
import { PaymentProvider } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentConfigService {
  private readonly _providers = signal<PaymentProvider[]>([]);
  readonly providers = this._providers.asReadonly();

  setProviders(providers: PaymentProvider[]): void {
    this._providers.set(providers);
  }
}
