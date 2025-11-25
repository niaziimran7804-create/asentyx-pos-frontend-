import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./customers.component.scss'],
  template: `
    <div class="fade-in">
      <div class="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 class="display-5 fw-bold text-dark">Customer Management</h1>
          <p class="text-muted mt-1">Manage customer information and purchase history</p>
        </div>
        <button class="btn btn-primary px-4 py-2 shadow-lg">
          <i class="fas fa-user-plus me-2"></i>Add Customer
        </button>
      </div>
      
      <div class="bg-white rounded shadow p-5 border text-center">
        <i class="fas fa-users display-1 text-secondary mb-4"></i>
        <h3 class="h4 fw-semibold text-dark mb-3">Customer Management Module</h3>
        <p class="text-muted">Complete customer CRUD with purchase history and discount settings</p>
      </div>
    </div>
  `
})
export class CustomersComponent {}
