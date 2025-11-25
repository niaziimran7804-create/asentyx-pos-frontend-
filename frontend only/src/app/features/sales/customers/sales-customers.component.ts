import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-customers',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./sales-customers.component.scss'],
  template: `
    <div class="fade-in">
      <h1 class="display-5 fw-bold text-dark mb-2">Customers</h1>
      <p class="text-muted mb-4">View customer information (read-only for salesman)</p>
      
      <div class="bg-white rounded shadow p-5 border text-center">
        <i class="fas fa-users display-1 text-secondary mb-4"></i>
        <h3 class="h4 fw-semibold text-dark mb-3">Customer Directory</h3>
        <p class="text-muted">View customers for bill selection, cannot edit</p>
      </div>
    </div>
  `
})
export class SalesCustomersComponent {}
