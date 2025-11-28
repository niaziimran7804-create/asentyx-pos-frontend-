import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MenuService } from '../../services/menu.service';
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
    private menuService: MenuService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuItems();
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
