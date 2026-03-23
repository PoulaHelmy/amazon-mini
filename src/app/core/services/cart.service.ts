import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);
  private readonly _items$ = new BehaviorSubject<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  /** Observable stream of cart items — useful for reactive subscriptions */
  readonly items$ = this._items$.asObservable();

  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  addToCart(product: Product): void {
    const current = this._items();
    const existing = current.find(item => item.productId === product.id);
    let next: CartItem[];
    if (existing) {
      next = current.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      next = [
        ...current,
        {
          productId: product.id,
          name: product.name,
          nameAr: product.nameAr,
          price: product.price,
          currency: product.currency,
          image: product.image,
          quantity: 1,
        },
      ];
    }
    this._items.set(next);
    this._items$.next(next);
  }

  removeFromCart(productId: number): void {
    this._items.set(this._items().filter(item => item.productId !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this._items.set(
      this._items().map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }

  clearCart(): void {
    this._items.set([]);
  }
}
