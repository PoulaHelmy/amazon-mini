# Implementation Plan: amazon-mini Interview Challenge

## Overview

Transform the bare `amazon-mini` Angular 21 skeleton into a complete 3-task interview
challenge with deliberate hidden bugs, a polished UI, and a separate PR branch for
code review. Inspired by the `souqify-challenge` architecture but with distinct tasks,
new components, and richer issues.

---

## Final Project Structure

```
amazon-mini/
├── .nvmrc                          ← Node 20 pinned (first drop for candidate)
├── CANDIDATE_BRIEF.md              ← Tasks 1-3
├── design-spec/
│   └── product-card.html           ← Dark-theme design spec (6 states)
└── src/
    ├── styles.scss                 ← global tokens, resets
    └── app/
        ├── app.ts                  ← static PAYMENT_PROVIDERS const (deliberate pattern issue)
        ├── app.config.ts           ← TranslateModule + HttpClient, NO APP_INITIALIZER (deliberate)
        ├── app.routes.ts           ← all routes
        ├── core/
        │   ├── services/
        │   │   ├── app-config.service.ts        ← signal-based, never initialized (bug)
        │   │   ├── payment-config.service.ts    ← stub, never populated
        │   │   └── cart.service.ts              ← signal-based cart
        │   └── interceptors/
        │       └── (NONE — locale/loading/error interceptors all missing)
        ├── features/
        │   ├── home/               ← landing page, RTL + responsive bugs
        │   ├── products/
        │   │   └── product-list/   ← inline divs, method calls in template, DI bug
        │   ├── search/             ← URL sync bug, back button bug, static breadcrumb
        │   ├── cart/               ← working cart page
        │   └── product-detail/     ← stub; candidate adds with resolver
        └── shared/
            ├── pipes/
            │   └── currency-format.pipe.ts
            ├── components/
            │   ├── navbar/         ← cart count broken (DI bug propagated from product-list)
            │   └── product-card/   ← MISSING (candidate creates in Task 2)
```

---

## Phase 1 — Project Foundation

### 1.1 `.nvmrc`
```
20
```
Pins Node 20. `amazon-mini` already has `"packageManager": "npm@11.6.2"` — `.nvmrc`
ensures `nvm use` works cleanly and is the first thing a candidate notices.

### 1.2 Dependencies to add (`package.json`)
```json
"@ngx-translate/core": "^16.0.4",
"@ngx-translate/http-loader": "^16.0.0",
"primeng": "^17.x",
"@primeuix/themes": "^0.x",
"primeicons": "^7.x"
```
Copy exact versions from `souqify/package.json`.

### 1.3 Global styles (`src/styles.scss`)
- CSS custom properties: `--primary`, `--surface-*`, `--radius`, `--spacing-*`
- `page-container` class (max-width: 1280px, auto margins, padding-inline)
- `section-title` class
- Reset: `box-sizing: border-box`, `margin: 0`
- **RTL-safe**: use `padding-inline`, `margin-inline` everywhere in global styles
  _(Home feature page will break this intentionally)_

---

## Phase 2 — Assets

### 2.1 `src/assets/i18n/en.json` + `ar.json`
Copy from `souqify`, extend with:
```json
"SEARCH": {
  "PLACEHOLDER": "Search products...",
  "RESULTS": "results for",
  "NO_RESULTS": "No products found for",
  "BREADCRUMB": "Search results"
},
"PRODUCT_DETAIL": {
  "BACK": "Back to products",
  "ADD_TO_CART": "Add to Cart",
  "OUT_OF_STOCK": "Out of Stock",
  "DESCRIPTION": "Description",
  "REVIEWS": "Customer Reviews",
  "SPECIFICATIONS": "Specifications"
},
"PAYMENT": {
  "METHODS": "Payment Methods",
  "ACCEPTED": "We accept"
}
```

### 2.2 `src/assets/config/app.config.json`
```json
{ "country": "EG", "currency": "EGP", "locale": "ar-EG", "dir": "rtl", "lang": "ar" }
```

