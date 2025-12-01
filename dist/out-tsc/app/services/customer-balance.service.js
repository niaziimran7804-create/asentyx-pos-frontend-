import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
let CustomerBalanceService = class CustomerBalanceService {
    http;
    apiUrl = API_CONFIG.baseUrl;
    constructor(http) {
        this.http = http;
    }
    /**
     * Get aging report with customer balances
     */
    getAgingReport(asOfDate) {
        let params = new HttpParams();
        if (asOfDate) {
            params = params.append('asOfDate', asOfDate);
        }
        return this.http.get(`${this.apiUrl}/ledger/aging-report`, { params });
    }
    /**
     * Export customer balances to CSV/Excel
     */
    exportCustomerBalances(format = 'excel', asOfDate) {
        let params = new HttpParams().append('format', format);
        if (asOfDate) {
            params = params.append('asOfDate', asOfDate);
        }
        return this.http.get(`${this.apiUrl}/ledger/aging-report/export`, {
            params,
            responseType: 'blob'
        });
    }
};
CustomerBalanceService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CustomerBalanceService);
export { CustomerBalanceService };
//# sourceMappingURL=customer-balance.service.js.map