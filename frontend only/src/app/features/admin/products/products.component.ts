import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./products.component.scss'],
  template: `
    <div class="fade-in">
      <div class="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 class="display-5 fw-bold text-dark">Product Management</h1>
          <p class="text-muted mt-1">Manage your inventory, stock levels, and product information</p>
        </div>
        <button class="btn btn-primary px-4 py-2 shadow-lg">
          <i class="fas fa-plus me-2"></i>Add New Product
        </button>
      </div>
      
      <div class="bg-white rounded shadow p-5 border text-center">
        <i class="fas fa-box display-1 text-secondary mb-4"></i>
        <h3 class="h4 fw-semibold text-dark mb-3">Product Management Module</h3>
        <p class="text-muted mb-4">Full CRUD operations with barcode scanning, image upload, and AI stock predictions</p>
        <div class="row g-3 mt-4">
          <div class="col-12 col-md-4">
            <div class="feature-card bg-primary-subtle p-4 rounded border border-primary">
              <i class="fas fa-barcode fs-1 text-primary mb-2"></i>
              <p class="fw-medium text-primary mb-0">Barcode Support</p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="feature-card bg-success-subtle p-4 rounded border border-success">
              <i class="fas fa-image fs-1 text-success mb-2"></i>
              <p class="fw-medium text-success mb-0">Image Upload</p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="feature-card bg-info-subtle p-4 rounded border border-info">
              <i class="fas fa-robot fs-1 text-info mb-2"></i>
              <p class="fw-medium text-info mb-0">AI Predictions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent {}
