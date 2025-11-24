import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  totalProducts: number = 0;
  availableProducts: number = 0;
  unavailableProducts: number = 0;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.productService.getTotalProducts().subscribe(count => this.totalProducts = count);
    this.productService.getAvailableProducts().subscribe(count => this.availableProducts = count);
    this.productService.getUnavailableProducts().subscribe(count => this.unavailableProducts = count);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCashier(): boolean {
    return this.authService.isCashier();
  }
}

