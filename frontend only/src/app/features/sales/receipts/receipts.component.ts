import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receipts',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./receipts.component.scss'],
  template: `
    <div class="fade-in">
      <h1 class="display-5 fw-bold text-dark mb-2">Previous Bills & Receipts</h1>
      <p class="text-muted mb-4">Search, view, and reprint previous receipts</p>
      
      <div class="bg-white rounded shadow p-5 border text-center">
        <i class="fas fa-receipt display-1 text-secondary mb-4"></i>
        <h3 class="h4 fw-semibold text-dark mb-3">Receipt History</h3>
        <p class="text-muted">Search by date, customer, amount with reprint functionality</p>
      </div>
    </div>
  `
})
export class ReceiptsComponent {}
