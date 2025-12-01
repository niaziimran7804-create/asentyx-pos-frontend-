import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
let InvoiceService = class InvoiceService {
    http;
    apiUrl = `${API_CONFIG.baseUrl}/invoices`;
    constructor(http) {
        this.http = http;
    }
    getAllInvoices() {
        return this.http.get(this.apiUrl);
    }
    getFilteredInvoices(filter) {
        let params = new HttpParams();
        if (filter.minAmount !== undefined && filter.minAmount !== null) {
            params = params.set('minAmount', filter.minAmount.toString());
        }
        if (filter.maxAmount !== undefined && filter.maxAmount !== null) {
            params = params.set('maxAmount', filter.maxAmount.toString());
        }
        if (filter.startDate) {
            // HTML date inputs return strings in format "YYYY-MM-DD"
            // If it's already a string, use it directly; if it's a Date object, convert it
            const startDate = filter.startDate instanceof Date
                ? filter.startDate.toISOString().split('T')[0]
                : String(filter.startDate);
            params = params.set('startDate', startDate);
        }
        if (filter.endDate) {
            // HTML date inputs return strings in format "YYYY-MM-DD"
            // If it's already a string, use it directly; if it's a Date object, convert it
            const endDate = filter.endDate instanceof Date
                ? filter.endDate.toISOString().split('T')[0]
                : String(filter.endDate);
            params = params.set('endDate', endDate);
        }
        if (filter.customerAddress) {
            params = params.set('customerAddress', filter.customerAddress);
        }
        if (filter.status) {
            params = params.set('status', filter.status);
        }
        return this.http.get(this.apiUrl, { params });
    }
    getInvoiceById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
    getInvoiceByOrderId(orderId) {
        return this.http.get(`${this.apiUrl}/order/${orderId}`);
    }
    createInvoice(dto) {
        return this.http.post(this.apiUrl, dto);
    }
    updateInvoiceDueDate(invoiceId, dto) {
        return this.http.put(`${this.apiUrl}/${invoiceId}/due-date`, dto);
    }
    printInvoice(id) {
        return this.http.get(`${this.apiUrl}/${id}/print`, { responseType: 'blob' });
    }
    downloadInvoice(id) {
        return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
    }
    getShopConfiguration() {
        return this.http.get(`${this.apiUrl}/shop-config`);
    }
    updateShopConfiguration(dto) {
        return this.http.put(`${this.apiUrl}/shop-config`, dto);
    }
    openInvoicePrintWindow(id) {
        // Open a blank window synchronously to avoid popup blockers
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Popup blocked. Please allow popups for this site to print invoices.');
            return;
        }
        // Trigger print via POST (no sensitive data in URL). Interceptor will add headers.
        this.http.post(`${this.apiUrl}/${id}/print`, {}, { responseType: 'blob' }).subscribe({
            next: (blob) => {
                const fileURL = URL.createObjectURL(blob);
                try {
                    // Try to navigate the opened window to the blob URL
                    printWindow.location.href = fileURL;
                }
                catch (e) {
                    // Fallback: write an iframe into the blank window
                    printWindow.document.open();
                    printWindow.document.write('<html><body style="margin:0;padding:0;"><iframe src="' + fileURL + '" style="border:none;width:100%;height:100%;"></iframe></body></html>');
                    printWindow.document.close();
                }
            },
            error: (err) => {
                printWindow.close();
                console.error('Failed to print invoice:', err);
                alert('Failed to print invoice. See console for details.');
            }
        });
    }
    bulkPrintInvoices(invoiceIds) {
        // Open blank window synchronously to avoid popup blockers
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Popup blocked. Please allow popups for this site to print invoices.');
            return;
        }
        // Send invoice IDs in POST body, interceptor will add headers
        this.http.post(`${this.apiUrl}/bulk-print`, { invoiceIds }, { responseType: 'blob' }).subscribe({
            next: (blob) => {
                const fileURL = URL.createObjectURL(blob);
                try {
                    printWindow.location.href = fileURL;
                }
                catch (e) {
                    printWindow.document.open();
                    printWindow.document.write('<html><body style="margin:0;padding:0;"><iframe src="' + fileURL + '" style="border:none;width:100%;height:100%;"></iframe></body></html>');
                    printWindow.document.close();
                }
            },
            error: (err) => {
                printWindow.close();
                console.error('Failed to bulk print invoices:', err);
                alert('Failed to print invoices. See console for details.');
            }
        });
    }
    // Payment Management
    getInvoicePayments(invoiceId) {
        return this.http.get(`${this.apiUrl}/${invoiceId}/payments`);
    }
    addPayment(invoiceId, payment) {
        return this.http.post(`${this.apiUrl}/${invoiceId}/payments`, payment);
    }
    deletePayment(paymentId) {
        return this.http.delete(`${this.apiUrl}/payments/${paymentId}`);
    }
    getPaymentSummary() {
        return this.http.get(`${this.apiUrl}/payment-summary`);
    }
    getPartiallyPaidInvoices() {
        return this.http.get(`${this.apiUrl}/partially-paid`);
    }
    getOverdueInvoices() {
        return this.http.get(`${this.apiUrl}/overdue`);
    }
};
InvoiceService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], InvoiceService);
export { InvoiceService };
//# sourceMappingURL=invoice.service.js.map