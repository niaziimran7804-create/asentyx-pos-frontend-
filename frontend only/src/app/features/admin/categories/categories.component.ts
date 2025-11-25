import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./categories.component.scss'],
  template: `
    <div class="fade-in">
      <div class="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h1 class="display-5 fw-bold text-dark">Category & Dealer Management</h1>
          <p class="text-muted mt-1">Organize products and manage dealer relationships</p>
        </div>
        <button class="btn btn-primary px-4 py-2 shadow-lg">
          <i class="fas fa-plus me-2"></i>Add Category
        </button>
      </div>
      
      <div class="bg-white rounded shadow p-5 border text-center">
        <i class="fas fa-tags display-1 text-secondary mb-4"></i>
        <h3 class="h4 fw-semibold text-dark mb-3">Category Management Module</h3>
        <p class="text-muted">Create categories and assign dealers with WhatsApp integration</p>
      </div>
    </div>
  `
})
export class CategoriesComponent {}
