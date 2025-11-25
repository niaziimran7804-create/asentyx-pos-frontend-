export interface PurchaseReturnDto {
  returnId: number;
  orderId: number;
  productId: number;
  productName?: string;
  returnQuantity: number;
  returnAmount: number;
  returnReason: string;
  returnStatus: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  customerFullName?: string;
  customerPhone?: string;
  returnDate: Date;
  processedBy?: number;
  processedByName?: string;
  processedDate?: Date;
  refundMethod: 'Cash' | 'Card' | 'Store Credit';
  notes?: string;
}

export interface CreatePurchaseReturnDto {
  orderId: number;
  productId: number;
  returnQuantity: number;
  returnAmount: number;
  returnReason: string;
  refundMethod: 'Cash' | 'Card' | 'Store Credit';
  notes?: string;
}

export interface UpdateReturnStatusDto {
  returnStatus: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  notes?: string;
}

export interface ReturnFilterDto {
  startDate?: Date | string;
  endDate?: Date | string;
  status?: string;
  customerId?: number;
  productId?: number;
}

export interface ReturnSummaryDto {
  totalReturns: number;
  pendingReturns: number;
  approvedReturns: number;
  completedReturns: number;
  rejectedReturns: number;
  totalReturnAmount: number;
}
