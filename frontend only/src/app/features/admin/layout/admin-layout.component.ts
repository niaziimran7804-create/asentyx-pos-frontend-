import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent, MenuItem } from '../../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  template: `
    <div style="display: flex; min-height: 100vh; background: #f8f9fa;">
      <!-- Sidebar -->
      <app-sidebar 
        [menuItems]="menuItems" 
        [role]="'Admin'"
        [isCollapsed]="isSidebarCollapsed"
        (collapseChange)="onSidebarCollapse($event)">
      </app-sidebar>

      <!-- Main Content -->
      <div style="flex: 1; display: flex; flex-direction: column; transition: margin-left 0.3s ease;" 
           [ngStyle]="{'margin-left': sidebarWidth}">
        <!-- Navbar -->
        <app-navbar 
          [sidebarWidth]="sidebarWidth"
          [currentUser]="currentUser"
          [notificationCount]="notificationCount">
        </app-navbar>

        <!-- Page Content -->
        <main style="flex: 1; overflow-y: auto; padding: 2rem; margin-top: 64px;">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent implements OnInit {
  currentUser: User | null = null;
  isSidebarCollapsed = false;
  notificationCount = 3;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'fas fa-chart-line', route: '/admin/dashboard' },
    { label: 'Products', icon: 'fas fa-box', route: '/admin/products', badge: 6 },
    { label: 'Categories', icon: 'fas fa-tags', route: '/admin/categories' },
    { label: 'Customers', icon: 'fas fa-users', route: '/admin/customers' },
    { label: 'Orders', icon: 'fas fa-shopping-bag', route: '/admin/orders' },
    { label: 'Pending Payments', icon: 'fas fa-money-bill-wave', route: '/admin/pending-payments', badge: 5 },
    { label: 'Settings', icon: 'fas fa-cog', route: '/admin/settings' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get sidebarWidth(): string {
    return this.isSidebarCollapsed ? '80px' : '280px';
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }
}