### 2.3 `src/assets/config/payments/eg.json`
```json
[
  { "id": "visa",        "name": "Visa",              "icon": "pi pi-credit-card", "enabled": true  },
  { "id": "mastercard",  "name": "Mastercard",        "icon": "pi pi-credit-card", "enabled": true  },
  { "id": "fawry",       "name": "Fawry",             "icon": "pi pi-money-bill",  "enabled": true  },
  { "id": "cod",         "name": "Cash on Delivery",  "icon": "pi pi-wallet",      "enabled": true  },
  { "id": "valu",        "name": "ValU Installments", "icon": "pi pi-chart-line",  "enabled": true  }
]
```

### 2.4 `src/assets/config/payments/us.json`
```json
[
  { "id": "visa",    "name": "Visa",    "icon": "pi pi-credit-card", "enabled": true },
  { "id": "stripe",  "name": "Stripe",  "icon": "pi pi-credit-card", "enabled": true },
  { "id": "paypal",  "name": "PayPal",  "icon": "pi pi-paypal",      "enabled": true }
]
```

### 2.5 `src/assets/data/products.json`
Copy the 60-product file from `souqify-challenge`. Ensure at least:
- 5 `stock: 0` (out of stock)
- 8 `badge: "sale"` with `originalPrice > price`
- 6 `badge: "new"`
- 5 `badge: "best-seller"`
- 10 `featured: true`
- Mix of categories: electronics, fashion, home, sports, beauty, books

### 2.6 `src/assets/data/categories.json`
Copy from `souqify` (6 categories).

---

## Phase 3 — Core Services (Correct Implementations — NEVER CALLED)

### 3.1 `app-config.service.ts`
Exact copy of `souqify` version — signal-based, `set()` + `get()` + `config()` readonly.
**Bug:** Never initialized — no `APP_INITIALIZER` in `app.config.ts`.
Result: `config()` returns `null`, all computed lang/locale/dir signals fall back to defaults.

### 3.2 `payment-config.service.ts`
```typescript
@Injectable({ providedIn: 'root' })
export class PaymentConfigService {
  private readonly _providers = signal<PaymentProvider[]>([]);
  readonly providers = this._providers.asReadonly();

  setProviders(providers: PaymentProvider[]): void {
    this._providers.set(providers);
  }
}
```
**Bug:** `setProviders()` is never called — no one loads payments in `APP_INITIALIZER`.
Payments section in checkout/cart always shows empty.

### 3.3 `cart.service.ts`
Copy from `souqify` — signal-based cart with `add`, `remove`, `clear`, `total`.

### 3.4 `currency-format.pipe.ts`
Exact copy from `souqify` — pure pipe.

---

## Phase 4 — `app.ts` + `app.config.ts` + `app.routes.ts`

### 4.1 `app.ts` — Static PAYMENT_PROVIDERS (deliberate pattern issue)
```typescript
// Deliberate: static config that should be loaded dynamically from API
export const PAYMENT_PROVIDERS = [
  { id: 'visa',       name: 'Visa',             icon: 'pi pi-credit-card', enabled: true  },
  { id: 'mastercard', name: 'Mastercard',        icon: 'pi pi-credit-card', enabled: true  },
  { id: 'cod',        name: 'Cash on Delivery',  icon: 'pi pi-wallet',      enabled: false },
] as const;
```
The component that renders this (CartPage) uses `PAYMENT_PROVIDERS` directly —
hardcoded, not reactive, not country-aware. Candidate should spot this and migrate to
`PaymentConfigService` fed by `APP_INITIALIZER`.

### 4.2 `app.config.ts` — Missing `APP_INITIALIZER` (deliberate)
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),           // ← no withInterceptors([...]) — interceptors missing
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: provideTranslateHttpLoader({ prefix: '/assets/i18n/', suffix: '.json' }),
      }),
    ),
    // APP_INITIALIZER missing — AppConfigService never initialized
    // No locale interceptor — headers never sent
  ],
};
```

### 4.3 `app.routes.ts`
```typescript
export const routes: Routes = [
  { path: '',         loadComponent: () => import('./features/home/home').then(m => m.Home) },
  { path: 'products', loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductList) },
  { path: 'search',   loadComponent: () => import('./features/search/search').then(m => m.Search) },
  { path: 'cart',     loadComponent: () => import('./features/cart/cart').then(m => m.Cart) },
  {
    path: 'products/:id',
    // TODO: Add a resolver here to ensure product data is loaded before component renders
    loadComponent: () => import('./features/product-detail/product-detail').then(m => m.ProductDetail),
  },
  { path: '**', redirectTo: '' },
];
```
The comment on `products/:id` is the **indirect hint** for the resolver task.

---

## Phase 5 — Features with Deliberate Bugs

### 5.1 Home Page (`features/home/`)
Copy and adapt from `souqify`. **Introduce RTL + responsive bugs:**

**home.scss bugs:**
```scss
// BUG 1: padding-left/right instead of padding-inline
.hero-inner {
  padding-left: 2rem;      // ← breaks RTL, should be padding-inline: 2rem
  padding-right: 2rem;
}

