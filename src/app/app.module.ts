import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { PageLayoutComponent } from './shared/components/layout/page-layout.component';
import { LoadingComponent } from './shared/components/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProductsComponent,
    OrdersComponent,
    UsersComponent,
    ExpensesComponent,
    CategoriesComponent,
    BarcodesComponent,
    InvoicesComponent,
    AccountingComponent,
    ReturnsComponent,
    CustomerBalanceComponent,
    CompanyRegistrationComponent,
    BranchesComponent,
    BranchFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    AppRoutingModule,
    SidebarComponent,
    NavbarComponent,
    PageLayoutComponent,
    LoadingComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

