import { __decorate } from "tslib";
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
let UsersComponent = class UsersComponent {
    userService;
    branchService;
    companyService;
    authService;
    users = [];
    branches = [];
    companies = [];
    showForm = false;
    editingUser = null;
    isSuperAdmin = false;
    userForm = {
        userId: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'Salesman',
        age: 0,
        salary: 0,
        birthdate: new Date(),
        companyId: undefined,
        branchId: undefined
    };
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
    constructor(userService, branchService, companyService, authService) {
        this.userService = userService;
        this.branchService = branchService;
        this.companyService = companyService;
        this.authService = authService;
    }
    ngOnInit() {
        this.loading = true;
        const currentUser = this.authService.getCurrentUser();
        this.isSuperAdmin = currentUser?.role === 'SuperAdmin';
        this.loadUsers();
        if (this.isSuperAdmin) {
            this.loadCompanies();
        }
        else {
            this.loadBranches();
        }
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
    loadUsers() {
        this.userService.getAllUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Error Loading Users',
                    text: 'Failed to load users. Please try again.',
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    loadCompanies() {
        this.companyService.getAllCompanies().subscribe({
            next: (data) => {
                this.companies = data;
            },
            error: (error) => {
                console.error('Error loading companies:', error);
            }
        });
    }
    loadBranches() {
        const currentUser = this.authService.getCurrentUser();
        const companyId = this.userForm.companyId || currentUser?.companyId;
        if (companyId) {
            this.branchService.getBranchesByCompany(companyId).subscribe({
                next: (data) => {
                    this.branches = data;
                },
                error: (error) => {
                    console.error('Error loading branches:', error);
                }
            });
        }
    }
    onCompanyChange() {
        // Reset branch selection when company changes
        this.userForm.branchId = undefined;
        this.branches = [];
        // Load branches for the selected company
        if (this.userForm.companyId) {
            this.loadBranches();
        }
    }
    createUser() {
        const currentUser = this.authService.getCurrentUser();
        // Auto-assign companyId if not set (for non-SuperAdmin users)
        if (!this.userForm.companyId && currentUser?.companyId) {
            this.userForm.companyId = currentUser.companyId;
        }
        this.userService.createUser(this.userForm).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User created successfully',
                    confirmButtonColor: '#667eea',
                    timer: 2000
                });
                this.loadUsers();
                this.resetForm();
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Creating User',
                    text: 'Failed to create user. Please try again.',
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    editUser(user) {
        this.editingUser = user;
        this.userForm = {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            password: '',
            role: user.role,
            age: user.age,
            salary: user.salary,
            birthdate: new Date(user.birthdate),
            companyId: user.companyId,
            branchId: user.branchId
        };
        // Load branches for the user's company
        if (user.companyId) {
            this.loadBranches();
        }
        this.showForm = true;
    }
    updateUser() {
        if (this.editingUser) {
            const updateDto = {
                firstName: this.userForm.firstName,
                lastName: this.userForm.lastName,
                role: this.userForm.role,
                age: this.userForm.age,
                salary: this.userForm.salary,
                birthdate: this.userForm.birthdate,
                companyId: this.userForm.companyId,
                branchId: this.userForm.branchId
            };
            this.userService.updateUser(this.editingUser.id, updateDto).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'User updated successfully',
                        confirmButtonColor: '#667eea',
                        timer: 2000
                    });
                    this.loadUsers();
                    this.resetForm();
                },
                error: (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Updating User',
                        text: 'Failed to update user. Please try again.',
                        confirmButtonColor: '#667eea'
                    });
                }
            });
        }
    }
    deleteUser(id) {
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
                this.userService.deleteUser(id).subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'User has been deleted.',
                            confirmButtonColor: '#667eea',
                            timer: 2000
                        });
                        this.loadUsers();
                    },
                    error: (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Deleting User',
                            text: 'Failed to delete user. Please try again.',
                            confirmButtonColor: '#667eea'
                        });
                    }
                });
            }
        });
    }
    resetForm() {
        this.showForm = false;
        this.editingUser = null;
        this.branches = [];
        this.userForm = {
            userId: '',
            firstName: '',
            lastName: '',
            password: '',
            role: 'Salesman',
            age: 0,
            salary: 0,
            birthdate: new Date(),
            companyId: undefined,
            branchId: undefined
        };
    }
};
UsersComponent = __decorate([
    Component({
        selector: 'app-users',
        templateUrl: './users.component.html',
        styleUrls: ['./users.component.css']
    })
], UsersComponent);
export { UsersComponent };
//# sourceMappingURL=users.component.js.map