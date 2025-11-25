import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SidebarComponent, MenuItem } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent],
  template: `
    <div style="display: flex; min-height: 100vh; background: #f8f9fa;">
      <app-sidebar 
        [menuItems]="menuItems" 
        [role]="getUserRole()"
        [isCollapsed]="isSidebarCollapsed"
        (collapseChange)="onSidebarCollapse($event)">
      </app-sidebar>

      <div style="flex: 1; display: flex; flex-direction: column; transition: margin-left 0.3s ease;" 
           [ngStyle]="{'margin-left': sidebarWidth}">
        <app-navbar 
          [sidebarWidth]="sidebarWidth"
          [currentUser]="currentUser"
          [notificationCount]="3">
        </app-navbar>

        <main style="flex: 1; overflow-y: auto; padding: 2rem; margin-top: 64px;">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `
})
export class PageLayoutComponent implements OnInit {
  currentUser: any;
  isSidebarCollapsed = false;
  menuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.setupMenuItems();
  }

  setupMenuItems(): void {
    this.menuItems = [
      { label: 'Dashboard', icon: 'fas fa-chart-line', route: '/dashboard' },
      { label: 'Products', icon: 'fas fa-box', route: '/products' },
      { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
      { label: 'Categories', icon: 'fas fa-tags', route: '/categories' },
      { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' }
    ];

    if (this.isAdmin() || this.isCashier()) {
      this.menuItems.push({ label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' });
    }

    if (this.isAdmin()) {
      this.menuItems.push({ label: 'Expenses', icon: 'fas fa-money-bill-wave', route: '/expenses' });
      this.menuItems.push({ label: 'Users', icon: 'fas fa-users', route: '/users' });
    }
  }

  get sidebarWidth(): string {
    return this.isSidebarCollapsed ? '80px' : '280px';
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  getUserRole(): string {
    return this.currentUser?.role || 'User';
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCashier(): boolean {
    return this.authService.isCashier();
  }
}
