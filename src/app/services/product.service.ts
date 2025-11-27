import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDto, CreateProductDto, UpdateProductDto } from '../models/product.models';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/products';

  constructor(private http: HttpClient) { }

  getAllProducts(search?: string): Observable<ProductDto[]> {
    const url = search ? `${this.apiUrl}?search=${search}` : this.apiUrl;
    return this.http.get<ProductDto[]>(url);
  }

  getProductById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: CreateProductDto | FormData): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.apiUrl, product);
  }

  updateProduct(id: number, product: UpdateProductDto | FormData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTotalProducts(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/total`);
  }

  getAvailableProducts(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/available`);
  }

  getUnavailableProducts(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/unavailable`);
  }
}

