import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
let NavbarComponent = class NavbarComponent {
    authService;
    router;
    sidebarWidth = '280px';
    currentUser = null;
    notificationCount = 0;
    themeToggle = new EventEmitter();
    showUserMenu = false;
    isDarkMode = false;
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    onDocumentClick(event) {
        const target = event.target;
        if (!target.closest('.user-dropdown') && !target.closest('.dropdown-menu')) {
            this.showUserMenu = false;
        }
    }
    toggleUserMenu() {
        event?.stopPropagation();
        this.showUserMenu = !this.showUserMenu;
    }
    closeUserMenu() {
        this.showUserMenu = false;
    }
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.themeToggle.emit();
        document.documentElement.classList.toggle('dark');
    }
    logout() {
        const confirmed = confirm('Are you sure you want to logout?');
        if (confirmed) {
            this.showUserMenu = false;
            this.authService.logout();
            this.router.navigate(['/login']);
        }
    }
    getUserFullName() {
        if (this.currentUser) {
            return `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim() || 'User';
        }
        return 'User';
    }
    getUserRole() {
        return this.currentUser?.role || 'Guest';
    }
    getUserAvatar() {
        const name = this.getUserFullName();
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`;
    }
};
__decorate([
    Input()
], NavbarComponent.prototype, "sidebarWidth", void 0);
__decorate([
    Input()
], NavbarComponent.prototype, "currentUser", void 0);
__decorate([
    Input()
], NavbarComponent.prototype, "notificationCount", void 0);
__decorate([
    Output()
], NavbarComponent.prototype, "themeToggle", void 0);
__decorate([
    HostListener('document:click', ['$event'])
], NavbarComponent.prototype, "onDocumentClick", null);
NavbarComponent = __decorate([
    Component({
        selector: 'app-navbar',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './navbar.component.html',
        styleUrls: ['./navbar.component.scss']
    })
], NavbarComponent);
export { NavbarComponent };
//# sourceMappingURL=navbar.component.js.map