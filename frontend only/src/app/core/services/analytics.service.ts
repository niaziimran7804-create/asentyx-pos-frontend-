import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  DashboardStats,
  SalesmanStats,
  AIInsight,
  TopProduct,
  RecentSale,
  SalesTrendData,
  CategorySales
} from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor() {}

  getAdminDashboardStats(): Observable<DashboardStats> {
    return of(null).pipe(
      delay(500),
      map(() => this.generateMockAdminStats())
    );
  }

  getSalesmanStats(salesmanId: string): Observable<SalesmanStats> {
    return of(null).pipe(
      delay(500),
      map(() => this.generateMockSalesmanStats(salesmanId))
    );
  }

  getAIInsights(): Observable<AIInsight[]> {
    const insights: AIInsight[] = [
      {
        id: '1',
        type: 'STOCK_PREDICTION',
        title: 'Low Stock Alert: Rice 5kg',
        description: 'Based on sales patterns, Rice 5kg will be out of stock in 3 days. Recommended reorder: 75 units.',
        confidence: 0.87,
        actionable: true,
        priority: 'HIGH',
        createdAt: new Date()
      },
      {
        id: '2',
        type: 'SALES_FORECAST',
        title: 'Weekend Sales Surge Expected',
        description: 'AI predicts 35% increase in beverage sales this weekend. Ensure adequate stock.',
        confidence: 0.78,
        actionable: true,
        priority: 'MEDIUM',
        createdAt: new Date()
      },
      {
        id: '3',
        type: 'CUSTOMER_PATTERN',
        title: 'Customer Purchase Pattern Detected',
        description: 'Customers buying milk also purchase bread 73% of the time. Consider bundling.',
        confidence: 0.91,
        actionable: true,
        priority: 'MEDIUM',
        createdAt: new Date()
      },
      {
        id: '4',
        type: 'PRICE_OPTIMIZATION',
        title: 'Price Optimization Opportunity',
        description: 'Chips 200g can sustain a 5% price increase without affecting demand significantly.',
        confidence: 0.65,
        actionable: false,
        priority: 'LOW',
        createdAt: new Date()
      }
    ];
    return of(insights).pipe(delay(400));
  }

  getSalesTrend(period: 'daily' | 'weekly' | 'monthly'): Observable<SalesTrendData[]> {
    return of(null).pipe(
      delay(400),
      map(() => this.generateMockSalesTrend(period))
    );
  }

  getCategoryWiseSales(): Observable<CategorySales[]> {
    return of([
      { categoryName: 'Beverages', totalSales: 450, revenue: 1250.50 },
      { categoryName: 'Groceries', totalSales: 380, revenue: 2890.00 },
      { categoryName: 'Snacks', totalSales: 520, revenue: 1560.75 },
      { categoryName: 'Dairy', totalSales: 290, revenue: 980.25 },
      { categoryName: 'Bakery', totalSales: 310, revenue: 775.50 }
    ]).pipe(delay(300));
  }

  private generateMockAdminStats(): DashboardStats {
    return {
      totalSales: 15847,
      totalRevenue: 47892.50,
      totalProfit: 12458.75,
      totalOrders: 1523,
      dailySales: 857.30,
      weeklySales: 5982.45,
      monthlySales: 24567.80,
      pendingPayments: 1250.00,
      lowStockProducts: 6,
      totalCustomers: 234,
      topSellingProducts: [
        { productId: '5', productName: 'Chips 200g', totalSold: 520, revenue: 1560.00 },
        { productId: '1', productName: 'Coca Cola 500ml', totalSold: 450, revenue: 450.00 },
        { productId: '4', productName: 'Rice 5kg', totalSold: 85, revenue: 1020.00 },
        { productId: '3', productName: 'Milk 1L', totalSold: 290, revenue: 580.00 },
        { productId: '2', productName: 'Bread Loaf', totalSold: 310, revenue: 775.00 }
      ],
      recentSales: [
        { billNumber: 'INV-2024-1045', customerName: 'Michael Brown', total: 45.50, timestamp: new Date() },
        { billNumber: 'INV-2024-1044', customerName: 'Walk-in Customer', total: 12.75, timestamp: new Date() },
        { billNumber: 'INV-2024-1043', customerName: 'Sarah Johnson', total: 89.20, timestamp: new Date() },
        { billNumber: 'INV-2024-1042', customerName: 'Emily Davis', total: 23.60, timestamp: new Date() },
        { billNumber: 'INV-2024-1041', customerName: 'David Wilson', total: 156.40, timestamp: new Date() }
      ],
      salesTrend: this.generateMockSalesTrend('daily'),
      categoryWiseSales: [
        { categoryName: 'Beverages', totalSales: 450, revenue: 1250.50 },
        { categoryName: 'Groceries', totalSales: 380, revenue: 2890.00 },
        { categoryName: 'Snacks', totalSales: 520, revenue: 1560.75 },
        { categoryName: 'Dairy', totalSales: 290, revenue: 980.25 },
        { categoryName: 'Bakery', totalSales: 310, revenue: 775.50 }
      ]
    };
  }

  private generateMockSalesmanStats(salesmanId: string): SalesmanStats {
    return {
      salesmanId,
      salesmanName: 'John Salesman',
      totalSales: 8945,
      totalRevenue: 26785.30,
      totalOrders: 856,
      commission: 1339.27,
      dailySales: 485.20,
      weeklySales: 3398.75,
      monthlySales: 14567.90,
      pendingCustomers: 5
    };
  }

  private generateMockSalesTrend(period: string): SalesTrendData[] {
    const data: SalesTrendData[] = [];
    const days = period === 'daily' ? 7 : period === 'weekly' ? 12 : 30;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 1000) + 500,
        revenue: Math.floor(Math.random() * 3000) + 1500,
        profit: Math.floor(Math.random() * 800) + 400
      });
    }
    
    return data;
  }

  exportReportToPDF(reportType: string): Observable<Blob> {
    return of(new Blob(['Mock PDF Report'], { type: 'application/pdf' })).pipe(delay(1000));
  }

  exportReportToCSV(reportType: string): Observable<Blob> {
    return of(new Blob(['Mock CSV Report'], { type: 'text/csv' })).pipe(delay(800));
  }
}
