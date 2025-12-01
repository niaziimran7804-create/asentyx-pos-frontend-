import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
let BranchService = class BranchService {
    http;
    apiUrl = `${API_CONFIG.baseUrl}/branches`;
    constructor(http) {
        this.http = http;
    }
    /**
     * Get all branches (Super Admin & Company Admin)
     * Company Admin automatically gets filtered to their company's branches
     */
    getAllBranches() {
        return this.http.get(this.apiUrl);
    }
    /**
     * Get branches by company ID
     */
    getBranchesByCompany(companyId) {
        return this.http.get(`${this.apiUrl}/company/${companyId}`);
    }
    /**
     * Get branch by ID
     */
    getBranchById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
    /**
     * Create new branch
     */
    createBranch(branch) {
        return this.http.post(this.apiUrl, branch);
    }
    /**
     * Update branch
     */
    updateBranch(id, branch) {
        return this.http.put(`${this.apiUrl}/${id}`, branch);
    }
    /**
     * Delete branch (Soft delete)
     */
    deleteBranch(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
};
BranchService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], BranchService);
export { BranchService };
//# sourceMappingURL=branch.service.js.map