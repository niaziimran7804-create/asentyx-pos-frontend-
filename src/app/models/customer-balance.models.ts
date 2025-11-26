export interface CustomerBalanceDto {
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  currentBalance: number;
  days0To30: number;
  days31To60: number;
  days61To90: number;
  days91Plus: number;
  totalOutstanding: number;
  lastTransactionDate: Date;
  totalInvoices: number;
  unpaidInvoices: number;
}

export interface AgingReportResponseDto {
  reportDate: Date;
  asOfDate: Date;
  customers: CustomerBalanceDto[];
  totalDays0To30: number;
  totalDays31To60: number;
  totalDays61To90: number;
  totalDays91Plus: number;
  grandTotal: number;
  totalCustomers: number;
  customersWithBalance: number;
}

export interface CustomerBalanceFilterDto {
  asOfDate?: string;
  searchTerm?: string;
  minBalance?: number;
  maxBalance?: number;
  page?: number;
  limit?: number;
}
