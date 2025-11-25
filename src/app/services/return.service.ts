import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  PurchaseReturnDto, 
  CreatePurchaseReturnDto, 
  UpdateReturnStatusDto,
  ReturnFilterDto,
  ReturnSummaryDto 
} from '../models/return.models';

@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private apiUrl = 'https://localhost:7000/api/returns';

  constructor(private http: HttpClient) { }

  getAllReturns(): Observable<PurchaseReturnDto[]> {
    return this.http.get<PurchaseReturnDto[]>(this.apiUrl);
  }

  getReturnById(id: number): Observable<PurchaseReturnDto> {
    return this.http.get<PurchaseReturnDto>(`${this.apiUrl}/${id}`);
  }

  createReturn(returnDto: CreatePurchaseReturnDto): Observable<PurchaseReturnDto> {
    return this.http.post<PurchaseReturnDto>(this.apiUrl, returnDto);
  }

  updateReturnStatus(id: number, statusDto: UpdateReturnStatusDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, statusDto);
  }

  getFilteredReturns(filter: ReturnFilterDto): Observable<PurchaseReturnDto[]> {
    let params = new HttpParams();
    if (filter.startDate) params = params.set('startDate', filter.startDate.toString());
    if (filter.endDate) params = params.set('endDate', filter.endDate.toString());
    if (filter.status) params = params.set('status', filter.status);
    if (filter.productId) params = params.set('productId', filter.productId.toString());
    
    return this.http.get<PurchaseReturnDto[]>(`${this.apiUrl}/filter`, { params });
  }

  getReturnSummary(): Observable<ReturnSummaryDto> {
    return this.http.get<ReturnSummaryDto>(`${this.apiUrl}/summary`);
  }

  deleteReturn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
