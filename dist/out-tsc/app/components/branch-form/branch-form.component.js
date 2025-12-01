import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
let BranchFormComponent = class BranchFormComponent {
    fb;
    branchService;
    companyService;
    authService;
    route;
    router;
    branchForm;
    loading = false;
    isEditMode = false;
    branchId = null;
    companies = [];
    currentUser;
    constructor(fb, branchService, companyService, authService, route, router) {
        this.fb = fb;
        this.branchService = branchService;
        this.companyService = companyService;
        this.authService = authService;
        this.route = route;
        this.router = router;
    }
    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser();
        this.branchId = Number(this.route.snapshot.paramMap.get('id'));
        this.isEditMode = !!this.branchId;
        this.initializeForm();
        this.loadCompanies();
        if (this.isEditMode) {
            this.loadBranchData();
        }
    }
    initializeForm() {
        // Determine default company ID
        const defaultCompanyId = this.currentUser?.role === 'Admin' ? null : (this.currentUser?.companyId || null);
        this.branchForm = this.fb.group({
            companyId: [defaultCompanyId, Validators.required],
            branchName: ['', Validators.required],
            branchCode: ['', Validators.required],
            email: ['', Validators.email],
            phone: [''],
            address: [''],
            city: [''],
            country: [''],
            postalCode: [''],
            isActive: [true],
            isHeadOffice: [false]
        });
        // Disable company selection for non-admins
        if (this.currentUser?.role !== 'Admin') {
            this.branchForm.get('companyId')?.disable();
        }
    }
    loadCompanies() {
        // Only super admins need to load companies
        if (this.currentUser?.role === 'Admin') {
            this.companyService.getAllCompanies().subscribe({
                next: (companies) => {
                    this.companies = companies.filter(c => c.isActive);
                },
                error: (error) => {
                    console.error('Error loading companies', error);
                }
            });
        }
    }
    loadBranchData() {
        if (!this.branchId)
            return;
        this.loading = true;
        this.branchService.getBranchById(this.branchId).subscribe({
            next: (branch) => {
                this.branchForm.patchValue({
                    companyId: branch.companyId,
                    branchName: branch.branchName,
                    branchCode: branch.branchCode,
                    email: branch.email,
                    phone: branch.phone,
                    address: branch.address,
                    city: branch.city,
                    country: branch.country,
                    postalCode: branch.postalCode,
                    isActive: branch.isActive,
                    isHeadOffice: branch.isHeadOffice
                });
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading branch', error);
                this.loading = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load branch data',
                    confirmButtonColor: '#667eea'
                });
                this.goBack();
            }
        });
    }
    onSubmit() {
        if (this.branchForm.invalid) {
            Object.keys(this.branchForm.controls).forEach(key => {
                const control = this.branchForm.get(key);
                if (control?.invalid) {
                    control.markAsTouched();
                }
            });
            return;
        }
        this.loading = true;
        const formValue = this.branchForm.getRawValue(); // getRawValue includes disabled fields
        if (this.isEditMode && this.branchId) {
            // Update existing branch
            this.branchService.updateBranch(this.branchId, formValue).subscribe({
                next: () => {
                    this.loading = false;
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated!',
                        text: 'Branch has been updated successfully.',
                        confirmButtonColor: '#667eea',
                        timer: 2000
                    }).then(() => {
                        this.goBack();
                    });
                },
                error: (error) => {
                    this.loading = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.error?.message || 'Failed to update branch',
                        confirmButtonColor: '#667eea'
                    });
                }
            });
        }
        else {
            // Create new branch
            this.branchService.createBranch(formValue).subscribe({
                next: (branch) => {
                    this.loading = false;
                    Swal.fire({
                        icon: 'success',
                        title: 'Created!',
                        text: `Branch "${branch.branchName}" has been created successfully.`,
                        confirmButtonColor: '#667eea',
                        timer: 2000
                    }).then(() => {
                        this.goBack();
                    });
                },
                error: (error) => {
                    this.loading = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.error?.message || 'Failed to create branch',
                        confirmButtonColor: '#667eea'
                    });
                }
            });
        }
    }
    goBack() {
        this.router.navigate(['/branches']);
    }
    getTitle() {
        return this.isEditMode ? 'Edit Branch' : 'Create New Branch';
    }
    getSubmitButtonText() {
        if (this.loading) {
            return this.isEditMode ? 'Updating...' : 'Creating...';
        }
        return this.isEditMode ? 'Update Branch' : 'Create Branch';
    }
};
BranchFormComponent = __decorate([
    Component({
        selector: 'app-branch-form',
        templateUrl: './branch-form.component.html',
        styleUrls: ['./branch-form.component.scss']
    })
], BranchFormComponent);
export { BranchFormComponent };
//# sourceMappingURL=branch-form.component.js.map