import { __decorate } from "tslib";
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
let BarcodesComponent = class BarcodesComponent {
    barcodeService;
    authService;
    barcodes = [];
    showForm = false;
    editingBarcode = null;
    barcodeForm = { barCode1: '' };
    generateForm = {};
    // Sidebar and Navbar properties
    isSidebarCollapsed = false;
    sidebarWidth = '280px';
    currentUser;
    loading = false;
    menuItems = [
        { label: 'Dashboard', icon: 'fas fa-home', route: '/dashboard' },
        { label: 'Products', icon: 'fas fa-box', route: '/products' },
        { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
        { label: 'Returns', icon: 'fas fa-undo', route: '/returns' },
        { label: 'Categories', icon: 'fas fa-th-large', route: '/categories' },
        { label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' },
        { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' },
        { label: 'Accounting', icon: 'fas fa-calculator', route: '/accounting' },
        { label: 'Customer Balance', icon: 'fas fa-users-cog', route: '/customer-balance' },
        { label: 'Expenses', icon: 'fas fa-wallet', route: '/expenses' },
        { label: 'Users', icon: 'fas fa-users', route: '/users' }
    ];
    constructor(barcodeService, authService) {
        this.barcodeService = barcodeService;
        this.authService = authService;
    }
    ngOnInit() {
        this.loading = true;
        this.loadBarcodes();
        this.currentUser = {
            name: localStorage.getItem('userName') || 'User',
            role: localStorage.getItem('userRole') || 'cashier'
        };
    }
    onSidebarCollapse(collapsed) {
        this.isSidebarCollapsed = collapsed;
        this.sidebarWidth = collapsed ? '80px' : '280px';
    }
    getUserRole() {
        return this.currentUser?.role || 'cashier';
    }
    loadBarcodes() {
        this.barcodeService.getBarCodes().subscribe({
            next: (data) => {
                this.barcodes = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading barcodes:', error);
                this.loading = false;
            }
        });
    }
    isAdmin() {
        return this.authService.isAdmin();
    }
    isCashier() {
        return this.authService.isCashier();
    }
    showCreateForm() {
        this.showForm = true;
        this.editingBarcode = null;
        this.barcodeForm = { barCode1: '' };
    }
    showEditForm(barcode) {
        this.showForm = true;
        this.editingBarcode = barcode;
        this.barcodeForm = { barCode1: barcode.barCode1 };
    }
    saveBarcode() {
        if (this.editingBarcode) {
            this.barcodeService.updateBarCode(this.editingBarcode.barCodeId, this.barcodeForm).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Barcode updated successfully',
                        confirmButtonColor: '#667eea',
                        timer: 2000
                    });
                    this.loadBarcodes();
                    this.resetForm();
                },
                error: (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Updating Barcode',
                        text: 'Failed to update barcode. Please try again.',
                        confirmButtonColor: '#667eea'
                    });
                }
            });
        }
        else {
            this.barcodeService.createBarCode(this.barcodeForm).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Barcode created successfully',
                        confirmButtonColor: '#667eea',
                        timer: 2000
                    });
                    this.loadBarcodes();
                    this.resetForm();
                },
                error: (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Creating Barcode',
                        text: 'Failed to create barcode. Please try again.',
                        confirmButtonColor: '#667eea'
                    });
                }
            });
        }
    }
    generateBarcode() {
        this.barcodeService.generateBarCode(this.generateForm).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Barcode generated successfully',
                    confirmButtonColor: '#667eea',
                    timer: 2000
                });
                this.loadBarcodes();
                this.generateForm = {};
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Generating Barcode',
                    text: 'Failed to generate barcode. Please try again.',
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    deleteBarcode(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.barcodeService.deleteBarCode(id).subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Barcode has been deleted.',
                            confirmButtonColor: '#667eea',
                            timer: 2000
                        });
                        this.loadBarcodes();
                    },
                    error: (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete barcode. Please try again.',
                            confirmButtonColor: '#667eea'
                        });
                    }
                });
            }
        });
    }
    resetForm() {
        this.showForm = false;
        this.editingBarcode = null;
        this.barcodeForm = { barCode1: '' };
    }
};
BarcodesComponent = __decorate([
    Component({
        selector: 'app-barcodes',
        templateUrl: './barcodes.component.html',
        styleUrls: ['./barcodes.component.css']
    })
], BarcodesComponent);
export { BarcodesComponent };
//# sourceMappingURL=barcodes.component.js.map