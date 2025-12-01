import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
let OrderService = class OrderService {
    http;
    apiUrl = `${API_CONFIG.baseUrl}/orders`;
    constructor(http) {
        this.http = http;
    }
    getAllOrders() {
        return this.http.get(this.apiUrl);
    }
    getOrderById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
    createOrder(order) {
        return this.http.post(this.apiUrl, order);
    }
    updateOrder(id, order) {
        return this.http.put(`${this.apiUrl}/${id}`, order);
    }
    updateOrderStatus(id, statusDto) {
        return this.http.put(`${this.apiUrl}/${id}/status`, statusDto);
    }
    bulkUpdateOrderStatus(bulkUpdateDto) {
        return this.http.put(`${this.apiUrl}/bulk-update-status`, bulkUpdateDto);
    }
    searchCustomers(searchTerm) {
        const params = new HttpParams().set('searchTerm', searchTerm);
        return this.http.get(`${this.apiUrl}/search-customers`, { params });
    }
    deleteOrder(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
};
OrderService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], OrderService);
export { OrderService };
//# sourceMappingURL=order.service.js.map