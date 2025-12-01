import { __decorate } from "tslib";
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
let ExpensesComponent = class ExpensesComponent {
    expenseService;
    expenses = [];
    showForm = false;
    editingExpense = null;
    expenseForm = {
        expenseName: '',
        expenseAmount: 0,
        expenseDate: new Date()
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
    constructor(expenseService) {
        this.expenseService = expenseService;
    }
    ngOnInit() {
        this.loading = true;
        this.loadExpenses();
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
    loadExpenses() {
        this.expenseService.getAllExpenses().subscribe({
            next: (data) => {
                this.expenses = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading expenses:', error);
                this.loading = false;
            }
        });
    }
    createExpense() {
        this.expenseService.createExpense(this.expenseForm).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Expense created successfully',
                    confirmButtonColor: '#667eea',
                    timer: 2000
                });
                this.loadExpenses();
                this.resetForm();
            },
            error: (error) => console.error('Error creating expense:', error)
        });
    }
    editExpense(expense) {
        this.editingExpense = expense;
        this.expenseForm = {
            expenseName: expense.expenseName,
            expenseAmount: expense.expenseAmount,
            expenseDate: new Date(expense.expenseDate)
        };
        this.showForm = true;
    }
    updateExpense() {
        if (this.editingExpense) {
            this.expenseService.updateExpense(this.editingExpense.expenseId, this.expenseForm).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Expense updated successfully',
                        confirmButtonColor: '#667eea',
                        timer: 2000
                    });
                    this.loadExpenses();
                    this.resetForm();
                },
                error: (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Updating Expense',
                        text: 'Failed to update expense. Please try again.',
                        confirmButtonColor: '#667eea'
                    });
                }
            });
        }
    }
    deleteExpense(id) {
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
                this.expenseService.deleteExpense(id).subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Expense has been deleted.',
                            confirmButtonColor: '#667eea',
                            timer: 2000
                        });
                        this.loadExpenses();
                    },
                    error: (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete expense. Please try again.',
                            confirmButtonColor: '#667eea'
                        });
                    }
                });
            }
        });
    }
    resetForm() {
        this.showForm = false;
        this.editingExpense = null;
        this.expenseForm = {
            expenseName: '',
            expenseAmount: 0,
            expenseDate: new Date()
        };
    }
    getTotalExpenses() {
        return this.expenses.reduce((sum, expense) => sum + expense.expenseAmount, 0);
    }
};
ExpensesComponent = __decorate([
    Component({
        selector: 'app-expenses',
        templateUrl: './expenses.component.html',
        styleUrls: ['./expenses.component.css']
    })
], ExpensesComponent);
export { ExpensesComponent };
//# sourceMappingURL=expenses.component.js.map