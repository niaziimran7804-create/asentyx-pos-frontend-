import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { BranchDto, CreateBranchDto, UpdateBranchDto } from '../models/branch.models';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private apiUrl = `${API_CONFIG.baseUrl}/branches`;

  constructor(private http: HttpClient) {}

  /**
   * Get all branches (Super Admin & Company Admin)
   * Company Admin automatically gets filtered to their company's branches
   */
  getAllBranches(): Observable<BranchDto[]> {
    return this.http.get<BranchDto[]>(this.apiUrl);
  }

  /**
   * Get branches by company ID
   */
  getBranchesByCompany(companyId: number): Observable<BranchDto[]> {
    return this.http.get<BranchDto[]>(`${this.apiUrl}/company/${companyId}`);
  }

  /**
   * Get branch by ID
   */
  getBranchById(id: number): Observable<BranchDto> {
    return this.http.get<BranchDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new branch
   */
  createBranch(branch: CreateBranchDto): Observable<BranchDto> {
    return this.http.post<BranchDto>(this.apiUrl, branch);
  }

  /**
   * Update branch
   */
  updateBranch(id: number, branch: UpdateBranchDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, branch);
  }

  /**
   * Delete branch (Soft delete)
   */
  deleteBranch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
