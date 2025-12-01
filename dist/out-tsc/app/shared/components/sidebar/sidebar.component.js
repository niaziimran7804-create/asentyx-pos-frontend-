import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
let SidebarComponent = class SidebarComponent {
    menuItems = [];
    role = 'Admin';
    isCollapsed = false;
    collapseChange = new EventEmitter();
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.collapseChange.emit(this.isCollapsed);
    }
};
__decorate([
    Input()
], SidebarComponent.prototype, "menuItems", void 0);
__decorate([
    Input()
], SidebarComponent.prototype, "role", void 0);
__decorate([
    Input()
], SidebarComponent.prototype, "isCollapsed", void 0);
__decorate([
    Output()
], SidebarComponent.prototype, "collapseChange", void 0);
SidebarComponent = __decorate([
    Component({
        selector: 'app-sidebar',
        standalone: true,
        imports: [CommonModule, RouterModule],
        templateUrl: './sidebar.component.html',
        styleUrls: ['./sidebar.component.scss']
    })
], SidebarComponent);
export { SidebarComponent };
//# sourceMappingURL=sidebar.component.js.map