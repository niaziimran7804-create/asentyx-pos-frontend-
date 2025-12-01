import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
let UserService = class UserService {
    http;
    apiUrl = `${API_CONFIG.baseUrl}/users`;
    constructor(http) {
        this.http = http;
    }
    getAllUsers() {
        return this.http.get(this.apiUrl);
    }
    getUserById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
    createUser(user) {
        return this.http.post(this.apiUrl, user);
    }
    updateUser(id, user) {
        return this.http.put(`${this.apiUrl}/${id}`, user);
    }
    deleteUser(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
};
UserService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map