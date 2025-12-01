import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
let CompanyService = class CompanyService {
    http;
    apiUrl = `${API_CONFIG.baseUrl}/companies`;
    constructor(http) {
        this.http = http;
    }
    /**
     * Get all companies (Super Admin only)
     */
    getAllCompanies() {
        return this.http.get(this.apiUrl);
    }
    /**
     * Get company by ID
     */
    getCompanyById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
    /**
     * Create new company (No auth required - Self-registration)
     * Automatically creates:
     * - Company
     * - Head Office branch
     * - Admin user
     */
    createCompany(company) {
        return this.http.post(this.apiUrl, company);
    }
    /**
     * Update company (Admin or CompanyAdmin)
     */
    updateCompany(id, company) {
        return this.http.put(`${this.apiUrl}/${id}`, company);
    }
    /**
     * Delete company (Soft delete - Super Admin only)
     */
    deleteCompany(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
};
CompanyService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CompanyService);
export { CompanyService };
//# sourceMappingURL=company.service.js.map