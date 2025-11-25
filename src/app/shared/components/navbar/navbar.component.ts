import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() sidebarWidth: string = '280px';
  @Input() currentUser: any = null;
  @Input() notificationCount = 0;
  @Output() themeToggle = new EventEmitter<void>();

  showUserMenu = false;
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown') && !target.closest('.dropdown-menu')) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu(): void {
    event?.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeToggle.emit();
    document.documentElement.classList.toggle('dark');
  }

  logout(): void {
    const confirmed = confirm('Are you sure you want to logout?');
    if (confirmed) {
      this.showUserMenu = false;
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  getUserFullName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim() || 'User';
    }
    return 'User';
  }

  getUserRole(): string {
    return this.currentUser?.role || 'Guest';
  }

  getUserAvatar(): string {
    const name = this.getUserFullName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`;
  }
}
