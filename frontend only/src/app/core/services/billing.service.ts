import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Bill, BillItem } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private billsSubject = new BehaviorSubject<Bill[]>([]);
  public bills$ = this.billsSubject.asObservable();
  private billCounter = 1001;

  private mockBills: Bill[] = [];

  constructor() {}

  generateBill(bill: Partial<Bill>): Observable<Bill> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const newBill: Bill = {
          id: Date.now().toString(),
          billNumber: `INV-2024-${this.billCounter++}`,
          customerId: bill.customerId,
          customerName: bill.customerName || 'Walk-in Customer',
          salesmanId: bill.salesmanId!,
          salesmanName: bill.salesmanName!,
          items: bill.items || [],
          subtotal: bill.subtotal || 0,
          discount: bill.discount || 0,
          tax: bill.tax || 0,
          total: bill.total || 0,
          paymentStatus: bill.paymentStatus || 'PAID',
          paymentMethod: bill.paymentMethod,
          createdAt: new Date(),
          dueDate: bill.dueDate
        };
        this.mockBills.unshift(newBill);
        this.billsSubject.next(this.mockBills);
        return newBill;
      })
    );
  }

  getAllBills(): Observable<Bill[]> {
    return of(this.mockBills).pipe(delay(300));
  }

  getBillById(id: string): Observable<Bill | undefined> {
    return of(this.mockBills.find(b => b.id === id)).pipe(delay(200));
  }

  getBillByNumber(billNumber: string): Observable<Bill | undefined> {
    return of(this.mockBills.find(b => b.billNumber === billNumber)).pipe(delay(200));
  }

  getBillsByCustomer(customerId: string): Observable<Bill[]> {
    return of(this.mockBills.filter(b => b.customerId === customerId)).pipe(delay(300));
  }

  getBillsBySalesman(salesmanId: string): Observable<Bill[]> {
    return of(this.mockBills.filter(b => b.salesmanId === salesmanId)).pipe(delay(300));
  }

  getPendingBills(): Observable<Bill[]> {
    return of(this.mockBills.filter(b => b.paymentStatus === 'PENDING')).pipe(delay(300));
  }

  updatePaymentStatus(billId: string, status: 'PAID' | 'PENDING'): Observable<Bill> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const bill = this.mockBills.find(b => b.id === billId);
        if (!bill) throw new Error('Bill not found');
        
        bill.paymentStatus = status;
        this.billsSubject.next(this.mockBills);
        return bill;
      })
    );
  }

  searchBills(query: string): Observable<Bill[]> {
    return of(
      this.mockBills.filter(b =>
        b.billNumber.toLowerCase().includes(query.toLowerCase()) ||
        b.customerName.toLowerCase().includes(query.toLowerCase())
      )
    ).pipe(delay(300));
  }

  getBillsByDateRange(startDate: Date, endDate: Date): Observable<Bill[]> {
    return of(
      this.mockBills.filter(b => {
        const billDate = new Date(b.createdAt);
        return billDate >= startDate && billDate <= endDate;
      })
    ).pipe(delay(300));
  }

  calculateBillTotals(items: BillItem[]): {subtotal: number, tax: number, total: number} {
    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
    const totalTax = items.reduce((sum, item) => sum + item.tax, 0);
    const total = subtotal - totalDiscount + totalTax;
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(totalTax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  }

  printBill(billId: string): Observable<boolean> {
    return of(true).pipe(delay(500));
  }

  exportBillToPDF(billId: string): Observable<Blob> {
    return of(new Blob(['Mock PDF'], { type: 'application/pdf' })).pipe(delay(1000));
  }
}
