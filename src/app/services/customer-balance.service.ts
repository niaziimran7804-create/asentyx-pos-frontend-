import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  CustomerBalanceDto, 
  AgingReportResponseDto, 
  CustomerBalanceFilterDto 
} from '../models/customer-balance.models';

@Injectable({
  providedIn: 'root'
})
export class CustomerBalanceService {
  private apiUrl = 'https://localhost:7000/api';

  constructor(private http: HttpClient) {}

  /**
   * Get aging report with customer balances
   */
  getAgingReport(asOfDate?: string): Observable<AgingReportResponseDto> {
    let params = new HttpParams();
    
    if (asOfDate) {
      params = params.append('asOfDate', asOfDate);
    }

    return this.http.get<AgingReportResponseDto>(`${this.apiUrl}/ledger/aging-report`, { params });
  }

  /**
   * Export customer balances to CSV/Excel
   */
  exportCustomerBalances(format: 'csv' | 'excel' = 'excel', asOfDate?: string): Observable<Blob> {
    let params = new HttpParams().append('format', format);
    
    if (asOfDate) {
      params = params.append('asOfDate', asOfDate);
    }

    return this.http.get(`${this.apiUrl}/ledger/aging-report/export`, {
      params,
      responseType: 'blob'
    });
  }
}
