import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const currentUser = this.authService.getCurrentUser();
    
    if (token) {
      const headers: { [key: string]: string } = {
        Authorization: `Bearer ${token}`
      };

      // Add Company ID header if available
      if (currentUser?.companyId) {
        headers['X-Company-Id'] = currentUser.companyId.toString();
      }

      // Add Branch ID header if available
      if (currentUser?.branchId) {
        headers['X-Branch-Id'] = currentUser.branchId.toString();
      }

      request = request.clone({
        setHeaders: headers
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          this.authService.logout();
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url, reason: 'session-expired' }
          });
        } else if (error.status === 403) {
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', error);
        }
        return throwError(() => error);
      })
    );
  }
}

