import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { 
  AccountingEntryDto, 
  CreateAccountingEntryDto, 
  DailySalesDto, 
  SalesGraphDto, 
  AccountingSummaryDto,
  PaymentMethodSummaryDto,
  CategoryWiseSalesDto,
  TopProductDto,
  AccountingFilterDto
} from '../models/accounting.models';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  private apiUrl = `${API_CONFIG.baseUrl}/accounting`;

  constructor(private http: HttpClient) { }

  // Accounting Entries
  getAccountingEntries(filter?: AccountingFilterDto): Observable<any> {
    let params = new HttpParams();
    if (filter) {
      if (filter.startDate) params = params.set('startDate', filter.startDate.toISOString());
      if (filter.endDate) params = params.set('endDate', filter.endDate.toISOString());
      if (filter.entryType) params = params.set('entryType', filter.entryType);
      if (filter.paymentMethod) params = params.set('paymentMethod', filter.paymentMethod);
      if (filter.category) params = params.set('category', filter.category);
      if (filter.minAmount) params = params.set('minAmount', filter.minAmount.toString());
      if (filter.maxAmount) params = params.set('maxAmount', filter.maxAmount.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/entries`, { params });
  }

  createAccountingEntry(entry: CreateAccountingEntryDto): Observable<AccountingEntryDto> {
    return this.http.post<AccountingEntryDto>(`${this.apiUrl}/entries`, entry);
  }

  deleteAccountingEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/entries/${id}`);
  }

  // Dashboard & Analytics
  getAccountingSummary(startDate?: Date, endDate?: Date): Observable<AccountingSummaryDto> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    return this.http.get<AccountingSummaryDto>(`${this.apiUrl}/summary`, { params });
  }

  getDailySales(days: number = 30): Observable<DailySalesDto[]> {
    return this.http.get<DailySalesDto[]>(`${this.apiUrl}/daily-sales?days=${days}`);
  }

  getSalesGraph(startDate: Date, endDate: Date): Observable<SalesGraphDto> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    return this.http.get<SalesGraphDto>(`${this.apiUrl}/sales-graph`, { params });
  }

  getPaymentMethodSummary(startDate?: Date, endDate?: Date): Observable<PaymentMethodSummaryDto[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    return this.http.get<PaymentMethodSummaryDto[]>(`${this.apiUrl}/payment-methods`, { params });
  }

  getCategoryWiseSales(startDate?: Date, endDate?: Date): Observable<CategoryWiseSalesDto[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    return this.http.get<CategoryWiseSalesDto[]>(`${this.apiUrl}/category-sales`, { params });
  }

  getTopProducts(limit: number = 10, startDate?: Date, endDate?: Date): Observable<TopProductDto[]> {
    let params = new HttpParams().set('limit', limit.toString());
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    return this.http.get<TopProductDto[]>(`${this.apiUrl}/top-products`, { params });
  }

  // Sales Returns
  getSalesReturns(startDate?: Date, endDate?: Date): Observable<AccountingEntryDto[]> {
    let params = new HttpParams().set('entryType', 'SalesReturn');
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    return this.http.get<AccountingEntryDto[]>(`${this.apiUrl}/entries`, { params });
  }

  // Export Reports
  exportAccountingReport(format: 'csv' | 'pdf', filter?: AccountingFilterDto): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    if (filter) {
      if (filter.startDate) params = params.set('startDate', filter.startDate.toISOString());
      if (filter.endDate) params = params.set('endDate', filter.endDate.toISOString());
      if (filter.entryType) params = params.set('entryType', filter.entryType);
    }
    return this.http.get(`${this.apiUrl}/export`, { params, responseType: 'blob' });
  }
}
