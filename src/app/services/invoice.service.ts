import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { 
  InvoiceDto, 
  CreateInvoiceDto, 
  ShopConfigurationDto, 
  UpdateShopConfigurationDto,
  PaymentDto,
  CreatePaymentDto,
  PaymentSummaryDto,
  UpdateInvoiceDueDateDto
} from '../models/invoice.models';
import { InvoiceFilterDto } from '../models/invoice-filter.models';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${API_CONFIG.baseUrl}/invoices`;

  constructor(private http: HttpClient) { }

  getAllInvoices(): Observable<InvoiceDto[]> {
    return this.http.get<InvoiceDto[]>(this.apiUrl);
  }

  getFilteredInvoices(filter: InvoiceFilterDto): Observable<InvoiceDto[]> {
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

    return this.http.get<InvoiceDto[]>(this.apiUrl, { params });
  }

  getInvoiceById(id: number): Observable<InvoiceDto> {
    return this.http.get<InvoiceDto>(`${this.apiUrl}/${id}`);
  }

  getInvoiceByOrderId(orderId: number): Observable<InvoiceDto> {
    return this.http.get<InvoiceDto>(`${this.apiUrl}/order/${orderId}`);
  }

  createInvoice(dto: CreateInvoiceDto): Observable<InvoiceDto> {
    return this.http.post<InvoiceDto>(this.apiUrl, dto);
  }

  updateInvoiceDueDate(invoiceId: number, dto: UpdateInvoiceDueDateDto): Observable<InvoiceDto> {
    return this.http.put<InvoiceDto>(`${this.apiUrl}/${invoiceId}/due-date`, dto);
  }

  printInvoice(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/print`, { responseType: 'blob' });
  }

  downloadInvoice(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  getShopConfiguration(): Observable<ShopConfigurationDto> {
    return this.http.get<ShopConfigurationDto>(`${this.apiUrl}/shop-config`);
  }

  updateShopConfiguration(dto: UpdateShopConfigurationDto): Observable<ShopConfigurationDto> {
    return this.http.put<ShopConfigurationDto>(`${this.apiUrl}/shop-config`, dto);
  }

  openInvoicePrintWindow(id: number): void {
    // Open a blank window synchronously to avoid popup blockers
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup blocked. Please allow popups for this site to print invoices.');
      return;
    }

    // Trigger print via POST (no sensitive data in URL). Interceptor will add headers.
    this.http.post(`${this.apiUrl}/${id}/print`, {}, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob as Blob);
        try {
          // Try to navigate the opened window to the blob URL
          printWindow.location.href = fileURL;
        } catch (e) {
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

  bulkPrintInvoices(invoiceIds: number[]): void {
    // Open blank window synchronously to avoid popup blockers
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup blocked. Please allow popups for this site to print invoices.');
      return;
    }

    // Send invoice IDs in POST body, interceptor will add headers
    this.http.post(`${this.apiUrl}/bulk-print`, { invoiceIds }, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob as Blob);
        try {
          printWindow.location.href = fileURL;
        } catch (e) {
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
  getInvoicePayments(invoiceId: number): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${this.apiUrl}/${invoiceId}/payments`);
  }

  addPayment(invoiceId: number, payment: CreatePaymentDto): Observable<PaymentDto> {
    return this.http.post<PaymentDto>(`${this.apiUrl}/${invoiceId}/payments`, payment);
  }

  deletePayment(paymentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/payments/${paymentId}`);
  }

  getPaymentSummary(): Observable<PaymentSummaryDto> {
    return this.http.get<PaymentSummaryDto>(`${this.apiUrl}/payment-summary`);
  }

  getPartiallyPaidInvoices(): Observable<InvoiceDto[]> {
    return this.http.get<InvoiceDto[]>(`${this.apiUrl}/partially-paid`);
  }

  getOverdueInvoices(): Observable<InvoiceDto[]> {
    return this.http.get<InvoiceDto[]>(`${this.apiUrl}/overdue`);
  }
}

