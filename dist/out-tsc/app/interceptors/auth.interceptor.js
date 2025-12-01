import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
let AuthInterceptor = class AuthInterceptor {
    authService;
    router;
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    intercept(request, next) {
        const token = this.authService.getToken();
        const currentUser = this.authService.getCurrentUser();
        if (token) {
            const headers = {
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
        return next.handle(request).pipe(catchError((error) => {
            if (error.status === 401) {
                // Token expired or invalid
                this.authService.logout();
                this.router.navigate(['/login'], {
                    queryParams: { returnUrl: this.router.url, reason: 'session-expired' }
                });
            }
            else if (error.status === 403) {
                // Forbidden - user doesn't have permission
                console.error('Access forbidden:', error);
            }
            return throwError(() => error);
        }));
    }
};
AuthInterceptor = __decorate([
    Injectable()
], AuthInterceptor);
export { AuthInterceptor };
//# sourceMappingURL=auth.interceptor.js.map