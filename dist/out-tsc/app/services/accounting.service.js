import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
let AccountingService = class AccountingService {
    http;
    apiUrl = `${API_CONFIG.baseUrl}/accounting`;
    constructor(http) {
        this.http = http;
    }
    // Accounting Entries
    getAccountingEntries(filter) {
        let params = new HttpParams();
        if (filter) {
            if (filter.startDate)
                params = params.set('startDate', filter.startDate.toISOString());
            if (filter.endDate)
                params = params.set('endDate', filter.endDate.toISOString());
            if (filter.entryType)
                params = params.set('entryType', filter.entryType);
            if (filter.paymentMethod)
                params = params.set('paymentMethod', filter.paymentMethod);
            if (filter.category)
                params = params.set('category', filter.category);
            if (filter.minAmount)
                params = params.set('minAmount', filter.minAmount.toString());
            if (filter.maxAmount)
                params = params.set('maxAmount', filter.maxAmount.toString());
        }
        return this.http.get(`${this.apiUrl}/entries`, { params });
    }
    createAccountingEntry(entry) {
        return this.http.post(`${this.apiUrl}/entries`, entry);
    }
    deleteAccountingEntry(id) {
        return this.http.delete(`${this.apiUrl}/entries/${id}`);
    }
    // Dashboard & Analytics
    getAccountingSummary(startDate, endDate) {
        let params = new HttpParams();
        if (startDate)
            params = params.set('startDate', startDate.toISOString());
        if (endDate)
            params = params.set('endDate', endDate.toISOString());
        return this.http.get(`${this.apiUrl}/summary`, { params });
    }
    getDailySales(days = 30) {
        return this.http.get(`${this.apiUrl}/daily-sales?days=${days}`);
    }
    getSalesGraph(startDate, endDate) {
        const params = new HttpParams()
            .set('startDate', startDate.toISOString())
            .set('endDate', endDate.toISOString());
        return this.http.get(`${this.apiUrl}/sales-graph`, { params });
    }
    getPaymentMethodSummary(startDate, endDate) {
        let params = new HttpParams();
        if (startDate)
            params = params.set('startDate', startDate.toISOString());
        if (endDate)
            params = params.set('endDate', endDate.toISOString());
        return this.http.get(`${this.apiUrl}/payment-methods`, { params });
    }
    getCategoryWiseSales(startDate, endDate) {
        let params = new HttpParams();
        if (startDate)
            params = params.set('startDate', startDate.toISOString());
        if (endDate)
            params = params.set('endDate', endDate.toISOString());
        return this.http.get(`${this.apiUrl}/category-sales`, { params });
    }
    getTopProducts(limit = 10, startDate, endDate) {
        let params = new HttpParams().set('limit', limit.toString());
        if (startDate)
            params = params.set('startDate', startDate.toISOString());
        if (endDate)
            params = params.set('endDate', endDate.toISOString());
        return this.http.get(`${this.apiUrl}/top-products`, { params });
    }
    // Sales Returns
    getSalesReturns(startDate, endDate) {
        let params = new HttpParams().set('entryType', 'SalesReturn');
        if (startDate)
            params = params.set('startDate', startDate.toISOString());
        if (endDate)
            params = params.set('endDate', endDate.toISOString());
        return this.http.get(`${this.apiUrl}/entries`, { params });
    }
    // Export Reports
    exportAccountingReport(format, filter) {
        let params = new HttpParams().set('format', format);
        if (filter) {
            if (filter.startDate)
                params = params.set('startDate', filter.startDate.toISOString());
            if (filter.endDate)
                params = params.set('endDate', filter.endDate.toISOString());
            if (filter.entryType)
                params = params.set('entryType', filter.entryType);
        }
        return this.http.get(`${this.apiUrl}/export`, { params, responseType: 'blob' });
    }
};
AccountingService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AccountingService);
export { AccountingService };
//# sourceMappingURL=accounting.service.js.map