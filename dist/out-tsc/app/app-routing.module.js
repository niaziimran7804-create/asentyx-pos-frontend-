import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { UsersComponent } from './components/users/users.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { BarcodesComponent } from './components/barcodes/barcodes.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { AccountingComponent } from './components/accounting/accounting.component';
import { ReturnsComponent } from './components/returns/returns.component';
import { CustomerBalanceComponent } from './components/customer-balance/customer-balance.component';
import { CompanyRegistrationComponent } from './components/company-registration/company-registration.component';
import { BranchesComponent } from './components/branches/branches.component';
import { BranchFormComponent } from './components/branch-form/branch-form.component';
import { AuthGuard } from './guards/auth.guard';
const routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: CompanyRegistrationComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
    { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
    { path: 'barcodes', component: BarcodesComponent, canActivate: [AuthGuard] },
    { path: 'invoices', component: InvoicesComponent, canActivate: [AuthGuard] },
    { path: 'accounting', component: AccountingComponent, canActivate: [AuthGuard] },
    { path: 'returns', component: ReturnsComponent, canActivate: [AuthGuard] },
    { path: 'customer-balance', component: CustomerBalanceComponent, canActivate: [AuthGuard] },
    { path: 'branches', component: BranchesComponent, canActivate: [AuthGuard] },
    { path: 'branches/new', component: BranchFormComponent, canActivate: [AuthGuard] },
    { path: 'branches/edit/:id', component: BranchFormComponent, canActivate: [AuthGuard] },
    { path: 'branches/view/:id', component: BranchFormComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map