// BUG 2: text-align: left instead of text-align: start
.section-title {
  text-align: left;        // ← breaks RTL
}

// BUG 3: margin-right on icon (breaks RTL direction)
.category-icon {
  margin-right: 0.75rem;   // ← should be margin-inline-end
}

// BUG 4: fixed width that breaks mobile
.hero-inner {
  width: 1200px;            // ← should be max-width: 1200px
}

// BUG 5: hardcoded px font size
.hero h1 {
  font-size: 40px;         // ← should be clamp(2rem, 4vw, 3rem)
}
```

**home.ts bugs:**
- Uses `getCategoryName()` method in template (minor, should be pipe or computed)
- No responsive media query for hero grid (CSS bug)

### 5.2 Products Page (`features/products/product-list/`)
**Key bugs:**

```typescript
@Component({
  selector: 'app-product-list',
  standalone: true,
  providers: [CartService],  // ← BUG: creates LOCAL CartService instance!
  // ...
})
export class ProductList {
  // Constructor injection instead of inject() — style bug
  constructor(
    private http: HttpClient,
    private cartService: CartService,    // gets LOCAL instance from providers above
    private configService: AppConfigService,
  ) {}

  products: Product[] = [];
  loading = true;

  // Method called in template — no pure pipe (performance bug with 60 products)
  formatPrice(price: number): string {
    const config = this.configService.config();
    return new Intl.NumberFormat(config?.locale ?? 'en-US', {
      style: 'currency',
      currency: config?.currency ?? 'USD',
    }).format(price);
  }

  // Method called in template — recomputes on every CD cycle
  getFilteredProducts(): Product[] {
    return this.products; // basic for now
  }

