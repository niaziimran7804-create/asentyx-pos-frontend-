export interface StoreSettings {
  id: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  logoUrl?: string;
  currency: string;
  taxRate: number;
  defaultDiscountPolicy: string;
  receiptHeader?: string;
  receiptFooter?: string;
  theme: 'light' | 'dark';
}

export interface TaxSettings {
  defaultTaxRate: number;
  taxName: string;
  taxNumber?: string;
}

export interface DiscountPolicy {
  maxDiscountPercent: number;
  requiresApproval: boolean;
  approvalThreshold: number;
}
