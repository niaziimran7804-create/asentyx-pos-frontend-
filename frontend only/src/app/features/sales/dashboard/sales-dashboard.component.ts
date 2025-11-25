import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { AuthService } from '../../../core/services/auth.service';
import { SalesmanStats } from '../../../core/models/analytics.model';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgApexchartsModule],
  styleUrls: ['./sales-dashboard.component.scss'],
  template: `
    <div class="fade-in">
      <div class="mb-4">
        <h1 class="display-5 fw-bold text-dark">Salesman Dashboard</h1>
        <p class="text-muted mt-1">Track your performance and daily sales</p>
      </div>

      <div *ngIf="stats" class="mb-4">
        <!-- KPI Cards -->
        <div class="row g-4 mb-4">
          <div class="col-12 col-md-6 col-lg-3">
            <div class="kpi-card kpi-primary rounded shadow-lg p-4 text-white">
              <p class="small opacity-75">Today's Sales</p>
              <h3 class="display-6 fw-bold mt-2">\${{ stats.dailySales.toFixed(2) }}</h3>
              <p class="small mt-2 opacity-75">Keep up the great work!</p>
            </div>
          </div>

          <div class="col-12 col-md-6 col-lg-3">
            <div class="kpi-card kpi-success rounded shadow-lg p-4 text-white">
              <p class="small opacity-75">This Month</p>
              <h3 class="display-6 fw-bold mt-2">\${{ stats.monthlySales.toFixed(2) }}</h3>
              <p class="small mt-2 opacity-75">{{ stats.totalOrders }} orders</p>
            </div>
          </div>

          <div class="col-12 col-md-6 col-lg-3">
            <div class="kpi-card kpi-purple rounded shadow-lg p-4 text-white">
              <p class="small opacity-75">Commission</p>
              <h3 class="display-6 fw-bold mt-2">\${{ stats.commission.toFixed(2) }}</h3>
              <p class="small mt-2 opacity-75">Your earnings</p>
            </div>
          </div>

          <div class="col-12 col-md-6 col-lg-3">
            <div class="kpi-card kpi-warning rounded shadow-lg p-4 text-white">
              <p class="small opacity-75">Pending</p>
              <h3 class="display-6 fw-bold mt-2">{{ stats.pendingCustomers }}</h3>
              <p class="small mt-2 opacity-75">customers with pending payments</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="row g-4">
          <div class="col-12 col-md-4">
            <a routerLink="/sales/sell" class="action-card bg-white rounded shadow p-4 border text-center d-block text-decoration-none">
              <div class="action-icon bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                <i class="fas fa-cash-register fs-2"></i>
              </div>
              <h3 class="h5 fw-semibold text-dark">Start Selling</h3>
              <p class="small text-muted mt-2">Process new transactions</p>
            </a>
          </div>

          <div class="col-12 col-md-4">
            <a routerLink="/sales/receipts" class="action-card bg-white rounded shadow p-4 border text-center d-block text-decoration-none">
              <div class="action-icon bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                <i class="fas fa-receipt fs-2"></i>
              </div>
              <h3 class="h5 fw-semibold text-dark">View Receipts</h3>
              <p class="small text-muted mt-2">Browse previous bills</p>
            </a>
          </div>

          <div class="col-12 col-md-4">
            <a routerLink="/sales/returns" class="action-card bg-white rounded shadow p-4 border text-center d-block text-decoration-none">
              <div class="action-icon bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                <i class="fas fa-undo fs-2"></i>
              </div>
              <h3 class="h5 fw-semibold text-dark">Process Returns</h3>
              <p class="small text-muted mt-2">Handle product returns</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SalesDashboardComponent implements OnInit {
  stats: SalesmanStats | null = null;

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Sales Dashboard ngOnInit called');
    const user = this.authService.getCurrentUser();
    console.log('Current user:', user);
    
    if (user) {
      this.analyticsService.getSalesmanStats(user.id).subscribe({
        next: (stats) => {
          console.log('Salesman stats loaded:', stats);
          this.stats = stats;
          this.cdr.detectChanges(); // Force change detection
        },
        error: (error) => {
          console.error('Error loading salesman stats:', error);
          // Set default stats to prevent loading indefinitely
          this.stats = {
            salesmanId: user.id,
            salesmanName: user.fullName,
            dailySales: 0,
            weeklySales: 0,
            monthlySales: 0,
            totalSales: 0,
            totalRevenue: 0,
            commission: 0,
            totalOrders: 0,
            pendingCustomers: 0
          };
          this.cdr.detectChanges(); // Force change detection
        }
      });
    } else {
      console.warn('No user found, setting default stats');
      // Set default stats if no user
      this.stats = {
        salesmanId: '',
        salesmanName: 'Guest',
        dailySales: 0,
        weeklySales: 0,
        monthlySales: 0,
        totalSales: 0,
        totalRevenue: 0,
        commission: 0,
        totalOrders: 0,
        pendingCustomers: 0
      };
      this.cdr.detectChanges(); // Force change detection
    }
  }
}
