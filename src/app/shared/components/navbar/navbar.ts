import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, BadgeModule, ButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  private readonly cartService = inject(CartService);
  private readonly translate = inject(TranslateService);

  readonly cartCount = computed(() => this.cartService.itemCount());

  get currentLang(): string {
    return this.translate.currentLang || 'en';
  }

  switchLanguage(): void {
    const next = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(next);
    localStorage.setItem('lang', next);
    document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', next);
  }
}