  ngOnInit(): void {
    this.http.get<Product[]>('/assets/data/products.json').subscribe(data => {
      this.products = data;
      this.loading = false;
    });
    // No takeUntilDestroyed — memory leak
  }
}
```

**product-list.html:**
```html
<!-- No ProductCard component — just inline divs with raw data -->
@for (product of getFilteredProducts(); track product.id) {
  <div class="product-item">
    <img [src]="product.image" />
    <div>{{ product.nameEn }}</div>
    <div>{{ formatPrice(product.price) }}</div>  <!-- method call per item -->
    <div>{{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}</div>
    <button (click)="addToCart(product)">Add to Cart</button>
  </div>
}
```
With 60 products, `formatPrice()` runs hundreds of times per CD cycle — discoverable
without any hint just by opening DevTools performance tab.

### 5.3 Search Page (`features/search/`)
**Multiple bugs:**

```typescript
@Component({ selector: 'app-search', ... })
export class Search implements OnInit {
  // BUG 1: not synced with URL — uses local state only
  searchTerm = '';        // not a signal, not from queryParams

  // BUG 2: breadcrumb is static hardcoded
  breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Search', url: '/search' },   // ← never updates with search term
  ];

  products: Product[] = [];
  results: Product[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // BUG 3: doesn't read queryParams on init — back button loses state
    this.http.get<Product[]>('/assets/data/products.json').subscribe(data => {
      this.products = data;
    });
  }

  // BUG 4: search only runs on button click, not reactive to queryParam changes
  onSearch(): void {
    this.results = this.products.filter(p =>
      p.nameEn.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    // BUG 5: doesn't update URL — pressing back navigates away entirely
    // this.router.navigate([], { queryParams: { q: this.searchTerm } });  ← missing
  }

  // BUG 6: method in template
  getResultCount(): string {
    return `${this.results.length} results`;
  }
}
```

**search.html:**
```html
<!-- Static breadcrumb — doesn't reflect search term -->
<nav class="breadcrumb">
  @for (crumb of breadcrumbs; track crumb.url) {
    <span><a [routerLink]="crumb.url">{{ crumb.label }}</a></span>
  }
</nav>

<input [(ngModel)]="searchTerm" placeholder="Search..." />
<button (click)="onSearch()">Search</button>

<!-- BUG: results count as method call -->
<p>{{ getResultCount() }}</p>
```

### 5.4 Cart Page (`features/cart/`)
Mostly working. Shows `PAYMENT_PROVIDERS` from the static `app.ts` const — hardcoded.
```typescript
// Uses static import directly, not the service
import { PAYMENT_PROVIDERS } from '../../app';

@Component({ ... })
export class Cart {
  paymentProviders = PAYMENT_PROVIDERS;   // ← static, not from PaymentConfigService
  // ...
}
```

### 5.5 Product Detail Page (`features/product-detail/`)
Stub — candidate implements. Just shows "Product Detail Page" placeholder.
```typescript
@Component({
  template: `
    <div class="page-container">
      <h1>Product Detail</h1>
      <p>Implement this page with a route resolver.</p>
    </div>
  `
})
export class ProductDetail {}
```

---

## Phase 6 — Navbar (DI consequence)

`navbar.ts` injects `CartService` via `inject()` from root scope.
But `ProductList` has its own `providers: [CartService]` instance.
Result: `cartCount()` in navbar never increments when user clicks "Add to Cart"
from the product list — silent, looks like a cart bug to the candidate.

```typescript
@Component({ selector: 'app-navbar', ... })
export class Navbar {
  cartService = inject(CartService);  // root instance
  cart        = inject(AppConfigService);

  // This never changes because ProductList uses its OWN CartService instance
  cartCount = computed(() => this.cartService.items().length);
}
```

---

## Phase 7 — Design Spec

Copy `design-spec/product-card.html` from `souqify-challenge` verbatim.
Same dark-theme HTML with 6 card states, fixed 398px height, glassmorphism badges,
gradient button. Candidate implements `shared/components/product-card/` to match it.

---

## Phase 8 — PR Branch (Task 1)

Create git branch `feature/promo-code` containing:

### `src/app/shared/models/promo.model.ts`
```typescript
// Bug catalog: PascalCase fields, snake_case mix, var, redundant class, Date shadow
export interface PromoData {
  Id: number;
  Code: string;
  Discount: number;        // should be discount
  ExpiryDate: string;      // 'Date' convention issue
  is_active: boolean;      // snake_case mixed with PascalCase
  Min_Order: number;       // worst of both
}

export class PromoHelpers {
  public static isValid(promo: PromoData): boolean {
    return promo.is_active == true && promo.Discount > 0;  // == instead of ===
  }

  public static formatLabel(promo: PromoData): string {
    var label = '';                    // var bug
    label = promo.Code + ' - ' + promo.Discount + '% off';
    return label;
  }
}
```

### `src/app/shared/components/promo-code/promo-code.ts`
```typescript
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';          // imported type
import { PromoData, PromoHelpers } from '../../models/promo.model';

@Component({
  selector: 'app-promo-code',
  standalone: true,
  templateUrl: './promo-code.html',
  styleUrl: './promo-code.scss',
})
export class PromoCode implements OnInit {
  @Input() orderId!: number;

  promos: PromoData[] = [];
  appliedPromo: PromoData | null = null;
  inputCode = '';
  errorMsg = '';            // set but never shown in template
  successMsg = '';

  private Subscription!: Subscription;    // named after its type

  constructor(private http: HttpClient) {}   // constructor injection

  ngOnInit() {
    this.Subscription = this.http
      .get<PromoData[]>('/assets/data/promos.json')
      .subscribe(
        (data) => { this.promos = data; },
        (err)  => { this.errorMsg = 'Failed to load promos'; }  // never shown
      );
    // No ngOnDestroy — memory leak
  }

  getValidPromos(): PromoData[] {     // method called in template
    return this.promos.filter(p => PromoHelpers.isValid(p));
  }

  applyCode(): void {
    const match = this.promos.find(p => p.Code == this.inputCode);  // == + PascalCase
    if (match) {
      this.appliedPromo = match;
      this.successMsg = 'Promo applied!';
    }
  }

  getDiscount(): number {             // method called in template
    if (!this.appliedPromo) return 0;
    return this.appliedPromo.Discount;
  }
}
```

### `src/app/shared/components/promo-code/promo-code.html`
```html
<div class="promo-container">
  <h3>Promo Codes</h3>

  <!-- track $index — unstable identity -->
  @for (promo of getValidPromos(); track $index) {
    <div class="promo-card" style="margin-bottom: 12px">   <!-- inline style -->
      <span class="Code">{{ promo.Code }}</span>           <!-- PascalCase CSS class -->
      <span>{{ promo.Discount }}% off</span>
      <!-- missing alt on img -->
      <img [src]="'assets/icons/' + promo.Id + '.png'" />
    </div>
  }

  <div class="apply-row">
    <input [(ngModel)]="inputCode" placeholder="Enter promo code" />
    <button (click)="applyCode()">Apply</button>
  </div>

  @if (appliedPromo) {
    <!-- getDiscount() called twice — method in template -->
    <p>Discount: {{ getDiscount() }}%</p>
    <p class="total-after">You save {{ getDiscount() }}% on your order</p>
  }

  <!-- errorMsg never shown — no @if (errorMsg) block -->
</div>
```

### `src/app/shared/components/promo-code/promo-code.scss`
```scss
.promo-container {
  padding: 16px;              // px instead of rem
  font-size: 14px;            // px instead of rem
}

.promo-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;         // magic numbers
  margin-left: auto;          // BUG: breaks RTL, should be margin-inline-start
}

