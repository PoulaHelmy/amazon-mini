import { Injectable, signal } from '@angular/core';
import { AppConfig } from '../models/app-config.model';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly _config = signal<AppConfig | null>(null);
  readonly config = this._config.asReadonly();

  set(config: AppConfig): void {
    this._config.set(config);
  }

  get(): AppConfig {
    const config = this._config();
    if (!config) {
      return { lang: 'en', dir: 'ltr', currency: 'USD', country: 'us', apiBaseUrl: '' };
    }
    return config;
  }

  isRtl(): boolean {
    return this._config()?.dir === 'rtl';
  }
}
