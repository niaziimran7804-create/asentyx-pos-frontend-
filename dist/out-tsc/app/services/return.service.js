import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
let ReturnService = class ReturnService {
    http;
    apiUrl = `${API_CONFIG.baseUrl}/returns`;
    constructor(http) {
        this.http = http;
    }
    getAllReturns() {
        return this.http.get(this.apiUrl);
    }
    getReturnById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
    createReturn(returnDto) {
        return this.http.post(this.apiUrl, returnDto);
    }
    updateReturnStatus(id, statusDto) {
        return this.http.put(`${this.apiUrl}/${id}/status`, statusDto);
    }
    getFilteredReturns(filter) {
        let params = new HttpParams();
        if (filter.startDate)
            params = params.set('startDate', filter.startDate.toString());
        if (filter.endDate)
            params = params.set('endDate', filter.endDate.toString());
        if (filter.status)
            params = params.set('status', filter.status);
        if (filter.productId)
            params = params.set('productId', filter.productId.toString());
        return this.http.get(`${this.apiUrl}/filter`, { params });
    }
    getReturnSummary() {
        return this.http.get(`${this.apiUrl}/summary`);
    }
    deleteReturn(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
    // Whole Bill Return
    createWholeReturn(payload) {
        return this.http.post(`${this.apiUrl}/whole`, payload);
    }
    // Partial Return
    createPartialReturn(payload) {
        return this.http.post(`${this.apiUrl}/partial`, payload);
    }
};
ReturnService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ReturnService);
export { ReturnService };
//# sourceMappingURL=return.service.js.map