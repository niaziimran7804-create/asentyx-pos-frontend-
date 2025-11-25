import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, UserRole, LoginRequest, LoginResponse, ChangePasswordRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'pos_auth_token';
  private userKey = 'pos_current_user';

  // Mock users database
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@asentyx.com',
      role: UserRole.ADMIN,
      fullName: 'Admin User',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=2196f3&color=fff',
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date()
    },
    {
      id: '2',
      username: 'salesman',
      email: 'salesman@asentyx.com',
      role: UserRole.SALESMAN,
      fullName: 'John Salesman',
      avatar: 'https://ui-avatars.com/api/?name=John+Salesman&background=4caf50&color=fff',
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date()
    }
  ];

  // Mock passwords (in production, this would be handled by backend)
  private mockPasswords: { [key: string]: string } = {
    'admin': 'admin123',
    'salesman': 'salesman123'
  };

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return of(null).pipe(
      delay(800), // Simulate network delay
      map(() => {
        const user = this.mockUsers.find(u => 
          u.username === credentials.username || u.email === credentials.username
        );

        if (!user || this.mockPasswords[user.username] !== credentials.password) {
          throw new Error('Invalid username or password');
        }

        const token = this.generateMockToken(user);
        const response: LoginResponse = {
          user: { ...user, lastLogin: new Date() },
          token,
          expiresIn: 86400 // 24 hours
        };

        this.setCurrentUser(response.user, token);
        return response;
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUserSubject.next(null);
  }

  changePassword(request: ChangePasswordRequest): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const user = this.mockUsers.find(u => u.id === request.userId);
        if (!user) {
          throw new Error('User not found');
        }

        // For admin changing any password, oldPassword is optional
        if (request.oldPassword) {
          if (this.mockPasswords[user.username] !== request.oldPassword) {
            throw new Error('Old password is incorrect');
          }
        }

        // Update password in mock database
        this.mockPasswords[user.username] = request.newPassword;
        return true;
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isSalesman(): boolean {
    return this.hasRole(UserRole.SALESMAN);
  }

  private setCurrentUser(user: User, token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(this.userKey);
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          this.currentUserSubject.next(user);
        } catch (e) {
          this.logout();
        }
      }
    }
  }

  private generateMockToken(user: User): string {
    return `mock_token_${user.id}_${Date.now()}`;
  }

  // Get all users (admin only)
  getAllUsers(): Observable<User[]> {
    return of(this.mockUsers).pipe(delay(300));
  }

  // Update user
  updateUser(userId: string, updates: Partial<User>): Observable<User> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const userIndex = this.mockUsers.findIndex(u => u.id === userId);
        if (userIndex === -1) {
          throw new Error('User not found');
        }
        this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], ...updates };
        return this.mockUsers[userIndex];
      })
    );
  }
}
