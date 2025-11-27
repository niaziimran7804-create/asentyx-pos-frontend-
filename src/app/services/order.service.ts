import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDto, CreateOrderDto, UpdateOrderStatusDto, CustomerSearchDto, BulkUpdateOrderStatusDto } from '../models/order.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '/api/orders';

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: CreateOrderDto): Observable<OrderDto> {
    return this.http.post<OrderDto>(this.apiUrl, order);
  }

  updateOrder(id: number, order: OrderDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, order);
  }

  updateOrderStatus(id: number, statusDto: UpdateOrderStatusDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, statusDto);
  }

  bulkUpdateOrderStatus(bulkUpdateDto: BulkUpdateOrderStatusDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bulk-update-status`, bulkUpdateDto);
  }

  searchCustomers(searchTerm: string): Observable<CustomerSearchDto[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.get<CustomerSearchDto[]>(`${this.apiUrl}/search-customers`, { params });
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

