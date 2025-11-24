export interface ExpenseDto {
  expenseId: number;
  expenseName: string;
  expenseAmount: number;
  expenseDate: Date;
}

export interface CreateExpenseDto {
  expenseName: string;
  expenseAmount: number;
  expenseDate: Date;
}

