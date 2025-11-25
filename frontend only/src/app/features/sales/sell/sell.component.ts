import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./sell.component.scss'],
  template: `
    <div class="fade-in">
      <div class="mb-4">
        <h1 class="display-5 fw-bold text-dark">Point of Sale</h1>
        <p class="text-muted mt-1">Scan products, add to cart, and generate bills</p>
      </div>

      <div class="row g-4">
        <!-- Product Search & Scan -->
        <div class="col-12 col-lg-8">
          <div class="bg-white rounded shadow p-4 border">
            <div class="mb-4">
              <label class="form-label fw-medium">Barcode / Product Search</label>
              <div class="position-relative">
                <input 
                  type="text" 
                  placeholder="Scan barcode or search product..."
                  class="form-control ps-5 py-3"
                  autofocus
                />
                <i class="fas fa-barcode position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
              </div>
            </div>

            <div class="text-center py-5">
              <i class="fas fa-shopping-cart display-1 text-secondary mb-4"></i>
              <h3 class="h4 fw-semibold text-dark mb-3">POS Selling Interface</h3>
              <p class="text-muted">Barcode scanning, product search, cart management</p>
              <p class="text-muted">Auto tax calculation with discount limits</p>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="col-12 col-lg-4">
          <div class="bg-white rounded shadow p-4 border">
            <h3 class="h5 fw-semibold text-dark mb-4">Cart Summary</h3>
            
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Subtotal</span>
                <span class="fw-medium">\$0.00</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Discount</span>
                <span class="fw-medium text-danger">-\$0.00</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Tax</span>
                <span class="fw-medium">\$0.00</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <span class="fw-semibold text-dark">Total</span>
                <span class="fw-bold fs-4 text-primary">\$0.00</span>
              </div>
            </div>

            <button class="btn btn-primary w-100 py-3 shadow-lg mb-2">
              <i class="fas fa-check me-2"></i>Generate Bill
            </button>
            <button class="btn btn-secondary w-100 py-2">
              <i class="fas fa-times me-2"></i>Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SellComponent {}