.Code {                       // PascalCase CSS class
  font-weight: 700 !important;  // !important smell
  color: #6366f1;             // hardcoded hex — no design token
  font-size: 13px;
}

.apply-row {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-left: 0;            // RTL bug — should be padding-inline-start
}

input {
  border: 1px solid #cbd5e1;  // hardcoded hex
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  width: 200px;               // fixed px width — breaks responsive
}

button {
  background: #6366f1;        // hardcoded hex
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px !important;  // !important
}
```

Also add `src/assets/data/promos.json` on the PR branch:
```json
[
  { "Id": 1, "Code": "SAVE10", "Discount": 10, "ExpiryDate": "2025-12-31", "is_active": true, "Min_Order": 200 },
  { "Id": 2, "Code": "NEWUSER", "Discount": 20, "ExpiryDate": "2025-06-30", "is_active": true, "Min_Order": 0 },
  { "Id": 3, "Code": "EXPIRED", "Discount": 15, "ExpiryDate": "2024-01-01", "is_active": false, "Min_Order": 100 }
]
```

---

## Phase 9 — CANDIDATE_BRIEF.md

```markdown
# Amazon Mini — Frontend Interview Challenge

> Time: ~120 minutes | Angular 21 | Node 20 (`.nvmrc` provided)

## Setup

```bash
nvm use
npm install
ng serve
```

---

## Task 1 — Code Review (20 min)

Review the open PR on the `feature/promo-code` branch.

```bash
git checkout feature/promo-code
```

**Deliverable:** List of issues found with severity (Critical / High / Medium / Low).
No fixes required — review only.

---

## Task 2 — Implement ProductCard Component (50 min)

Open `design-spec/product-card.html` in your browser to see the design spec.

Implement `src/app/shared/components/product-card/product-card.ts` (and its template/styles)
to match the spec pixel-perfectly with all 6 states:

1. Default
2. Out of Stock
3. On Sale (with discount %)
4. Badged (new / best-seller / sale)
5. Featured (highlighted border + ⭐)
6. Loading skeleton

Then integrate the component into the product list page to replace the current
placeholder items.

**Requirements:**
- Use Angular signals (`input.required<T>()`, `output<T>()`, `computed()`)
- Locale-aware price formatting (use the existing `CurrencyFormatPipe`)
- RTL-safe CSS (logical properties)

---

## Task 3 — Project Review & Feature Implementation (50 min)

Review the project and address the following. Work in priority order:

