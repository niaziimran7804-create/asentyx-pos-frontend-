import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginDto, LoginResponseDto, UserDto } from '../models/auth.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = API_CONFIG.baseUrl;
  private apiUrl = `${this.baseUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      this.currentUserSubject.next(JSON.parse(userStr));
    }
  }

  login(loginDto: LoginDto): Observable<LoginResponseDto> {
    console.log('url: ', this.apiUrl);
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, loginDto)
      .pipe(
        tap(response => {
          console.log('Auth service: storing token and user', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('userId', response.user.userId.toString());
          localStorage.setItem('userName', `${response.user.firstName} ${response.user.lastName}`);
          localStorage.setItem('userRole', response.user.role);
          
          // Store company and branch IDs for multi-tenancy
          if (response.user.companyId) {
            localStorage.setItem('companyId', response.user.companyId.toString());
          }
          if (response.user.branchId) {
            localStorage.setItem('branchId', response.user.branchId.toString());
          }
          
          this.currentUserSubject.next(response.user);
          console.log('Auth service: storage complete', {
            companyId: response.user.companyId,
            branchId: response.user.branchId
          });
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('companyId');
    localStorage.removeItem('branchId');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    
    return true;
  }

  isTokenExpired(token: string): boolean {
    if (!token) {
      return true;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      
      if (!expiry) {
        // If no expiry is set, consider token as valid
        return false;
      }
      
      // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
      return (expiry * 1000) < Date.now();
    } catch (error) {
      // If we can't decode the token, don't consider it expired
      // Let the server validate it
      console.warn('Unable to decode token:', error);
      return false;
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Admin';
  }

  isCashier(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Cashier';
  }
}

