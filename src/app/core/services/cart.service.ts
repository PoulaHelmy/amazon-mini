import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  addToCart(product: Product): void {
    const current = this._items();
    const existing = current.find(item => item.productId === product.id);
    if (existing) {
      this._items.set(
        current.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this._items.set([
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
      ]);
    }
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
