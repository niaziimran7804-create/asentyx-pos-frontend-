import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Return, ReturnCreateRequest } from '../models/return.model';

@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private returnsSubject = new BehaviorSubject<Return[]>([]);
  public returns$ = this.returnsSubject.asObservable();
  private returnCounter = 5001;

  private mockReturns: Return[] = [];

  constructor() {}

  createReturn(request: ReturnCreateRequest): Observable<Return> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const newReturn: Return = {
          id: Date.now().toString(),
          returnNumber: `RET-2024-${this.returnCounter++}`,
          originalBillId: request.originalBillId,
          originalBillNumber: 'INV-2024-1001', // Would be fetched from billing service
          customerId: undefined,
          customerName: 'Customer Name',
          salesmanId: '2',
          salesmanName: 'John Salesman',
          items: request.items.map(item => ({
            billItemId: item.billItemId,
            productId: item.productId,
            productName: 'Product Name',
            barcode: '1234567890',
            originalQuantity: 10,
            returnQuantity: item.returnQuantity,
            unitPrice: 10.00,
            total: item.returnQuantity * 10.00,
            reason: item.reason
          })),
          subtotal: 0,
          tax: 0,
          total: 0,
          refundAmount: 0,
          reason: request.reason,
          status: 'PENDING',
          createdAt: new Date()
        };

        // Calculate totals
        newReturn.subtotal = newReturn.items.reduce((sum, item) => sum + item.total, 0);
        newReturn.total = newReturn.subtotal;
        newReturn.refundAmount = newReturn.total;

        this.mockReturns.unshift(newReturn);
        this.returnsSubject.next(this.mockReturns);
        return newReturn;
      })
    );
  }

  getAllReturns(): Observable<Return[]> {
    return of(this.mockReturns).pipe(delay(300));
  }

  getReturnById(id: string): Observable<Return | undefined> {
    return of(this.mockReturns.find(r => r.id === id)).pipe(delay(200));
  }

  getReturnsByBill(billId: string): Observable<Return[]> {
    return of(this.mockReturns.filter(r => r.originalBillId === billId)).pipe(delay(300));
  }

  updateReturnStatus(returnId: string, status: Return['status']): Observable<Return> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const returnItem = this.mockReturns.find(r => r.id === returnId);
        if (!returnItem) throw new Error('Return not found');
        
        returnItem.status = status;
        if (status !== 'PENDING') {
          returnItem.processedAt = new Date();
        }
        
        this.returnsSubject.next(this.mockReturns);
        return returnItem;
      })
    );
  }
}
