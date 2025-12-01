import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
let ExpenseService = class ExpenseService {
    http;
    apiUrl = `${API_CONFIG.baseUrl}/expenses`;
    constructor(http) {
        this.http = http;
    }
    getAllExpenses() {
        return this.http.get(this.apiUrl);
    }
    getExpenseById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
    createExpense(expense) {
        return this.http.post(this.apiUrl, expense);
    }
    updateExpense(id, expense) {
        return this.http.put(`${this.apiUrl}/${id}`, expense);
    }
    deleteExpense(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
};
ExpenseService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ExpenseService);
export { ExpenseService };
//# sourceMappingURL=expense.service.js.map