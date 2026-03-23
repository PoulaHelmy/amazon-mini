// BUG 1: PascalCase fields — TypeScript interfaces should use camelCase
// BUG 2: `Discount_Value` vs `discountValue`, `Minimum_Amount` vs `minimumAmount`
export interface PromoCode {
  Code: string;
  Discount_Type: 'percentage' | 'fixed';
  Discount_Value: number;
  Minimum_Amount: number;
  Expiry_Date: string;
  IsActive: boolean;
  Usage_Limit: number;
  Used_Count: number;
}

// BUG 3: Using var instead of const/let
var DEFAULT_PROMO_CODES: PromoCode[] = [
  {
    Code: 'SAVE10',
    Discount_Type: 'percentage',
    Discount_Value: 10,
    Minimum_Amount: 50,
    Expiry_Date: '2025-12-31',
    IsActive: true,
    Usage_Limit: 100,
    Used_Count: 45,
  },
  {
    Code: 'FLAT20',
    Discount_Type: 'fixed',
    Discount_Value: 20,
    Minimum_Amount: 100,
    Expiry_Date: '2025-06-30',
    IsActive: false,
    Usage_Limit: 50,
    Used_Count: 50,
  },
];

export { DEFAULT_PROMO_CODES };
