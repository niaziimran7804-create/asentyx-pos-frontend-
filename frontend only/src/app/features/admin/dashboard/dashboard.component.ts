import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ProductService } from '../../../core/services/product.service';
import { DashboardStats, AIInsight } from '../../../core/models/analytics.model';
import { StockAlert } from '../../../core/models/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  stockAlerts: StockAlert[] = [];
  aiInsights: AIInsight[] = [];
  isLoading = true;

  // Chart Options
  salesTrendChartOptions: any;
  categoryChartOptions: any;
  revenueChartOptions: any;

  constructor(
    private analyticsService: AnalyticsService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Admin Dashboard ngOnInit called');
    this.loadDashboardData();
    
    // Timeout fallback to prevent infinite loading
    setTimeout(() => {
      if (this.isLoading) {
        console.warn('Dashboard loading timeout - forcing completion');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 5000);
  }

  loadDashboardData(): void {
    console.log('Loading dashboard data...');
    this.isLoading = true;

    // Load all dashboard data
    this.analyticsService.getAdminDashboardStats().subscribe({
      next: (stats) => {
        console.log('Dashboard stats loaded:', stats);
        this.stats = stats;
        this.setupCharts();
        this.isLoading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.isLoading = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });

    this.productService.getStockAlerts().subscribe({
      next: (alerts) => {
        this.stockAlerts = alerts;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading stock alerts:', error);
      }
    });

    this.analyticsService.getAIInsights().subscribe({
      next: (insights) => {
        this.aiInsights = insights;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading AI insights:', error);
      }
    });
  }

  setupCharts(): void {
    if (!this.stats) return;

    // Sales Trend Chart
    this.salesTrendChartOptions = {
      series: [{
        name: 'Revenue',
        data: this.stats.salesTrend.map(d => d.revenue)
      }, {
        name: 'Profit',
        data: this.stats.salesTrend.map(d => d.profit)
      }],
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        animations: { enabled: true, speed: 800 }
      },
      colors: ['#2196f3', '#4caf50'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        categories: this.stats.salesTrend.map(d => d.date)
      },
      tooltip: { theme: 'light' },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3
        }
      }
    };

    // Category Sales Chart
    this.categoryChartOptions = {
      series: this.stats.categoryWiseSales.map(c => c.revenue),
      chart: {
        type: 'donut',
        height: 350,
        animations: { enabled: true }
      },
      labels: this.stats.categoryWiseSales.map(c => c.categoryName),
      colors: ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0'],
      legend: { position: 'bottom' },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: 'bottom' }
        }
      }]
    };

    // Revenue Chart (Bar)
    this.revenueChartOptions = {
      series: [{
        name: 'Sales',
        data: this.stats.salesTrend.slice(-7).map(d => d.sales)
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          distributed: false,
          columnWidth: '50%'
        }
      },
      colors: ['#2196f3'],
      dataLabels: { enabled: false },
      xaxis: {
        categories: this.stats.salesTrend.slice(-7).map(d => d.date)
      }
    };
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  getInsightIcon(type: string): string {
    switch (type) {
      case 'STOCK_PREDICTION': return 'fas fa-box';
      case 'SALES_FORECAST': return 'fas fa-chart-line';
      case 'CUSTOMER_PATTERN': return 'fas fa-users';
      case 'PRICE_OPTIMIZATION': return 'fas fa-dollar-sign';
      default: return 'fas fa-lightbulb';
    }
  }
}
