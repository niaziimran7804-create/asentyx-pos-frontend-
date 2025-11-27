import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  MainCategoryDto, SecondCategoryDto, ThirdCategoryDto, VendorDto, BrandDto,
  CreateMainCategoryDto, CreateSecondCategoryDto, CreateThirdCategoryDto,
  CreateVendorDto, CreateBrandDto
} from '../models/category.models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://asentyx.com:5000/api/categories';

  constructor(private http: HttpClient) { }

  // Main Categories
  getMainCategories(): Observable<MainCategoryDto[]> {
    return this.http.get<MainCategoryDto[]>(`${this.apiUrl}/main`);
  }

  getMainCategoryById(id: number): Observable<MainCategoryDto> {
    return this.http.get<MainCategoryDto>(`${this.apiUrl}/main/${id}`);
  }

  createMainCategory(dto: CreateMainCategoryDto): Observable<MainCategoryDto> {
    return this.http.post<MainCategoryDto>(`${this.apiUrl}/main`, dto);
  }

  updateMainCategory(id: number, dto: CreateMainCategoryDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/main/${id}`, dto);
  }

  deleteMainCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/main/${id}`);
  }

  // Second Categories
  getSecondCategories(): Observable<SecondCategoryDto[]> {
    return this.http.get<SecondCategoryDto[]>(`${this.apiUrl}/second`);
  }

  getSecondCategoryById(id: number): Observable<SecondCategoryDto> {
    return this.http.get<SecondCategoryDto>(`${this.apiUrl}/second/${id}`);
  }

  createSecondCategory(dto: CreateSecondCategoryDto): Observable<SecondCategoryDto> {
    return this.http.post<SecondCategoryDto>(`${this.apiUrl}/second`, dto);
  }

  updateSecondCategory(id: number, dto: CreateSecondCategoryDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/second/${id}`, dto);
  }

  deleteSecondCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/second/${id}`);
  }

  // Third Categories
  getThirdCategories(): Observable<ThirdCategoryDto[]> {
    return this.http.get<ThirdCategoryDto[]>(`${this.apiUrl}/third`);
  }

  getThirdCategoryById(id: number): Observable<ThirdCategoryDto> {
    return this.http.get<ThirdCategoryDto>(`${this.apiUrl}/third/${id}`);
  }

  createThirdCategory(dto: CreateThirdCategoryDto): Observable<ThirdCategoryDto> {
    return this.http.post<ThirdCategoryDto>(`${this.apiUrl}/third`, dto);
  }

  updateThirdCategory(id: number, dto: CreateThirdCategoryDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/third/${id}`, dto);
  }

  deleteThirdCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/third/${id}`);
  }

  // Vendors
  getVendors(): Observable<VendorDto[]> {
    return this.http.get<VendorDto[]>(`${this.apiUrl}/vendors`);
  }

  getVendorById(id: number): Observable<VendorDto> {
    return this.http.get<VendorDto>(`${this.apiUrl}/vendors/${id}`);
  }

  createVendor(dto: CreateVendorDto): Observable<VendorDto> {
    return this.http.post<VendorDto>(`${this.apiUrl}/vendors`, dto);
  }

  updateVendor(id: number, dto: CreateVendorDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/vendors/${id}`, dto);
  }

  deleteVendor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vendors/${id}`);
  }

  // Brands
  getBrands(): Observable<BrandDto[]> {
    return this.http.get<BrandDto[]>(`${this.apiUrl}/brands`);
  }

  getBrandById(id: number): Observable<BrandDto> {
    return this.http.get<BrandDto>(`${this.apiUrl}/brands/${id}`);
  }

  createBrand(dto: CreateBrandDto): Observable<BrandDto> {
    return this.http.post<BrandDto>(`${this.apiUrl}/brands`, dto);
  }

  updateBrand(id: number, dto: CreateBrandDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/brands/${id}`, dto);
  }

  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/brands/${id}`);
  }
}

