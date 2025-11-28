import { Injectable } from '@angular/core';
import { MenuItem } from '../components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private authService: AuthService) {}

  getMenuItems(): MenuItem[] {
    const userRole = this.authService.getCurrentUser()?.role;
    const isAdmin = userRole === 'Admin';
    const isCashier = userRole === 'Cashier';

    const baseMenuItems: MenuItem[] = [
      { label: 'Dashboard', icon: 'fas fa-chart-line', route: '/dashboard' },
      { label: 'Products', icon: 'fas fa-box', route: '/products' },
      { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
      { label: 'Returns', icon: 'fas fa-undo', route: '/returns' },
      { label: 'Categories', icon: 'fas fa-tags', route: '/categories' },
      { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' },
      { label: 'Accounting', icon: 'fas fa-calculator', route: '/accounting' },
      { label: 'Customer Balance', icon: 'fas fa-users-cog', route: '/customer-balance' }
    ];

    // Add role-specific menu items
    if (isAdmin || isCashier) {
      baseMenuItems.push({ label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' });
    }

    if (isAdmin) {
      baseMenuItems.push({ label: 'Expenses', icon: 'fas fa-money-bill-wave', route: '/expenses' });
      baseMenuItems.push({ label: 'Users', icon: 'fas fa-users', route: '/users' });
    }

    return baseMenuItems;
  }
}
