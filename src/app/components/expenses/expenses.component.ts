import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseDto, CreateExpenseDto } from '../../models/expense.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  expenses: ExpenseDto[] = [];
  showForm: boolean = false;
  editingExpense: ExpenseDto | null = null;
  expenseForm: CreateExpenseDto = {
    expenseName: '',
    expenseAmount: 0,
    expenseDate: new Date()
  };

  // Sidebar and Navbar properties
  isSidebarCollapsed = false;
  sidebarWidth = '280px';
  currentUser: any;
  loading: boolean = false;
  menuItems: any[] = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/dashboard' },
    { label: 'Products', icon: 'fas fa-box', route: '/products' },
    { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
    { label: 'Categories', icon: 'fas fa-th-large', route: '/categories' },
    { label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' },
    { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' },
    { label: 'Expenses', icon: 'fas fa-wallet', route: '/expenses' },
    { label: 'Users', icon: 'fas fa-users', route: '/users' }
  ];

  constructor(private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadExpenses();
    this.currentUser = {
      name: localStorage.getItem('userName') || 'User',
      role: localStorage.getItem('userRole') || 'cashier'
    };
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
    this.sidebarWidth = collapsed ? '80px' : '280px';
  }

  getUserRole(): string {
    return this.currentUser?.role || 'cashier';
  }

  loadExpenses(): void {
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

  createExpense(): void {
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

  editExpense(expense: ExpenseDto): void {
    this.editingExpense = expense;
    this.expenseForm = {
      expenseName: expense.expenseName,
      expenseAmount: expense.expenseAmount,
      expenseDate: new Date(expense.expenseDate)
    };
    this.showForm = true;
  }

  updateExpense(): void {
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

  deleteExpense(id: number): void {
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

  resetForm(): void {
    this.showForm = false;
    this.editingExpense = null;
    this.expenseForm = {
      expenseName: '',
      expenseAmount: 0,
      expenseDate: new Date()
    };
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.expenseAmount, 0);
  }
}

