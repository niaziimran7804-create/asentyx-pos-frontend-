export interface Product {
  id: string;
  name: string;
  barcode: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  purchasePrice: number;
  salePrice: number;
  taxRate: number;
  maxDiscountPercent: number;
  stockQuantity: number;
  minStockLevel: number;
  imageUrl?: string;
  isAvailable: boolean;
  dealerId?: string;
  dealerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreateRequest {
  name: string;
  barcode: string;
  description: string;
  categoryId: string;
  purchasePrice: number;
  salePrice: number;
  taxRate: number;
  maxDiscountPercent: number;
  stockQuantity: number;
  minStockLevel: number;
  imageUrl?: string;
}

export interface StockAlert {
  product: Product;
  currentStock: number;
  minStock: number;
  predictedDaysUntilEmpty: number;
  aiSuggestedReorder: number;
}
