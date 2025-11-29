import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { CompanyDto, CreateCompanyDto, UpdateCompanyDto } from '../models/company.models';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `${API_CONFIG.baseUrl}/companies`;

  constructor(private http: HttpClient) {}

  /**
   * Get all companies (Super Admin only)
   */
  getAllCompanies(): Observable<CompanyDto[]> {
    return this.http.get<CompanyDto[]>(this.apiUrl);
  }

  /**
   * Get company by ID
   */
  getCompanyById(id: number): Observable<CompanyDto> {
    return this.http.get<CompanyDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new company (No auth required - Self-registration)
   * Automatically creates:
   * - Company
   * - Head Office branch
   * - Admin user
   */
  createCompany(company: CreateCompanyDto): Observable<CompanyDto> {
    return this.http.post<CompanyDto>(this.apiUrl, company);
  }

  /**
   * Update company (Admin or CompanyAdmin)
   */
  updateCompany(id: number, company: UpdateCompanyDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, company);
  }

  /**
   * Delete company (Soft delete - Super Admin only)
   */
  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
