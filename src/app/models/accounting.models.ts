export interface AccountingEntryDto {
  entryId: number;
  entryDate: Date;
  entryType: 'Income' | 'Expense' | 'Sale' | 'Purchase' | 'Payment' | 'Refund' | 'SalesReturn';
  amount: number;
  description: string;
  referenceId?: number;
  referenceType?: string;
  paymentMethod?: string;
  category?: string;
  createdBy: string;
  createdAt: Date;
  // Sales Return specific fields
  costOfGoodsSold?: number;
  profitImpact?: number;
  returnedItems?: Array<{
    productId: number;
    productName: string;
    quantity: number;
    amount: number;
  }>;
}

export interface CreateAccountingEntryDto {
  entryType: 'Income' | 'Expense' | 'Sale' | 'Purchase' | 'Payment' | 'Refund' | 'SalesReturn';
  amount: number;
  description: string;
  entryDate?: Date;
  referenceId?: number;
  referenceType?: string;
  paymentMethod?: string;
  category?: string;
  costOfGoodsSold?: number;
  profitImpact?: number;
}

export interface DailySalesDto {
  date: string;
  totalSales: number;
  totalOrders: number;
  totalExpenses: number;
  totalRefunds: number;
  netProfit: number;
  cashSales: number;
  cardSales: number;
  averageOrderValue: number;
}

export interface SalesGraphDto {
  labels: string[];
  salesData: number[];
  expensesData: number[];
  profitData: number[];
  ordersData: number[];
}

export interface AccountingSummaryDto {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalSales: number;
  totalPurchases: number;
  totalReturns?: number;
  totalReturnAmount?: number;
  cashBalance: number;
  period: string;
}

export interface PaymentMethodSummaryDto {
  paymentMethod: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface CategoryWiseSalesDto {
  categoryName: string;
  totalSales: number;
  totalOrders: number;
  percentage: number;
}

export interface TopProductDto {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
}

export interface AccountingFilterDto {
  startDate?: Date;
  endDate?: Date;
  entryType?: string;
  paymentMethod?: string;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
}
