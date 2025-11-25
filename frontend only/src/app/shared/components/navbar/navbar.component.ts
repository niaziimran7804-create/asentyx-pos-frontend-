import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .navbar-top {
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-bottom: 1px solid #dee2e6;
      padding: 1rem 1.5rem;
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 30;
      transition: margin-left 0.3s ease;
    }
    .search-input {
      width: 100%;
      padding: 0.5rem 1rem 0.5rem 2.5rem;
      border: 1px solid #ced4da;
      border-radius: 8px;
      font-size: 0.875rem;
    }
    .search-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102,126,234,0.25);
    }
    .icon-btn {
      padding: 0.5rem;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: #6c757d;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .icon-btn:hover {
      background: #f8f9fa;
      color: #495057;
    }
    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: #dc3545;
      color: white;
      font-size: 0.625rem;
      padding: 0.125rem 0.375rem;
      border-radius: 10px;
      font-weight: 600;
    }
    .user-dropdown {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .user-dropdown:hover {
      background: #f8f9fa;
    }
    .dropdown-menu {
      position: absolute;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 200px;
      padding: 0.5rem;
      z-index: 1000;
      display: block;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      padding: 0.625rem;
      border-radius: 6px;
      color: #495057;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }
    .dropdown-item:hover {
      background: #f8f9fa;
      color: #667eea;
    }
    .dropdown-item.text-danger {
      color: #dc3545 !important;
    }
    .dropdown-item.text-danger:hover {
      background: #fff5f5;
      color: #dc3545 !important;
    }
  `],
  template: `
    <nav class="navbar-top"
         [ngStyle]="{'margin-left': sidebarWidth}">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <!-- Search Bar -->
        <div style="flex: 1; max-width: 600px; margin-right: 1rem;">
          <div style="position: relative;">
            <input 
              type="text" 
              placeholder="Search products, customers, orders..."
              class="search-input"
            />
            <i class="fas fa-search" style="position: absolute; left: 12px; top: 12px; color: #6c757d;"></i>
          </div>
        </div>

        <!-- Right Side Icons -->
        <div style="display: flex; align-items: center; gap: 1rem;">
          <!-- Theme Toggle -->
          <button (click)="toggleTheme()" 
                  class="icon-btn"
                  title="Toggle Theme">
            <i [class]="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>

          <!-- Notifications -->
          <div style="position: relative;">
            <button class="icon-btn" title="Notifications">
              <i class="fas fa-bell"></i>
              <span *ngIf="notificationCount > 0" class="notification-badge">
                {{ notificationCount }}
              </span>
            </button>
          </div>

          <!-- User Menu -->
          <div style="position: relative;">
            <div (click)="toggleUserMenu()" class="user-dropdown">
              <img [src]="currentUser?.avatar || 'https://ui-avatars.com/api/?name=' + (currentUser?.fullName || 'User') + '&background=667eea&color=fff'" 
                   alt="User Avatar" 
                   style="width: 32px; height: 32px; border-radius: 50%; margin-right: 0.75rem;" />
              <div style="text-align: left;" class="d-none d-md-block">
                <p style="margin: 0; font-size: 0.875rem; font-weight: 500; color: #495057;">{{ currentUser?.fullName || 'User' }}</p>
                <p style="margin: 0; font-size: 0.75rem; color: #6c757d;">{{ currentUser?.role || 'Guest' }}</p>
              </div>
              <i class="fas fa-chevron-down ms-2" style="font-size: 0.75rem; color: #6c757d;"></i>
            </div>

            <!-- Dropdown Menu -->
            <div *ngIf="showUserMenu" class="dropdown-menu">
              <button class="dropdown-item" (click)="closeUserMenu()">
                <i class="fas fa-user me-2"></i> Profile
              </button>
              <button class="dropdown-item" (click)="closeUserMenu()">
                <i class="fas fa-cog me-2"></i> Settings
              </button>
              <hr style="margin: 0.5rem 0; border-color: #dee2e6;" />
              <button (click)="logout()" class="dropdown-item text-danger">
                <i class="fas fa-sign-out-alt me-2"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  @Input() sidebarWidth: string = '256px';
  @Input() currentUser: User | null = null;
  @Input() notificationCount = 0;
  @Output() themeToggle = new EventEmitter<void>();

  showUserMenu = false;
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown') && !target.closest('.dropdown-menu')) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu(): void {
    event?.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeToggle.emit();
    document.documentElement.classList.toggle('dark');
  }

  logout(): void {
    const confirmed = confirm('Are you sure you want to logout?');
    if (confirmed) {
      this.showUserMenu = false;
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
