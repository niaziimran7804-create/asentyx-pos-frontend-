import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer, PendingPaymentFilter, CustomerLedger } from '../../../core/models/customer.model';

@Component({
  selector: 'app-pending-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./pending-payments.component.scss'],
  template: `
    <div class="fade-in">
      <div class="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 class="display-5 fw-bold text-dark">Pending Payments</h1>
          <p class="text-muted mt-1">Manage and track pending customer payments</p>
        </div>
        <button class="btn btn-success" (click)="generateLedger()" [disabled]="filteredCustomers.length === 0">
          <i class="fas fa-file-pdf me-2"></i>Generate Ledger Report
        </button>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded shadow p-4 border mb-4">
        <h3 class="h5 fw-semibold mb-3">
          <i class="fas fa-filter me-2 text-primary"></i>Filter Options
        </h3>
        
        <div class="row g-3">
          <!-- Area Filter -->
          <div class="col-12 col-md-3">
            <label class="form-label fw-medium">Area</label>
            <select class="form-select" [(ngModel)]="filter.area" (change)="applyFilters()">
              <option value="">All Areas</option>
              <option *ngFor="let area of areas" [value]="area">{{ area }}</option>
            </select>
          </div>

          <!-- Min Amount Filter -->
          <div class="col-12 col-md-3">
            <label class="form-label fw-medium">Min Amount ($)</label>
            <input type="number" class="form-control" [(ngModel)]="filter.minAmount" 
                   (input)="applyFilters()" placeholder="0">
          </div>

          <!-- Max Amount Filter -->
          <div class="col-12 col-md-3">
            <label class="form-label fw-medium">Max Amount ($)</label>
            <input type="number" class="form-control" [(ngModel)]="filter.maxAmount" 
                   (input)="applyFilters()" placeholder="10000">
          </div>

          <!-- Customer Search -->
          <div class="col-12 col-md-3">
            <label class="form-label fw-medium">Customer Name</label>
            <input type="text" class="form-control" [(ngModel)]="filter.customerName" 
                   (input)="applyFilters()" placeholder="Search...">
          </div>

          <!-- Sort By -->
          <div class="col-12 col-md-3">
            <label class="form-label fw-medium">Sort By</label>
            <select class="form-select" [(ngModel)]="filter.sortBy" (change)="applyFilters()">
              <option value="amount">Amount</option>
              <option value="customer">Customer Name</option>
              <option value="area">Area</option>
              <option value="date">Last Purchase Date</option>
            </select>
          </div>

          <!-- Sort Order -->
          <div class="col-12 col-md-3">
            <label class="form-label fw-medium">Order</label>
            <select class="form-select" [(ngModel)]="filter.sortOrder" (change)="applyFilters()">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <!-- Clear Filters -->
          <div class="col-12 col-md-6 d-flex align-items-end">
            <button class="btn btn-outline-secondary w-100" (click)="clearFilters()">
              <i class="fas fa-times me-2"></i>Clear Filters
            </button>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="row g-3 mt-3 pt-3 border-top">
          <div class="col-12 col-md-3">
            <div class="text-center p-3 bg-primary-subtle rounded">
              <p class="mb-1 small text-muted">Total Customers</p>
              <h4 class="mb-0 fw-bold text-primary">{{ filteredCustomers.length }}</h4>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-center p-3 bg-danger-subtle rounded">
              <p class="mb-1 small text-muted">Total Pending</p>
              <h4 class="mb-0 fw-bold text-danger">\${{ getTotalPending().toFixed(2) }}</h4>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-center p-3 bg-warning-subtle rounded">
              <p class="mb-1 small text-muted">Average Pending</p>
              <h4 class="mb-0 fw-bold text-warning">\${{ getAveragePending().toFixed(2) }}</h4>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-center p-3 bg-success-subtle rounded">
              <p class="mb-1 small text-muted">Areas Covered</p>
              <h4 class="mb-0 fw-bold text-success">{{ getUniqueAreasCount() }}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="bg-white rounded shadow border">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Customer</th>
                <th>Area</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Pending Amount</th>
                <th>Last Purchase</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let customer of filteredCustomers">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2"
                         style="width: 40px; height: 40px; color: white; font-weight: bold;">
                      {{ customer.name.charAt(0) }}
                    </div>
                    <div>
                      <p class="mb-0 fw-medium">{{ customer.name }}</p>
                      <p class="mb-0 small text-muted">{{ customer.email || 'No email' }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge bg-info">{{ customer.area }}</span>
                </td>
                <td>{{ customer.phone }}</td>
                <td>{{ customer.address || 'N/A' }}</td>
                <td>
                  <span class="fw-bold" [class.text-danger]="customer.pendingAmount > 300"
                        [class.text-warning]="customer.pendingAmount <= 300 && customer.pendingAmount > 100">
                    \${{ customer.pendingAmount.toFixed(2) }}
                  </span>
                </td>
                <td>{{ customer.lastPurchaseDate | date: 'short' }}</td>
                <td>
                  <button class="btn btn-sm btn-primary me-2" (click)="viewLedger(customer)">
                    <i class="fas fa-file-invoice"></i> Ledger
                  </button>
                  <button class="btn btn-sm btn-success" (click)="markAsPaid(customer)">
                    <i class="fas fa-check"></i> Mark Paid
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredCustomers.length === 0">
                <td colspan="7" class="text-center py-5">
                  <i class="fas fa-inbox text-secondary display-4 mb-3"></i>
                  <p class="text-muted">No pending payments found with current filters</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Ledger Modal -->
      <div *ngIf="selectedCustomerLedger" class="modal-overlay" (click)="closeLedger()">
        <div class="modal-dialog modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas fa-file-invoice me-2"></i>Customer Ledger - {{ selectedCustomerLedger.customerName }}
              </h5>
              <button type="button" class="btn-close" (click)="closeLedger()"></button>
            </div>
            <div class="modal-body">
              <!-- Customer Info -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <p class="mb-1"><strong>Area:</strong> {{ selectedCustomerLedger.area }}</p>
                  <p class="mb-1"><strong>Phone:</strong> {{ selectedCustomerLedger.phone }}</p>
                </div>
                <div class="col-md-6">
                  <p class="mb-1"><strong>Address:</strong> {{ selectedCustomerLedger.address || 'N/A' }}</p>
                  <p class="mb-1"><strong>Total Pending:</strong> 
                    <span class="text-danger fw-bold">\${{ selectedCustomerLedger.totalPending.toFixed(2) }}</span>
                  </p>
                </div>
              </div>

              <!-- Bills List -->
              <h6 class="fw-semibold mb-3">Pending Bills</h6>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Bill #</th>
                      <th>Date</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let bill of selectedCustomerLedger.bills">
                      <td>{{ bill.billNumber }}</td>
                      <td>{{ bill.createdAt | date: 'short' }}</td>
                      <td>{{ bill.dueDate | date: 'short' }}</td>
                      <td>\${{ bill.total.toFixed(2) }}</td>
                      <td><span class="badge bg-warning">{{ bill.paymentStatus }}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeLedger()">Close</button>
              <button type="button" class="btn btn-primary" (click)="printLedger()">
                <i class="fas fa-print me-2"></i>Print Ledger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PendingPaymentsComponent implements OnInit {
  filteredCustomers: Customer[] = [];
  areas: string[] = [];
  selectedCustomerLedger: CustomerLedger | null = null;

  filter: PendingPaymentFilter = {
    area: '',
    minAmount: undefined,
    maxAmount: undefined,
    customerName: '',
    sortBy: 'amount',
    sortOrder: 'desc'
  };

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadAreas();
    this.applyFilters();
  }

  loadAreas(): void {
    this.customerService.getUniqueAreas().subscribe(areas => {
      this.areas = areas;
    });
  }

  applyFilters(): void {
    this.customerService.getCustomersWithPendingPaymentsByFilter(this.filter).subscribe(customers => {
      this.filteredCustomers = customers;
    });
  }

  clearFilters(): void {
    this.filter = {
      area: '',
      minAmount: undefined,
      maxAmount: undefined,
      customerName: '',
      sortBy: 'amount',
      sortOrder: 'desc'
    };
    this.applyFilters();
  }

  getTotalPending(): number {
    return this.filteredCustomers.reduce((sum, c) => sum + c.pendingAmount, 0);
  }

  getAveragePending(): number {
    return this.filteredCustomers.length > 0 
      ? this.getTotalPending() / this.filteredCustomers.length 
      : 0;
  }

  getUniqueAreasCount(): number {
    return new Set(this.filteredCustomers.map(c => c.area)).size;
  }

  viewLedger(customer: Customer): void {
    this.customerService.generateCustomerLedger(customer.id).subscribe(ledger => {
      this.selectedCustomerLedger = ledger;
    });
  }

  closeLedger(): void {
    this.selectedCustomerLedger = null;
  }

  printLedger(): void {
    window.print();
  }

  markAsPaid(customer: Customer): void {
    if (confirm(`Mark all pending payments for ${customer.name} as paid?`)) {
      this.customerService.markPendingAsPaid(customer.id, '').subscribe(() => {
        alert('Payment marked as paid successfully!');
        this.applyFilters();
      });
    }
  }

  generateLedger(): void {
    const area = this.filter.area || 'All';
    this.customerService.generateAreaWiseLedgerReport(area).subscribe(ledgers => {
      console.log('Ledger report generated:', ledgers);
      alert(`Generated ledger report for ${ledgers.length} customers in ${area}`);
      // In real implementation, would generate PDF here
    });
  }
}
