import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-analytics',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./sales-analytics.component.scss'],
  template: `
    <div class="fade-in">
      <h1 class="display-5 fw-bold text-dark mb-2">My Analytics</h1>
      <p class="text-muted mb-4">View your personal sales performance</p>
      
      <div class="bg-white rounded shadow p-5 border text-center">
        <i class="fas fa-chart-line display-1 text-secondary mb-4"></i>
        <h3 class="h4 fw-semibold text-dark mb-3">Personal Analytics</h3>
        <p class="text-muted">Daily/weekly/monthly sales, commission summary</p>
      </div>
    </div>
  `
})
export class SalesAnalyticsComponent {}
