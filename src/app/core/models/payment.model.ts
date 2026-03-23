export interface PaymentProvider {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export interface PaymentConfig {
  country: string;
  providers: PaymentProvider[];
}
