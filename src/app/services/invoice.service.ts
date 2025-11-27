import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  InvoiceDto, 
  CreateInvoiceDto, 
  ShopConfigurationDto, 
  UpdateShopConfigurationDto,
  PaymentDto,
  CreatePaymentDto,
  PaymentSummaryDto
} from '../models/invoice.models';
import { InvoiceFilterDto } from '../models/invoice-filter.models';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'https://asentyx.com:5000/api/invoices';

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
    const url = `${this.apiUrl}/${id}/print`;
    window.open(url, '_blank');
  }

  bulkPrintInvoices(invoiceIds: number[]): void {
    // Create comma-separated string of invoice IDs
    const idsParam = invoiceIds.join(',');
    const url = `${this.apiUrl}/bulk-print?invoiceIds=${idsParam}`;
    // Open in new window - the print dialog will be triggered automatically
    window.open(url, '_blank');
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

