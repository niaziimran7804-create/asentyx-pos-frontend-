import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BarCodeDto, CreateBarCodeDto, GenerateBarCodeDto } from '../models/barcode.models';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {
  private apiUrl = 'http://asentyx.com:5000/api/barcodes';

  constructor(private http: HttpClient) { }

  getBarCodes(): Observable<BarCodeDto[]> {
    return this.http.get<BarCodeDto[]>(this.apiUrl);
  }

  getBarCodeById(id: number): Observable<BarCodeDto> {
    return this.http.get<BarCodeDto>(`${this.apiUrl}/${id}`);
  }

  createBarCode(dto: CreateBarCodeDto): Observable<BarCodeDto> {
    return this.http.post<BarCodeDto>(this.apiUrl, dto);
  }

  updateBarCode(id: number, dto: CreateBarCodeDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  deleteBarCode(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generateBarCode(dto: GenerateBarCodeDto): Observable<BarCodeDto> {
    return this.http.post<BarCodeDto>(`${this.apiUrl}/generate`, dto);
  }
}

