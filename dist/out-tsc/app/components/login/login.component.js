import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
let LoginComponent = class LoginComponent {
    fb;
    authService;
    router;
    route;
    loginForm;
    errorMessage = '';
    showPassword = false;
    isLoading = false;
    returnUrl = '/dashboard';
    constructor(fb, authService, router, route) {
        this.fb = fb;
        this.authService = authService;
        this.router = router;
        this.route = route;
        this.loginForm = this.fb.group({
            userId: ['', Validators.required],
            password: ['', Validators.required]
        });
    }
    ngOnInit() {
        // Get return URL from route parameters or default to dashboard
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        // Check if redirected due to session expiration
        const reason = this.route.snapshot.queryParams['reason'];
        if (reason === 'session-expired') {
            Swal.fire({
                icon: 'warning',
                title: 'Session Expired',
                text: 'Your session has expired. Please login again.',
                confirmButtonColor: '#667eea',
                timer: 5000
            });
        }
    }
    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            this.authService.login(this.loginForm.value).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    console.log('Login successful, navigating to:', this.returnUrl);
                    console.log('User:', response.user);
                    console.log('Token stored:', localStorage.getItem('token'));
                    // Small delay to ensure localStorage is updated
                    setTimeout(() => {
                        this.router.navigate([this.returnUrl]).then((success) => {
                            console.log('Navigation success:', success);
                            if (!success) {
                                console.error('Navigation failed, redirecting to /dashboard');
                                this.router.navigate(['/dashboard']);
                            }
                        }, (error) => {
                            console.error('Navigation error:', error);
                            this.router.navigate(['/dashboard']);
                        });
                    }, 100);
                },
                error: (error) => {
                    this.isLoading = false;
                    console.error('Login error:', error);
                    this.errorMessage = 'Invalid credentials. Please try again.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: error.error?.message || 'Invalid credentials. Please try again.',
                        confirmButtonColor: '#667eea'
                    });
                }
            });
        }
        else {
            this.markFormGroupTouched(this.loginForm);
        }
    }
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
    markFormGroupTouched(formGroup) {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }
};
LoginComponent = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css']
    })
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map