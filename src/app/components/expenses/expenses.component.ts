import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseDto, CreateExpenseDto } from '../../models/expense.models';

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

  constructor(private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getAllExpenses().subscribe({
      next: (data) => this.expenses = data,
      error: (error) => console.error('Error loading expenses:', error)
    });
  }

  createExpense(): void {
    this.expenseService.createExpense(this.expenseForm).subscribe({
      next: () => {
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
          this.loadExpenses();
          this.resetForm();
        },
        error: (error) => console.error('Error updating expense:', error)
      });
    }
  }

  deleteExpense(id: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => this.loadExpenses(),
        error: (error) => console.error('Error deleting expense:', error)
      });
    }
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

