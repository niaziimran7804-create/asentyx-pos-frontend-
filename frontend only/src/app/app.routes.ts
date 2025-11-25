import { Routes } from '@angular/router';
import { authGuard, adminGuard, salesmanGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'sales',
    canActivate: [authGuard, salesmanGuard],
    loadChildren: () => import('./features/sales/sales.routes').then(m => m.SALES_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

