import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseDto, CreateExpenseDto } from '../models/expense.models';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = '/api/expenses';

  constructor(private http: HttpClient) { }

  getAllExpenses(): Observable<ExpenseDto[]> {
    return this.http.get<ExpenseDto[]>(this.apiUrl);
  }

  getExpenseById(id: number): Observable<ExpenseDto> {
    return this.http.get<ExpenseDto>(`${this.apiUrl}/${id}`);
  }

  createExpense(expense: CreateExpenseDto): Observable<ExpenseDto> {
    return this.http.post<ExpenseDto>(this.apiUrl, expense);
  }

  updateExpense(id: number, expense: CreateExpenseDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

