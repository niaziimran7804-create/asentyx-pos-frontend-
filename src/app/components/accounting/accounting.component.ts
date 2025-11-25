import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountingService } from '../../services/accounting.service';
import { 
  AccountingEntryDto, 
  CreateAccountingEntryDto, 
  DailySalesDto, 
  AccountingSummaryDto,
  PaymentMethodSummaryDto,
  TopProductDto,
  AccountingFilterDto,
  SalesGraphDto
} from '../../models/accounting.models';
import Swal from 'sweetalert2';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTooltip, ApexStroke, ApexYAxis, ApexGrid, ApexLegend, ApexTitleSubtitle } from 'ng-apexcharts';

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
  title: ApexTitleSubtitle;
  colors: string[];
};

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingComponent implements OnInit {
  currentUser: any;
  isSidebarCollapsed = false;
  menuItems: MenuItem[] = [];
  activeTab: 'dashboard' | 'entries' | 'reports' = 'dashboard';
  loading: boolean = false;

  // Dashboard Data
  summary: AccountingSummaryDto | null = null;
  dailySales: DailySalesDto[] = [];
  paymentMethods: PaymentMethodSummaryDto[] = [];
  topProducts: TopProductDto[] = [];

  // Chart Options
  salesChartOptions: Partial<ChartOptions> | null = null;
  revenueChartOptions: Partial<ChartOptions> | null = null;

  // Accounting Entries
  entries: AccountingEntryDto[] = [];
  showEntryForm = false;
  entryForm: CreateAccountingEntryDto = this.getEmptyEntryForm();

  // Filters
  filterForm: AccountingFilterDto = {};
  dateRange: 'today' | 'week' | 'month' | 'year' | 'custom' = 'month';
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private authService: AuthService,
    private accountingService: AccountingService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.setupMenuItems();
  }

  ngOnInit(): void {
    this.loading = true;
    this.setDateRange(this.dateRange);
    this.loadDashboardData();
  }

  setupMenuItems(): void {
    this.menuItems = [
      { label: 'Dashboard', icon: 'fas fa-chart-line', route: '/dashboard' },
      { label: 'Products', icon: 'fas fa-box', route: '/products' },
      { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
      { label: 'Categories', icon: 'fas fa-tags', route: '/categories' },
      { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' },
      { label: 'Accounting', icon: 'fas fa-calculator', route: '/accounting' }
    ];

    if (this.isAdmin() || this.isCashier()) {
      this.menuItems.push({ label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' });
    }

    if (this.isAdmin()) {
      this.menuItems.push({ label: 'Expenses', icon: 'fas fa-money-bill-wave', route: '/expenses' });
      this.menuItems.push({ label: 'Users', icon: 'fas fa-users', route: '/users' });
    }
  }

  get sidebarWidth(): string {
    return this.isSidebarCollapsed ? '80px' : '250px';
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  setTab(tab: 'dashboard' | 'entries' | 'reports'): void {
    this.activeTab = tab;
    if (tab === 'entries') {
      this.loadEntries();
    }
  }

  setDateRange(range: 'today' | 'week' | 'month' | 'year' | 'custom'): void {
    this.dateRange = range;
    const now = new Date();
    this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    if (range === 'custom') {
      // User will set dates manually
      return;
    }

    switch (range) {
      case 'today':
        this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        break;
      case 'week':
        this.startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        this.startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    let completedCalls = 0;
    const totalCalls = 5;
    const checkComplete = () => {
      completedCalls++;
      if (completedCalls >= totalCalls) {
        this.loading = false;
      }
    };
    
    this.loadSummary(checkComplete);
    this.loadDailySales(checkComplete);
    this.loadPaymentMethods(checkComplete);
    this.loadTopProducts(checkComplete);
    this.loadSalesChart(checkComplete);
  }

  refreshData(): void {
    this.loadDashboardData();
    Swal.fire({
      icon: 'success',
      title: 'Data Refreshed',
      text: 'All accounting data has been updated',
      timer: 2000,
      showConfirmButton: false
    });
  }

  loadSummary(callback?: () => void): void {
    if (!this.startDate || !this.endDate) {
      callback?.();
      return;
    }

    this.accountingService.getAccountingSummary(this.startDate, this.endDate).subscribe({
      next: (data: AccountingSummaryDto) => {
        this.summary = data;
        callback?.();
      },
      error: (error: any) => {
        console.error('Error loading summary:', error);
        callback?.();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load financial summary'
        });
      }
    });
  }

  loadDailySales(callback?: () => void): void {
    this.accountingService.getDailySales(7).subscribe({
      next: (data: DailySalesDto[]) => {
        this.dailySales = data;
        callback?.();
      },
      error: (error: any) => {
        console.error('Error loading daily sales:', error);
        callback?.();
      }
    });
  }

  loadPaymentMethods(callback?: () => void): void {
    if (!this.startDate || !this.endDate) {
      callback?.();
      return;
    }

    this.accountingService.getPaymentMethodSummary(this.startDate, this.endDate).subscribe({
      next: (data: PaymentMethodSummaryDto[]) => {
        this.paymentMethods = data;
        callback?.();
      },
      error: (error: any) => {
        console.error('Error loading payment methods:', error);
      }
    });
  }

  loadTopProducts(callback?: () => void): void {
    this.accountingService.getTopProducts(10, this.startDate || undefined, this.endDate || undefined).subscribe({
      next: (data: TopProductDto[]) => {
        this.topProducts = data;
        callback?.();
      },
      error: (error: any) => {
        console.error('Error loading top products:', error);
        callback?.();
      }
    });
  }

  loadSalesChart(callback?: () => void): void {
    if (!this.startDate || !this.endDate) {
      callback?.();
      return;
    }

    this.accountingService.getSalesGraph(this.startDate, this.endDate).subscribe({
      next: (data: SalesGraphDto) => {
        this.initializeSalesChart(data);
        this.initializeRevenueChart(data);
        callback?.();
      },
      error: (error: any) => {
        console.error('Error loading sales chart:', error);
        callback?.();
      }
    });
  }

  initializeSalesChart(data: any): void {
    this.salesChartOptions = {
      series: [
        {
          name: 'Sales',
          data: data.salesData || []
        },
        {
          name: 'Expenses',
          data: data.expensesData || []
        },
        {
          name: 'Profit',
          data: data.profitData || []
        }
      ],
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: true
        }
      },
      colors: ['#667eea', '#f56565', '#48bb78'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: data.labels || [],
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
    } as Partial<ChartOptions>;
  }

  initializeRevenueChart(data: any): void {
    this.revenueChartOptions = {
      series: [
        {
          name: 'Orders',
          data: data.ordersData || []
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: true
        }
      },
      colors: ['#764ba2'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        categories: data.labels || [],
        labels: {
          style: {
            colors: '#6b7280'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: (value) => {
            return value.toFixed(0);
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
            return value.toFixed(0) + ' orders';
          }
        }
      }
    };
  }

  loadEntries(): void {
    this.accountingService.getAccountingEntries(this.filterForm).subscribe({
      next: (data) => {
        this.entries = data;
      },
      error: (error) => {
        console.error('Error loading entries:', error);
      }
    });
  }

  applyFilter(): void {
    this.loadDashboardData();
  }

  resetFilter(): void {
    this.filterForm = {};
    this.setDateRange('month');
  }

  showAddEntryForm(): void {
    this.showEntryForm = true;
    this.entryForm = this.getEmptyEntryForm();
  }

  createEntry(): void {
    this.accountingService.createAccountingEntry(this.entryForm).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Accounting entry created successfully',
          confirmButtonColor: '#667eea',
          timer: 2000
        });
        this.loadEntries();
        this.loadDashboardData();
        this.cancelEntryForm();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create accounting entry',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  deleteEntry(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.accountingService.deleteAccountingEntry(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Entry has been deleted.',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadEntries();
            this.loadDashboardData();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete entry',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }

  cancelEntryForm(): void {
    this.showEntryForm = false;
    this.entryForm = this.getEmptyEntryForm();
  }

  getEmptyEntryForm(): CreateAccountingEntryDto {
    return {
      entryType: 'Income',
      amount: 0,
      description: '',
      entryDate: new Date()
    };
  }

  exportReport(format: 'csv' | 'pdf'): void {
    this.accountingService.exportAccountingReport(format, this.filterForm).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `accounting_report.${format}`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Report exported successfully',
          confirmButtonColor: '#667eea',
          timer: 2000
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to export report',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
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
