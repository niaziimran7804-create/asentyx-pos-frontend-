import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./settings.component.scss'],
  template: `
    <div class="fade-in">
      <div class="mb-4">
        <h1 class="display-5 fw-bold text-dark">Store Settings</h1>
        <p class="text-muted mt-1">Configure store details, currency, tax rates, and user credentials</p>
      </div>
      
      <div class="row g-4">
        <div class="col-12 col-lg-6">
          <div class="bg-white rounded shadow p-4 border h-100">
            <h3 class="h5 fw-semibold text-dark mb-3">
              <i class="fas fa-store me-2 text-primary"></i>Store Information
            </h3>
            <p class="text-muted">Store name, address, logo, contact details</p>
          </div>
        </div>
        
        <div class="col-12 col-lg-6">
          <div class="bg-white rounded shadow p-4 border h-100">
            <h3 class="h5 fw-semibold text-dark mb-3">
              <i class="fas fa-money-bill me-2 text-success"></i>Currency & Tax
            </h3>
            <p class="text-muted">Configure currency, tax rates, discount policies</p>
          </div>
        </div>
        
        <div class="col-12 col-lg-6">
          <div class="bg-white rounded shadow p-4 border h-100">
            <h3 class="h5 fw-semibold text-dark mb-3">
              <i class="fas fa-key me-2 text-warning"></i>User Credentials
            </h3>
            <p class="text-muted">Change admin and salesman passwords</p>
          </div>
        </div>
        
        <div class="col-12 col-lg-6">
          <div class="bg-white rounded shadow p-4 border h-100">
            <h3 class="h5 fw-semibold text-dark mb-3">
              <i class="fas fa-palette me-2 text-info"></i>Theme Settings
            </h3>
            <p class="text-muted">Light/Dark mode toggle</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {}
