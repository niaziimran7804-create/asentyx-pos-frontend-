import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
let BarcodeService = class BarcodeService {
    http;
    apiUrl = `${API_CONFIG.baseUrl}/barcodes`;
    constructor(http) {
        this.http = http;
    }
    getBarCodes() {
        return this.http.get(this.apiUrl);
    }
    getBarCodeById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
    createBarCode(dto) {
        return this.http.post(this.apiUrl, dto);
    }
    updateBarCode(id, dto) {
        return this.http.put(`${this.apiUrl}/${id}`, dto);
    }
    deleteBarCode(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
    generateBarCode(dto) {
        return this.http.post(`${this.apiUrl}/generate`, dto);
    }
};
BarcodeService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], BarcodeService);
export { BarcodeService };
//# sourceMappingURL=barcode.service.js.map