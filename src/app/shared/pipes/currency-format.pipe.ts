import { Pipe, PipeTransform } from '@angular/core';
import { AppConfig } from '../../core/models/app-config.model';

@Pipe({ name: 'currencyFormat', standalone: true, pure: true })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, config: AppConfig): string {
    if (value == null) return '';
    try {
      return new Intl.NumberFormat(config.lang === 'ar' ? 'ar-EG' : 'en-US', {
        style: 'currency',
        currency: config.currency,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `${config.currency} ${value}`;
    }
  }
}
