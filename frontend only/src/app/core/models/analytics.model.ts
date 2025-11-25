export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  pendingPayments: number;
  lowStockProducts: number;
  totalCustomers: number;
  topSellingProducts: TopProduct[];
  recentSales: RecentSale[];
  salesTrend: SalesTrendData[];
  categoryWiseSales: CategorySales[];
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  revenue: number;
}

export interface RecentSale {
  billNumber: string;
  customerName: string;
  total: number;
  timestamp: Date;
}

export interface SalesTrendData {
  date: string;
  sales: number;
  revenue: number;
  profit: number;
}

export interface CategorySales {
  categoryName: string;
  totalSales: number;
  revenue: number;
}

export interface SalesmanStats {
  salesmanId: string;
  salesmanName: string;
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  commission: number;
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  pendingCustomers: number;
}

export interface AIInsight {
  id: string;
  type: 'STOCK_PREDICTION' | 'SALES_FORECAST' | 'CUSTOMER_PATTERN' | 'PRICE_OPTIMIZATION';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
}
