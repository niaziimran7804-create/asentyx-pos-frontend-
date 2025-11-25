import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Category, Dealer } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  private mockCategories: Category[] = [
    {
      id: '1',
      name: 'Beverages',
      description: 'Soft drinks, juices, water',
      dealerId: '1',
      dealerName: 'Beverage Distributors Inc',
      dealerWhatsApp: '+1234567890',
      productCount: 45,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Bakery',
      description: 'Bread, cakes, pastries',
      dealerId: '2',
      dealerName: 'Local Bakery Supply',
      dealerWhatsApp: '+1234567891',
      productCount: 28,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Dairy',
      description: 'Milk, cheese, yogurt',
      dealerId: '3',
      dealerName: 'Dairy Fresh Co',
      dealerWhatsApp: '+1234567892',
      productCount: 35,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Groceries',
      description: 'Rice, oil, spices, dry goods',
      dealerId: '4',
      dealerName: 'Grain Wholesalers',
      dealerWhatsApp: '+1234567893',
      productCount: 120,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Snacks',
      description: 'Chips, cookies, crackers',
      dealerId: '5',
      dealerName: 'Snack Masters Ltd',
      dealerWhatsApp: '+1234567894',
      productCount: 67,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    }
  ];

  private mockDealers: Dealer[] = [
    {
      id: '1',
      name: 'Beverage Distributors Inc',
      whatsApp: '+1234567890',
      email: 'contact@bevdist.com',
      categories: ['1'],
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Local Bakery Supply',
      whatsApp: '+1234567891',
      email: 'orders@bakerysupply.com',
      categories: ['2'],
      createdAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Dairy Fresh Co',
      whatsApp: '+1234567892',
      email: 'sales@dairyfresh.com',
      categories: ['3'],
      createdAt: new Date('2024-01-01')
    },
    {
      id: '4',
      name: 'Grain Wholesalers',
      whatsApp: '+1234567893',
      email: 'info@grainwholesale.com',
      categories: ['4'],
      createdAt: new Date('2024-01-01')
    },
    {
      id: '5',
      name: 'Snack Masters Ltd',
      whatsApp: '+1234567894',
      email: 'orders@snackmasters.com',
      categories: ['5'],
      createdAt: new Date('2024-01-01')
    }
  ];

  constructor() {
    this.categoriesSubject.next(this.mockCategories);
  }

  getAllCategories(): Observable<Category[]> {
    return of(this.mockCategories).pipe(delay(300));
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    return of(this.mockCategories.find(c => c.id === id)).pipe(delay(200));
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const newCategory: Category = {
          id: (this.mockCategories.length + 1).toString(),
          name: category.name!,
          description: category.description || '',
          dealerId: category.dealerId,
          dealerName: category.dealerName,
          dealerWhatsApp: category.dealerWhatsApp,
          productCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.mockCategories.push(newCategory);
        this.categoriesSubject.next(this.mockCategories);
        return newCategory;
      })
    );
  }

  updateCategory(id: string, updates: Partial<Category>): Observable<Category> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockCategories.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Category not found');
        
        this.mockCategories[index] = {
          ...this.mockCategories[index],
          ...updates,
          updatedAt: new Date()
        };
        this.categoriesSubject.next(this.mockCategories);
        return this.mockCategories[index];
      })
    );
  }

  deleteCategory(id: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockCategories.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Category not found');
        
        this.mockCategories.splice(index, 1);
        this.categoriesSubject.next(this.mockCategories);
        return true;
      })
    );
  }

  // Dealer methods
  getAllDealers(): Observable<Dealer[]> {
    return of(this.mockDealers).pipe(delay(300));
  }

  getDealerById(id: string): Observable<Dealer | undefined> {
    return of(this.mockDealers.find(d => d.id === id)).pipe(delay(200));
  }

  getDealersByCategory(categoryId: string): Observable<Dealer[]> {
    return of(
      this.mockDealers.filter(d => d.categories.includes(categoryId))
    ).pipe(delay(300));
  }

  createDealer(dealer: Partial<Dealer>): Observable<Dealer> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const newDealer: Dealer = {
          id: (this.mockDealers.length + 1).toString(),
          name: dealer.name!,
          whatsApp: dealer.whatsApp!,
          email: dealer.email,
          categories: dealer.categories || [],
          createdAt: new Date()
        };
        this.mockDealers.push(newDealer);
        return newDealer;
      })
    );
  }

  updateDealer(id: string, updates: Partial<Dealer>): Observable<Dealer> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockDealers.findIndex(d => d.id === id);
        if (index === -1) throw new Error('Dealer not found');
        
        this.mockDealers[index] = {
          ...this.mockDealers[index],
          ...updates
        };
        return this.mockDealers[index];
      })
    );
  }

  deleteDealer(id: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockDealers.findIndex(d => d.id === id);
        if (index === -1) throw new Error('Dealer not found');
        
        this.mockDealers.splice(index, 1);
        return true;
      })
    );
  }
}
