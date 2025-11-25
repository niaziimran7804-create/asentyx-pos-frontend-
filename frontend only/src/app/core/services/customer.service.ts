import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Customer, CustomerPurchaseHistory, Bill, CustomerLedger, PendingPaymentFilter } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  public customers$ = this.customersSubject.asObservable();

  private mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'Walk-in Customer',
      phone: 'N/A',
      area: 'General',
      discountEligible: false,
      discountPercent: 0,
      totalPurchases: 0,
      pendingAmount: 0,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1234567800',
      address: '123 Main St, Downtown',
      area: 'Downtown',
      discountEligible: true,
      discountPercent: 5,
      totalPurchases: 2500,
      pendingAmount: 350,
      lastPurchaseDate: new Date('2024-11-20'),
      createdAt: new Date('2024-03-15')
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'mbrown@email.com',
      phone: '+1234567801',
      address: '456 Oak Ave, North District',
      area: 'North District',
      discountEligible: true,
      discountPercent: 10,
      totalPurchases: 5200,
      pendingAmount: 0,
      lastPurchaseDate: new Date('2024-11-22'),
      createdAt: new Date('2024-02-10')
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      phone: '+1234567802',
      address: '789 Pine Rd, East Side',
      area: 'East Side',
      discountEligible: false,
      discountPercent: 0,
      totalPurchases: 850,
      pendingAmount: 125,
      lastPurchaseDate: new Date('2024-11-15'),
      createdAt: new Date('2024-04-20')
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'dwilson@email.com',
      phone: '+1234567803',
      address: '321 Elm St, West End',
      area: 'West End',
      discountEligible: true,
      discountPercent: 8,
      totalPurchases: 3800,
      pendingAmount: 550,
      lastPurchaseDate: new Date('2024-11-18'),
      createdAt: new Date('2024-01-25')
    },
    {
      id: '6',
      name: 'Linda Martinez',
      email: 'linda.m@email.com',
      phone: '+1234567804',
      address: '555 Maple Dr, Downtown',
      area: 'Downtown',
      discountEligible: true,
      discountPercent: 5,
      totalPurchases: 1850,
      pendingAmount: 200,
      lastPurchaseDate: new Date('2024-11-19'),
      createdAt: new Date('2024-05-10')
    },
    {
      id: '7',
      name: 'Robert Taylor',
      email: 'rtaylor@email.com',
      phone: '+1234567805',
      address: '888 Cedar Ln, South Zone',
      area: 'South Zone',
      discountEligible: false,
      discountPercent: 0,
      totalPurchases: 1200,
      pendingAmount: 450,
      lastPurchaseDate: new Date('2024-11-17'),
      createdAt: new Date('2024-06-05')
    }
  ];

  constructor() {
    this.customersSubject.next(this.mockCustomers);
  }

  getAllCustomers(): Observable<Customer[]> {
    return of(this.mockCustomers).pipe(delay(300));
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    return of(this.mockCustomers.find(c => c.id === id)).pipe(delay(200));
  }

  searchCustomers(query: string): Observable<Customer[]> {
    return of(
      this.mockCustomers.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query) ||
        (c.email && c.email.toLowerCase().includes(query.toLowerCase()))
      )
    ).pipe(delay(300));
  }

  createCustomer(customer: Partial<Customer>): Observable<Customer> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const newCustomer: Customer = {
          id: (this.mockCustomers.length + 1).toString(),
          name: customer.name!,
          email: customer.email,
          phone: customer.phone!,
          address: customer.address,
          area: customer.area || 'General',
          discountEligible: customer.discountEligible || false,
          discountPercent: customer.discountPercent || 0,
          totalPurchases: 0,
          pendingAmount: 0,
          createdAt: new Date()
        };
        this.mockCustomers.push(newCustomer);
        this.customersSubject.next(this.mockCustomers);
        return newCustomer;
      })
    );
  }

  updateCustomer(id: string, updates: Partial<Customer>): Observable<Customer> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockCustomers.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Customer not found');
        
        this.mockCustomers[index] = {
          ...this.mockCustomers[index],
          ...updates
        };
        this.customersSubject.next(this.mockCustomers);
        return this.mockCustomers[index];
      })
    );
  }

  deleteCustomer(id: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockCustomers.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Customer not found');
        
        this.mockCustomers.splice(index, 1);
        this.customersSubject.next(this.mockCustomers);
        return true;
      })
    );
  }

  getCustomersWithPendingPayments(): Observable<Customer[]> {
    return of(
      this.mockCustomers.filter(c => c.pendingAmount > 0)
    ).pipe(delay(300));
  }

  updatePendingAmount(customerId: string, amount: number): Observable<Customer> {
    return this.updateCustomer(customerId, { pendingAmount: amount });
  }

  markPendingAsPaid(customerId: string, billId: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const customer = this.mockCustomers.find(c => c.id === customerId);
        if (!customer) throw new Error('Customer not found');
        
        // In real implementation, would update specific bill
        customer.pendingAmount = 0;
        this.customersSubject.next(this.mockCustomers);
        return true;
      })
    );
  }

  getCustomerPurchaseHistory(customerId: string): Observable<CustomerPurchaseHistory> {
    return of(null).pipe(
      delay(400),
      map(() => {
        const customer = this.mockCustomers.find(c => c.id === customerId);
        if (!customer) throw new Error('Customer not found');
        
        // Mock purchase history
        const mockBills: Bill[] = [
          {
            id: '101',
            billNumber: 'INV-2024-101',
            customerId: customer.id,
            customerName: customer.name,
            salesmanId: '2',
            salesmanName: 'John Salesman',
            items: [
              {
                productId: '1',
                productName: 'Coca Cola 500ml',
                barcode: '5449000000996',
                quantity: 2,
                unitPrice: 1.00,
                discount: 0.10,
                tax: 0.18,
                total: 2.08
              }
            ],
            subtotal: 2.00,
            discount: 0.10,
            tax: 0.18,
            total: 2.08,
            paymentStatus: 'PAID',
            paymentMethod: 'Cash',
            createdAt: new Date('2024-11-20')
          }
        ];

        return {
          customerId: customer.id,
          bills: mockBills,
          totalSpent: customer.totalPurchases,
          totalPending: customer.pendingAmount,
          averageOrderValue: customer.totalPurchases / Math.max(mockBills.length, 1)
        };
      })
    );
  }

  // New methods for area-based filtering and ledger generation
  getUniqueAreas(): Observable<string[]> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const areas = [...new Set(this.mockCustomers.map(c => c.area))];
        return areas.sort();
      })
    );
  }

  getCustomersWithPendingPaymentsByFilter(filter: PendingPaymentFilter): Observable<Customer[]> {
    return of(null).pipe(
      delay(400),
      map(() => {
        let filtered = this.mockCustomers.filter(c => c.pendingAmount > 0);

        // Apply area filter
        if (filter.area && filter.area !== 'All') {
          filtered = filtered.filter(c => c.area === filter.area);
        }

        // Apply amount range filter
        if (filter.minAmount !== undefined) {
          filtered = filtered.filter(c => c.pendingAmount >= filter.minAmount!);
        }
        if (filter.maxAmount !== undefined) {
          filtered = filtered.filter(c => c.pendingAmount <= filter.maxAmount!);
        }

        // Apply customer name search
        if (filter.customerName) {
          const query = filter.customerName.toLowerCase();
          filtered = filtered.filter(c => c.name.toLowerCase().includes(query));
        }

        // Apply sorting
        if (filter.sortBy) {
          filtered.sort((a, b) => {
            let comparison = 0;
            switch (filter.sortBy) {
              case 'amount':
                comparison = a.pendingAmount - b.pendingAmount;
                break;
              case 'customer':
                comparison = a.name.localeCompare(b.name);
                break;
              case 'area':
                comparison = a.area.localeCompare(b.area);
                break;
              case 'date':
                const dateA = a.lastPurchaseDate?.getTime() || 0;
                const dateB = b.lastPurchaseDate?.getTime() || 0;
                comparison = dateA - dateB;
                break;
            }
            return filter.sortOrder === 'desc' ? -comparison : comparison;
          });
        }

        return filtered;
      })
    );
  }

  generateCustomerLedger(customerId: string): Observable<CustomerLedger> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const customer = this.mockCustomers.find(c => c.id === customerId);
        if (!customer) throw new Error('Customer not found');

        // Mock bills with pending payments
        const mockPendingBills: Bill[] = [
          {
            id: '201',
            billNumber: 'INV-2024-201',
            customerId: customer.id,
            customerName: customer.name,
            salesmanId: '2',
            salesmanName: 'John Salesman',
            items: [
              {
                productId: '1',
                productName: 'Product A',
                barcode: '1234567890',
                quantity: 5,
                unitPrice: 50.00,
                discount: 0,
                tax: 25.00,
                total: 275.00
              }
            ],
            subtotal: 250.00,
            discount: 0,
            tax: 25.00,
            total: 275.00,
            paymentStatus: 'PENDING',
            createdAt: new Date('2024-11-15'),
            dueDate: new Date('2024-12-15')
          },
          {
            id: '202',
            billNumber: 'INV-2024-202',
            customerId: customer.id,
            customerName: customer.name,
            salesmanId: '2',
            salesmanName: 'John Salesman',
            items: [
              {
                productId: '2',
                productName: 'Product B',
                barcode: '0987654321',
                quantity: 3,
                unitPrice: 25.00,
                discount: 0,
                tax: 7.50,
                total: 82.50
              }
            ],
            subtotal: 75.00,
            discount: 0,
            tax: 7.50,
            total: 82.50,
            paymentStatus: 'PENDING',
            createdAt: new Date('2024-11-10'),
            dueDate: new Date('2024-12-10')
          }
        ];

        return {
          customerId: customer.id,
          customerName: customer.name,
          area: customer.area,
          phone: customer.phone,
          address: customer.address,
          bills: mockPendingBills.filter(b => b.paymentStatus === 'PENDING'),
          totalPending: customer.pendingAmount,
          lastPaymentDate: customer.lastPurchaseDate
        };
      })
    );
  }

  generateAreaWiseLedgerReport(area: string): Observable<CustomerLedger[]> {
    return of(null).pipe(
      delay(600),
      map(() => {
        const customersInArea = this.mockCustomers.filter(c => 
          (area === 'All' || c.area === area) && c.pendingAmount > 0
        );

        return customersInArea.map(customer => ({
          customerId: customer.id,
          customerName: customer.name,
          area: customer.area,
          phone: customer.phone,
          address: customer.address,
          bills: [],
          totalPending: customer.pendingAmount,
          lastPaymentDate: customer.lastPurchaseDate
        }));
      })
    );
  }

  exportLedgerToPDF(ledgers: CustomerLedger[]): Observable<Blob> {
    // Mock PDF generation - in real app would use jsPDF
    return of(null).pipe(
      delay(800),
      map(() => {
        const content = JSON.stringify(ledgers, null, 2);
        return new Blob([content], { type: 'application/json' });
      })
    );
  }
}
