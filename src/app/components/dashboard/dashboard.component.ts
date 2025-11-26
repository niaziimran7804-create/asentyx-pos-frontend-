import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { AccountingService } from '../../services/accounting.service';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTooltip, ApexStroke, ApexYAxis, ApexGrid, ApexLegend } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  colors: string[];
};

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  totalProducts: number = 0;
  availableProducts: number = 0;
  unavailableProducts: number = 0;
  isSidebarCollapsed = false;
  menuItems: MenuItem[] = [];
  loading: boolean = false;
  
  salesChartOptions: Partial<ChartOptions> | null = null;
  dailySales: any[] = [];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private accountingService: AccountingService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.setupMenuItems();
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadStats();
    this.loadSalesChart();
  }

  setupMenuItems(): void {
    this.menuItems = [
      { label: 'Dashboard', icon: 'fas fa-chart-line', route: '/dashboard' },
      { label: 'Products', icon: 'fas fa-box', route: '/products' },
      { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
      { label: 'Returns', icon: 'fas fa-undo', route: '/returns' },
      { label: 'Categories', icon: 'fas fa-tags', route: '/categories' },
      { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' },
      { label: 'Accounting', icon: 'fas fa-calculator', route: '/accounting' },
      { label: 'Customer Balance', icon: 'fas fa-users-cog', route: '/customer-balance' }
    ];

    if (this.isAdmin() || this.getUserRole() === 'Cashier') {
      this.menuItems.push({ label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' });
    }

    if (this.isAdmin()) {
      this.menuItems.push({ label: 'Expenses', icon: 'fas fa-money-bill-wave', route: '/expenses' });
      this.menuItems.push({ label: 'Users', icon: 'fas fa-users', route: '/users' });
    }
  }

  get sidebarWidth(): string {
    return this.isSidebarCollapsed ? '80px' : '280px';
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  loadStats(): void {
    let completedCalls = 0;
    const checkComplete = () => {
      completedCalls++;
      if (completedCalls === 3) this.loading = false;
    };
    
    this.productService.getTotalProducts().subscribe({
      next: count => this.totalProducts = count,
      error: () => checkComplete(),
      complete: () => checkComplete()
    });
    this.productService.getAvailableProducts().subscribe({
      next: count => this.availableProducts = count,
      error: () => checkComplete(),
      complete: () => checkComplete()
    });
    this.productService.getUnavailableProducts().subscribe({
      next: count => this.unavailableProducts = count,
      error: () => checkComplete(),
      complete: () => checkComplete()
    });
  }

  loadSalesChart(): void {
    // Load sales data from API for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29); // Last 30 days

    this.accountingService.getSalesGraph(startDate, endDate).subscribe({
      next: (graphData) => {
        // Use real data from API
        this.salesChartOptions = {
          series: [
            {
              name: 'Sales',
              data: graphData.salesData
            },
            {
              name: 'Profit',
              data: graphData.profitData
            }
          ],
          chart: {
            type: 'line',
            height: 300,
            toolbar: {
              show: true
            }
          },
          colors: ['#667eea', '#48bb78'],
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width: 3
          },
          xaxis: {
            categories: graphData.labels,
            labels: {
              style: {
                colors: '#6b7280'
              }
            }
          },
          yaxis: {
            labels: {
              formatter: (value) => {
                return '$' + value.toFixed(2);
              },
              style: {
                colors: '#6b7280'
              }
            }
          },
          grid: {
            borderColor: '#e5e7eb'
          },
          legend: {
            position: 'top'
          },
          tooltip: {
            y: {
              formatter: (value) => {
                return '$' + value.toFixed(2);
              }
            }
          }
        };
      },
      error: (error) => {
        console.error('Error loading sales graph:', error);
        // Fallback to empty chart if API fails
        this.initializeEmptyChart();
      }
    });

    // Load daily sales summary for recent days
    this.accountingService.getDailySales(7).subscribe({
      next: (data) => {
        this.dailySales = data;
      },
      error: (error) => {
        console.error('Error loading daily sales:', error);
      }
    });
  }

  initializeEmptyChart(): void {
    const labels: string[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    this.salesChartOptions = {
      series: [
        { name: 'Sales', data: Array(30).fill(0) },
        { name: 'Profit', data: Array(30).fill(0) }
      ],
      chart: {
        type: 'line',
        height: 300,
        toolbar: { show: true }
      },
      colors: ['#667eea', '#48bb78'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: {
        categories: labels,
        labels: { style: { colors: '#6b7280' } }
      },
      yaxis: {
        labels: {
          formatter: (value) => '$' + value.toFixed(2),
          style: { colors: '#6b7280' }
        }
      },
      grid: { borderColor: '#e5e7eb' },
      legend: { position: 'top' },
      tooltip: {
        y: { formatter: (value) => '$' + value.toFixed(2) }
      }
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCashier(): boolean {
    return this.authService.isCashier();
  }

  getUserRole(): string {
    return this.currentUser?.role || 'User';
  }
}

