import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./returns.component.scss'],
  template: `
    <div class="fade-in">
      <h1 class="display-5 fw-bold text-dark mb-2">Sales Returns</h1>
      <p class="text-muted mb-4">Process product returns linked to original bills</p>
      
      <div class="bg-white rounded shadow p-5 border text-center">
        <i class="fas fa-undo display-1 text-secondary mb-4"></i>
        <h3 class="h4 fw-semibold text-dark mb-3">Returns Management</h3>
        <p class="text-muted">Process returns, link to original bills, auto stock adjustment</p>
      </div>
    </div>
  `
})
export class ReturnsComponent {}
