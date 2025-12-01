import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
let PageLayoutComponent = class PageLayoutComponent {
    authService;
    menuService;
    router;
    currentUser;
    isSidebarCollapsed = false;
    menuItems = [];
    constructor(authService, menuService, router) {
        this.authService = authService;
        this.menuService = menuService;
        this.router = router;
        this.currentUser = this.authService.getCurrentUser();
    }
    ngOnInit() {
        // Load menu items initially
        this.menuItems = this.menuService.getMenuItems();
        // Subscribe to user changes to update menu dynamically
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.menuItems = this.menuService.getMenuItems();
            }
        });
    }
    get sidebarWidth() {
        return this.isSidebarCollapsed ? '80px' : '280px';
    }
    onSidebarCollapse(collapsed) {
        this.isSidebarCollapsed = collapsed;
    }
    getUserRole() {
        return this.currentUser?.role || 'User';
    }
    isAdmin() {
        return this.authService.isAdmin();
    }
    isCashier() {
        return this.authService.isCashier();
    }
};
PageLayoutComponent = __decorate([
    Component({
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
], PageLayoutComponent);
export { PageLayoutComponent };
//# sourceMappingURL=page-layout.component.js.map