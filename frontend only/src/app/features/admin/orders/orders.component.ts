import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./orders.component.scss'],
  template: `
    <div class="fade-in">
      <div class="mb-4">
        <h1 class="display-5 fw-bold text-dark">Order Management</h1>
        <p class="text-muted mt-1">Place orders with dealers via WhatsApp for low-stock items</p>
      </div>
      
      <div class="bg-white rounded shadow p-5 border text-center">
        <i class="fas fa-shopping-bag display-1 text-secondary mb-4"></i>
        <h3 class="h4 fw-semibold text-dark mb-3">Ordering System</h3>
        <p class="text-muted mb-4">View low-stock products, select dealers, and send WhatsApp orders automatically</p>
        <div class="mt-4">
          <i class="fab fa-whatsapp display-3 text-success"></i>
          <p class="text-muted mt-2">WhatsApp Integration Ready</p>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent {}