### 3.1 App Initialization
The app config (`/assets/config/app.config.json`) is never loaded at startup.
Fix this so the language, locale, currency, and text direction are set before
the app renders. Also load the payment providers for the active country from
`/assets/config/payments/{country}.json` and store them in `PaymentConfigService`.

### 3.2 HTTP Interceptors
- Add a **locale interceptor** that attaches `Accept-Language` and `X-Country`
  headers to every HTTP request.
- Add a **global loading interceptor** that shows a spinner while any HTTP
  request is in flight.
- Add a **global error interceptor** that handles HTTP errors gracefully
  (show a toast/snackbar for 4xx/5xx).

### 3.3 Product Detail Page
Implement the product detail page at `/products/:id`. The product data must be
available before the component renders — look at the route configuration for hints.

### 3.4 Cart / Payment
The cart page shows a hardcoded payment methods list. Update it to use the
`PaymentConfigService` providers loaded in 3.1.

### 3.5 Search Page
The search page has URL and navigation issues.
- The search term should sync with the URL query param (`?q=...`)
- The back button should restore the previous search state
- The breadcrumb should reflect the active search term

### 3.6 Performance
Identify and fix any performance issues in the product list. Check how prices
are formatted on each change detection cycle.

---

## Notes

- No external API calls — all data is in `/assets/`
- RTL layout is the default (Arabic, Egypt) — test with `dir="rtl"`
- You may install additional npm packages if justified
```

---

## Phase 10 — Interviewer Guide (private, not committed)

### PR Bug Table (Task 1) — 28 issues across 4 files

| File | Line | Issue | Severity |
|------|------|-------|----------|
| promo.model.ts | interface fields | PascalCase fields (Id, Code, Discount, ExpiryDate) | Medium |
| promo.model.ts | is_active, Min_Order | Mixed naming conventions | Medium |
| promo.model.ts | PromoHelpers.isValid | `== true` loose equality | High |
| promo.model.ts | formatLabel | `var` instead of `const` | Low |
| promo.model.ts | PromoHelpers class | Static-only class should be pure functions | Medium |
| promo-code.ts | `Subscription` variable | Named same as imported type | High |
| promo-code.ts | constructor injection | Use `inject()` in Angular 21 | Low |
| promo-code.ts | no ngOnDestroy | Memory leak — Subscription never unsubscribed | High |
| promo-code.ts | `p.Code == this.inputCode` | Loose equality + PascalCase field access | High |
| promo-code.ts | `errorMsg` | Set in error callback, never shown in template | Medium |
| promo-code.ts | `getValidPromos()` in template | Method call in template — runs every CD cycle | High |
| promo-code.ts | `getDiscount()` called twice | Method called twice for same value | Medium |
| promo-code.ts | no return type on subscribe | Deprecated 2-arg subscribe pattern | Medium |
| promo-code.html | `track $index` | Unstable identity — use `track promo.Id` | High |
| promo-code.html | inline `style="margin-bottom: 12px"` | Inline style, use class | Low |
| promo-code.html | `.Code` class | PascalCase CSS class | Low |
| promo-code.html | `<img>` missing `alt` | Accessibility | High |
| promo-code.html | `getDiscount()` called twice | Method in template | Medium |
| promo-code.html | errorMsg never rendered | Error state invisible to user | Medium |
| promo-code.scss | `font-size: 16px/14px/13px` | `px` instead of `rem` (accessibility) | Medium |
| promo-code.scss | `font-weight: 700 !important` | `!important` smell | Low |
| promo-code.scss | `font-size: 14px !important` | `!important` smell | Low |
| promo-code.scss | Hardcoded hex colors × 4 | No design tokens | Medium |
| promo-code.scss | `margin-left: auto` | RTL bug — `margin-inline-start` | High |
| promo-code.scss | `padding-left: 0` | RTL bug — `padding-inline-start` | Medium |
| promo-code.scss | `width: 200px` on input | Fixed px — breaks responsive/mobile | Medium |
| promo-code.scss | `.Code` class | Matches TS PascalCase convention bug | Low |
| promo.model.ts | `ExpiryDate` field name | Shadows convention; unclear if ms/string | Low |

### Task 2 Pixel-Perfect Check

| State | What to look for |
|-------|-----------------|
| Default | White card, product name 2-line clamp, star rating, price, CTA button |
| OOS | Grayscale image, overlay pill, disabled button |
| On Sale | Original price struck, discount % badge, sale price different color |
| Badge | Glassmorphism pill top-left, correct color per type |
| Featured | Indigo border + glow, ⭐ amber circle top-right |
| Loading | Skeleton shimmer for image, name, price, button |
| RTL | Badge on right, layout mirrored, ⭐ on left |
| Equal height | All 6 cards exactly 398px, price row always at bottom |

### Task 3 Bug List (for interviewer awareness)

| Bug | Root Cause | Expected Fix |
|-----|-----------|-------------|
| App lang/dir never applied | No APP_INITIALIZER | Add `appInitializer` factory, register in `app.config.ts` |
| Payment providers always empty | Static const in app.ts + service never called | Load from `/assets/config/payments/{country}.json` in initializer, call `paymentConfigService.setProviders()` |
| Cart count never updates | `providers: [CartService]` in ProductList creates local instance | Remove `providers` override, let root instance handle it |
| Constructor injection style | `constructor(private http: HttpClient)` | Use `inject()` pattern |
| No HTTP interceptors | `provideHttpClient()` without `withInterceptors()` | Add locale, loading, error interceptors |
| Product detail flicker | No resolver on route | Add `ResolveFn<Product>` to route config |
| Search term lost on back | `queryParams` not read on init | Read `ActivatedRoute.queryParams` on init, update URL on search |
| Breadcrumb static | Hardcoded array | React to route/queryParam changes |
| RTL hero layout broken | `padding-left`, `text-align: left`, `margin-right` | Replace with CSS logical properties |
| `formatPrice()` in template | Method called every CD cycle for 60 products | Replace with `currencyFormat` pure pipe |
| `getFilteredProducts()` in template | Method, not computed | Replace with `computed()` signal |
| Memory leak in product-list | No `takeUntilDestroyed` | Add `DestroyRef` + pipe |

### Scoring Rubric

| Area | Weight | Max Score |
|------|--------|-----------|
| Task 1: PR review depth & accuracy | 20% | 20 |
| Task 2: Component states + signals | 25% | 25 |
| Task 2: Pixel accuracy + RTL | 10% | 10 |
| Task 3: APP_INITIALIZER + init chain | 20% | 20 |
| Task 3: Interceptors (3 total) | 10% | 10 |
| Task 3: DI bug (cart count) | 5% | 5 |
| Task 3: Resolver | 5% | 5 |
| Discussion quality | 5% | 5 |
| **Total** | **100%** | **100** |

### Discussion Questions (after tasks)

1. "Why does the cart count stay at 0 when you add products?" — tests DI understanding
2. "What's the difference between `APP_INITIALIZER` and `ngOnInit` for loading config?"
3. "Why is the promo component's loading interceptor pattern worse than `takeUntilDestroyed`?"
4. "If this were a real app, how would you test the `appInitializer` factory?"
5. "The product list renders 60 items. What would you do to improve first paint?"
6. "How would you make the interceptors testable in unit tests?"

---

## Implementation Order

1. `.nvmrc` + `package.json` (install deps)
2. Copy + extend assets (i18n, config, products, categories)
3. `styles.scss`
4. Core services (app-config, payment-config, cart, currency pipe)
5. `app.ts` (with static PAYMENT_PROVIDERS)
6. `app.config.ts` (WITHOUT APP_INITIALIZER)
7. `app.routes.ts`
8. Navbar component
9. Home feature (with RTL/responsive bugs)
10. Products feature (with DI + method-in-template bugs)
11. Search feature (with URL sync bugs)
12. Cart feature (with static payment providers)
13. Product detail stub
14. Design spec (`design-spec/product-card.html`)
15. `CANDIDATE_BRIEF.md`
16. Commit `main` branch
17. Checkout `feature/promo-code` branch
18. Create promo model + component (4 files with bugs)
19. Add `assets/data/promos.json`
20. Commit PR branch + open GitHub PR
21. `INTERVIEWER_GUIDE.md` (private, not pushed)

---

## SESSION_ID
- CODEX_SESSION: n/a (local planning)
- GEMINI_SESSION: n/a (local planning)
