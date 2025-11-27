import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
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

  onSubmit(): void {
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
            this.router.navigate([this.returnUrl]).then(
              (success) => {
                console.log('Navigation success:', success);
                if (!success) {
                  console.error('Navigation failed, redirecting to /dashboard');
                  this.router.navigate(['/dashboard']);
                }
              },
              (error) => {
                console.error('Navigation error:', error);
                this.router.navigate(['/dashboard']);
              }
            );
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
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}

