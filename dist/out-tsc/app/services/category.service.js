import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
let CategoryService = class CategoryService {
    http;
    apiUrl = `${API_CONFIG.baseUrl}/categories`;
    constructor(http) {
        this.http = http;
    }
    // Main Categories
    getMainCategories() {
        return this.http.get(`${this.apiUrl}/main`);
    }
    getMainCategoryById(id) {
        return this.http.get(`${this.apiUrl}/main/${id}`);
    }
    createMainCategory(dto) {
        return this.http.post(`${this.apiUrl}/main`, dto);
    }
    updateMainCategory(id, dto) {
        return this.http.put(`${this.apiUrl}/main/${id}`, dto);
    }
    deleteMainCategory(id) {
        return this.http.delete(`${this.apiUrl}/main/${id}`);
    }
    // Second Categories
    getSecondCategories() {
        return this.http.get(`${this.apiUrl}/second`);
    }
    getSecondCategoryById(id) {
        return this.http.get(`${this.apiUrl}/second/${id}`);
    }
    createSecondCategory(dto) {
        return this.http.post(`${this.apiUrl}/second`, dto);
    }
    updateSecondCategory(id, dto) {
        return this.http.put(`${this.apiUrl}/second/${id}`, dto);
    }
    deleteSecondCategory(id) {
        return this.http.delete(`${this.apiUrl}/second/${id}`);
    }
    // Third Categories
    getThirdCategories() {
        return this.http.get(`${this.apiUrl}/third`);
    }
    getThirdCategoryById(id) {
        return this.http.get(`${this.apiUrl}/third/${id}`);
    }
    createThirdCategory(dto) {
        return this.http.post(`${this.apiUrl}/third`, dto);
    }
    updateThirdCategory(id, dto) {
        return this.http.put(`${this.apiUrl}/third/${id}`, dto);
    }
    deleteThirdCategory(id) {
        return this.http.delete(`${this.apiUrl}/third/${id}`);
    }
    // Vendors
    getVendors() {
        return this.http.get(`${this.apiUrl}/vendors`);
    }
    getVendorById(id) {
        return this.http.get(`${this.apiUrl}/vendors/${id}`);
    }
    createVendor(dto) {
        return this.http.post(`${this.apiUrl}/vendors`, dto);
    }
    updateVendor(id, dto) {
        return this.http.put(`${this.apiUrl}/vendors/${id}`, dto);
    }
    deleteVendor(id) {
        return this.http.delete(`${this.apiUrl}/vendors/${id}`);
    }
    // Brands
    getBrands() {
        return this.http.get(`${this.apiUrl}/brands`);
    }
    getBrandById(id) {
        return this.http.get(`${this.apiUrl}/brands/${id}`);
    }
    createBrand(dto) {
        return this.http.post(`${this.apiUrl}/brands`, dto);
    }
    updateBrand(id, dto) {
        return this.http.put(`${this.apiUrl}/brands/${id}`, dto);
    }
    deleteBrand(id) {
        return this.http.delete(`${this.apiUrl}/brands/${id}`);
    }
};
CategoryService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CategoryService);
export { CategoryService };
//# sourceMappingURL=category.service.js.map