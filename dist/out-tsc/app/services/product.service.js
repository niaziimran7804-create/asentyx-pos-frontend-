import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
let ProductService = class ProductService {
    http;
    apiUrl = `${API_CONFIG.baseUrl}/products`;
    constructor(http) {
        this.http = http;
    }
    getAllProducts(search) {
        const url = search ? `${this.apiUrl}?search=${search}` : this.apiUrl;
        return this.http.get(url);
    }
    getProductById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
    createProduct(product) {
        return this.http.post(this.apiUrl, product);
    }
    updateProduct(id, product) {
        return this.http.put(`${this.apiUrl}/${id}`, product);
    }
    deleteProduct(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
    getTotalProducts() {
        return this.http.get(`${this.apiUrl}/stats/total`);
    }
    getAvailableProducts() {
        return this.http.get(`${this.apiUrl}/stats/available`);
    }
    getUnavailableProducts() {
        return this.http.get(`${this.apiUrl}/stats/unavailable`);
    }
};
ProductService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ProductService);
export { ProductService };
//# sourceMappingURL=product.service.js.map