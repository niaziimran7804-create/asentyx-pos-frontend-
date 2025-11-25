export interface Return {
  id: string;
  returnNumber: string;
  originalBillId: string;
  originalBillNumber: string;
  customerId?: string;
  customerName: string;
  salesmanId: string;
  salesmanName: string;
  items: ReturnItem[];
  subtotal: number;
  tax: number;
  total: number;
  refundAmount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  createdAt: Date;
  processedAt?: Date;
}

export interface ReturnItem {
  billItemId: string;
  productId: string;
  productName: string;
  barcode: string;
  originalQuantity: number;
  returnQuantity: number;
  unitPrice: number;
  total: number;
  reason: string;
}

export interface ReturnCreateRequest {
  originalBillId: string;
  items: ReturnItemRequest[];
  reason: string;
}

export interface ReturnItemRequest {
  billItemId: string;
  productId: string;
  returnQuantity: number;
  reason: string;
}
