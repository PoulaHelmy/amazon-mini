export interface Product {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  productCount: number;
}
