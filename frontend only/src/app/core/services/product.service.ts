import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product, ProductCreateRequest, StockAlert } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Coca Cola 500ml',
      barcode: '5449000000996',
      description: 'Refreshing cola drink',
      categoryId: '1',
      categoryName: 'Beverages',
      purchasePrice: 0.50,
      salePrice: 1.00,
      taxRate: 10,
      maxDiscountPercent: 10,
      stockQuantity: 150,
      minStockLevel: 50,
      imageUrl: 'https://via.placeholder.com/200?text=Coca+Cola',
      isAvailable: true,
      dealerId: '1',
      dealerName: 'Beverage Distributors Inc',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Bread Loaf',
      barcode: '1234567890123',
      description: 'Fresh white bread',
      categoryId: '2',
      categoryName: 'Bakery',
      purchasePrice: 1.20,
      salePrice: 2.50,
      taxRate: 5,
      maxDiscountPercent: 5,
      stockQuantity: 30,
      minStockLevel: 20,
      imageUrl: 'https://via.placeholder.com/200?text=Bread',
      isAvailable: true,
      dealerId: '2',
      dealerName: 'Local Bakery Supply',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Milk 1L',
      barcode: '9876543210987',
      description: 'Full cream fresh milk',
      categoryId: '3',
      categoryName: 'Dairy',
      purchasePrice: 1.00,
      salePrice: 2.00,
      taxRate: 5,
      maxDiscountPercent: 5,
      stockQuantity: 80,
      minStockLevel: 40,
      imageUrl: 'https://via.placeholder.com/200?text=Milk',
      isAvailable: true,
      dealerId: '3',
      dealerName: 'Dairy Fresh Co',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Rice 5kg',
      barcode: '5551234567890',
      description: 'Premium Basmati rice',
      categoryId: '4',
      categoryName: 'Groceries',
      purchasePrice: 8.00,
      salePrice: 12.00,
      taxRate: 0,
      maxDiscountPercent: 8,
      stockQuantity: 25,
      minStockLevel: 30,
      imageUrl: 'https://via.placeholder.com/200?text=Rice',
      isAvailable: true,
      dealerId: '4',
      dealerName: 'Grain Wholesalers',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Chips 200g',
      barcode: '7778889990000',
      description: 'Crispy potato chips',
      categoryId: '5',
      categoryName: 'Snacks',
      purchasePrice: 1.50,
      salePrice: 3.00,
      taxRate: 10,
      maxDiscountPercent: 15,
      stockQuantity: 200,
      minStockLevel: 100,
      imageUrl: 'https://via.placeholder.com/200?text=Chips',
      isAvailable: true,
      dealerId: '5',
      dealerName: 'Snack Masters Ltd',
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date()
    },
    {
      id: '6',
      name: 'Cooking Oil 2L',
      barcode: '4445556667778',
      description: 'Refined vegetable oil',
      categoryId: '4',
      categoryName: 'Groceries',
      purchasePrice: 5.00,
      salePrice: 8.50,
      taxRate: 5,
      maxDiscountPercent: 5,
      stockQuantity: 15,
      minStockLevel: 25,
      imageUrl: 'https://via.placeholder.com/200?text=Oil',
      isAvailable: true,
      dealerId: '4',
      dealerName: 'Grain Wholesalers',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date()
    }
  ];

  constructor() {
    this.productsSubject.next(this.mockProducts);
  }

  getAllProducts(): Observable<Product[]> {
    return of(this.mockProducts).pipe(delay(300));
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(this.mockProducts.find(p => p.id === id)).pipe(delay(200));
  }

  getProductByBarcode(barcode: string): Observable<Product | undefined> {
    return of(this.mockProducts.find(p => p.barcode === barcode)).pipe(delay(200));
  }

  searchProducts(query: string): Observable<Product[]> {
    return of(
      this.mockProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.barcode.includes(query) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    ).pipe(delay(300));
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return of(this.mockProducts.filter(p => p.categoryId === categoryId)).pipe(delay(300));
  }

  createProduct(request: ProductCreateRequest): Observable<Product> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const newProduct: Product = {
          id: (this.mockProducts.length + 1).toString(),
          ...request,
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.mockProducts.push(newProduct);
        this.productsSubject.next(this.mockProducts);
        return newProduct;
      })
    );
  }

  updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockProducts.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Product not found');
        
        this.mockProducts[index] = {
          ...this.mockProducts[index],
          ...updates,
          updatedAt: new Date()
        };
        this.productsSubject.next(this.mockProducts);
        return this.mockProducts[index];
      })
    );
  }

  deleteProduct(id: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockProducts.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Product not found');
        
        this.mockProducts.splice(index, 1);
        this.productsSubject.next(this.mockProducts);
        return true;
      })
    );
  }

  updateStock(productId: string, quantity: number): Observable<Product> {
    return this.updateProduct(productId, { stockQuantity: quantity });
  }

  getLowStockProducts(): Observable<Product[]> {
    return of(
      this.mockProducts.filter(p => p.stockQuantity <= p.minStockLevel)
    ).pipe(delay(300));
  }

  getStockAlerts(): Observable<StockAlert[]> {
    return of(
      this.mockProducts
        .filter(p => p.stockQuantity <= p.minStockLevel)
        .map(product => ({
          product,
          currentStock: product.stockQuantity,
          minStock: product.minStockLevel,
          predictedDaysUntilEmpty: this.predictDaysUntilEmpty(product),
          aiSuggestedReorder: this.calculateAISuggestedReorder(product)
        }))
    ).pipe(delay(300));
  }

  private predictDaysUntilEmpty(product: Product): number {
    // Mock AI prediction based on average daily sales
    const avgDailySales = Math.random() * 10 + 5;
    return Math.floor(product.stockQuantity / avgDailySales);
  }

  private calculateAISuggestedReorder(product: Product): number {
    // Mock AI suggestion: 2x min stock level + buffer
    return Math.ceil(product.minStockLevel * 2.5);
  }

  uploadProductImage(productId: string, file: File): Observable<string> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        // Mock upload - return placeholder URL
        const imageUrl = `https://via.placeholder.com/200?text=${productId}`;
        return imageUrl;
      })
    );
  }
}
