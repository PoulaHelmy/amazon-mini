export interface CartItem {
  productId: number;
  name: string;
  nameAr: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
