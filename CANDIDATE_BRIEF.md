# ShopMini — Angular Frontend Interview Challenge

Welcome! This challenge is designed to evaluate your Angular skills across three tasks of increasing depth. You have **90 minutes** total. Work on what you can — quality over quantity.

---

## Tech Stack

- Angular 21 (standalone components, signals)
- ngx-translate for i18n
- PrimeNG 21 with Aura theme
- Node 20 (see `.nvmrc`)

## Setup

```bash
nvm use        # uses Node 20 from .nvmrc
npm install
npm start      # http://localhost:4200
```

---

## Task 1 — PR Review (20 min)

A teammate opened a PR on the `feature/promo-code` branch. Review the code and write your feedback as if you're commenting on GitHub.

**Branch:** `feature/promo-code`  
**Files changed:** 4 files

```bash
git checkout feature/promo-code
git diff main feature/promo-code
```

Write your review in a file: `PR_REVIEW.md`

Things to look for:
- Naming conventions
- TypeScript best practices
- Angular patterns
- Memory management
- Code quality & maintainability

---

## Task 2 — Implement ProductCard Component (30 min)

The `ProductCardComponent` exists in `src/app/shared/components/product-card/` but needs to be fully implemented to match the design spec.

**Design spec:** `design-spec/product-card-design-spec.pdf`  
**Reference HTML:** `design-spec/product-card.html` (open in browser for visual reference)

**Requirements:**
1. Display all 6 card states: normal, on-sale (with % badge), out-of-stock (overlay + disabled button), new (badge), featured (badge), low-stock (warning text)
2. Use Angular signals: `input.required<Product>()`, `output<Product>()`, `computed()`
3. Price display must use the `CurrencyFormatPipe` (already exists)
4. Support RTL — the card must flip correctly when `dir="rtl"` is set on `<html>`
5. The "Add to Cart" button must emit the product via the `addToCart` output
6. Show star rating and review count

All 6 states are already represented in the product data at `/assets/data/products.json`.

---

## Task 3 — Project Review & Feature Implementation (40 min)

Review the codebase and address as many of the following as you can.

### 3a. Angular Patterns & Architecture
- Something in `app.ts` is wrong from a software design perspective — what is it and how would you fix it?
- `AppConfigService` exists but the config is never actually loaded from the server before the app starts — how would you fix this?

### 3b. Dependency Injection Bug
- There is a DI bug that causes adding to cart in the product list page to **not update** the navbar cart count. Find it and fix it.

### 3c. HTTP Layer
The app makes HTTP calls but lacks important cross-cutting concerns. Implement:
1. A locale interceptor that adds `Accept-Language` and `X-Country` headers to all requests
2. A loading interceptor that tracks in-flight requests and shows a global spinner
3. An error interceptor that catches HTTP errors and shows user-friendly notifications

Stub files exist in `src/app/core/interceptors/`.

### 3d. Routing
- Add a route resolver for `products/:id` so product data is pre-fetched before the detail component loads. A stub exists in `src/app/core/resolvers/product.resolver.ts`.

### 3e. Search Page Bug
- The search page has a bug: searching and then navigating away loses your search term when pressing browser back. Find and fix it.

### 3f. Performance
- There is a performance bug in the product list where a function is called in the template that gets executed on every change detection cycle across all 60 products. Find and fix it.

### 3g. RTL Support
- The app claims to support RTL (Arabic) but several components have hardcoded directional CSS. Find and fix at least 2 instances using CSS logical properties.

---

## Submission

When done, push your changes:

```bash
git add .
git commit -m "feat: interview submission"
git push
```

Good luck! 🚀
