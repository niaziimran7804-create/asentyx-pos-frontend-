import { Routes } from '@angular/router';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/sales-layout.component').then(m => m.SalesLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/sales-dashboard.component').then(m => m.SalesDashboardComponent)
      },
      {
        path: 'sell',
        loadComponent: () => import('./sell/sell.component').then(m => m.SellComponent)
      },
      {
        path: 'returns',
        loadComponent: () => import('./returns/returns.component').then(m => m.ReturnsComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./customers/sales-customers.component').then(m => m.SalesCustomersComponent)
      },
      {
        path: 'receipts',
        loadComponent: () => import('./receipts/receipts.component').then(m => m.ReceiptsComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./analytics/sales-analytics.component').then(m => m.SalesAnalyticsComponent)
      }
    ]
  }
];
