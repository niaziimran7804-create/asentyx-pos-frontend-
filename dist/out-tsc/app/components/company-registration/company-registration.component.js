import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
let CompanyRegistrationComponent = class CompanyRegistrationComponent {
    fb;
    companyService;
    router;
    registrationForm;
    loading = false;
    errorMessage = '';
    constructor(fb, companyService, router) {
        this.fb = fb;
        this.companyService = companyService;
        this.router = router;
    }
    ngOnInit() {
        this.registrationForm = this.fb.group({
            // Company Info
            companyName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            address: [''],
            city: [''],
            country: [''],
            postalCode: [''],
            taxNumber: [''],
            registrationNumber: [''],
            subscriptionPlan: ['Basic', Validators.required],
            // Admin User Info
            adminUserId: ['', Validators.required],
            adminFirstName: ['', Validators.required],
            adminLastName: ['', Validators.required],
            adminPassword: ['', [Validators.required, Validators.minLength(8)]],
            adminEmail: ['', [Validators.required, Validators.email]],
            adminPhone: ['']
        });
    }
    onSubmit() {
        if (this.registrationForm.invalid) {
            Object.keys(this.registrationForm.controls).forEach(key => {
                const control = this.registrationForm.get(key);
                if (control?.invalid) {
                    control.markAsTouched();
                }
            });
            return;
        }
        this.loading = true;
        this.errorMessage = '';
        const formValue = this.registrationForm.value;
        this.companyService.createCompany(formValue).subscribe({
            next: (company) => {
                this.loading = false;
                Swal.fire({
                    icon: 'success',
                    title: 'Company Registered!',
                    html: `
            <p>Company <strong>"${company.companyName}"</strong> has been registered successfully!</p>
            <p>You can now login with your admin credentials.</p>
            <p>Redirecting to login page...</p>
          `,
                    confirmButtonColor: '#667eea',
                    timer: 5000,
                    timerProgressBar: true
                }).then(() => {
                    this.router.navigate(['/login']);
                });
            },
            error: (error) => {
                this.errorMessage = error.error?.message || 'Failed to register company. Please try again.';
                this.loading = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: this.errorMessage,
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    goToLogin() {
        this.router.navigate(['/login']);
    }
};
CompanyRegistrationComponent = __decorate([
    Component({
        selector: 'app-company-registration',
        templateUrl: './company-registration.component.html',
        styleUrls: ['./company-registration.component.scss']
    })
], CompanyRegistrationComponent);
export { CompanyRegistrationComponent };
//# sourceMappingURL=company-registration.component.js.map