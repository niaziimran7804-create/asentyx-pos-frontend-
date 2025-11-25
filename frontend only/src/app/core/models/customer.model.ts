export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  area: string; // New field for customer area/location
  discountEligible: boolean;
  discountPercent: number;
  totalPurchases: number;
  pendingAmount: number;
  lastPurchaseDate?: Date;
  createdAt: Date;
}

export interface CustomerPurchaseHistory {
  customerId: string;
  bills: Bill[];
  totalSpent: number;
  totalPending: number;
  averageOrderValue: number;
}

export interface CustomerLedger {
  customerId: string;
  customerName: string;
  area: string;
  phone: string;
  address?: string;
  bills: Bill[];
  totalPending: number;
  lastPaymentDate?: Date;
}

export interface PendingPaymentFilter {
  area?: string;
  minAmount?: number;
  maxAmount?: number;
  customerName?: string;
  sortBy?: 'amount' | 'date' | 'area' | 'customer';
  sortOrder?: 'asc' | 'desc';
}

export interface Bill {
  id: string;
  billNumber: string;
  customerId?: string;
  customerName: string;
  salesmanId: string;
  salesmanName: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentStatus: 'PAID' | 'PENDING';
  paymentMethod?: string;
  createdAt: Date;
  dueDate?: Date;
}

export interface BillItem {
  productId: string;
  productName: string;
  barcode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}
