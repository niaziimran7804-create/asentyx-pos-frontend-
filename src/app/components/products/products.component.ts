import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductDto, CreateProductDto } from '../../models/product.models';
import { CategoryService } from '../../services/category.service';
import { BrandDto } from '../../models/category.models';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: ProductDto[] = [];
  brands: BrandDto[] = [];
  searchKey: string = '';
  showForm: boolean = false;
  editingProduct: ProductDto | null = null;
  productForm: CreateProductDto = {
    productName: '',
    brandId: 0,
    productStatus: 'YES',
    productQuantityPerUnit: 0,
    productPerUnitPrice: 0,
    productMSRP: 0,
    productDiscountRate: 0,
    productSize: 0,
    productWeight: 0,
    productUnitStock: 0
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadBrands();
  }

  loadProducts(): void {
    this.productService.getAllProducts(this.searchKey || undefined).subscribe({
      next: (data) => this.products = data,
      error: (error) => console.error('Error loading products:', error)
    });
  }

  loadBrands(): void {
    this.categoryService.getBrands().subscribe({
      next: (data) => this.brands = data,
      error: (error) => console.error('Error loading brands:', error)
    });
  }

  search(): void {
    this.loadProducts();
  }

  createProduct(): void {
    this.productService.createProduct(this.productForm).subscribe({
      next: () => {
        this.loadProducts();
        this.resetForm();
      },
      error: (error) => console.error('Error creating product:', error)
    });
  }

  editProduct(product: ProductDto): void {
    this.editingProduct = product;
    this.productForm = {
      productName: product.productName,
      brandId: product.brandId,
      productStatus: product.productStatus,
      productQuantityPerUnit: product.productQuantityPerUnit,
      productPerUnitPrice: product.productPerUnitPrice,
      productMSRP: product.productMSRP,
      productDiscountRate: product.productDiscountRate,
      productSize: product.productSize,
      productColor: product.productColor,
      productWeight: product.productWeight,
      productUnitStock: product.productUnitStock
    };
    this.showForm = true;
  }

  updateProduct(): void {
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.productId, this.productForm).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
        },
        error: (error) => console.error('Error updating product:', error)
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (error) => console.error('Error deleting product:', error)
      });
    }
  }

  resetForm(): void {
    this.showForm = false;
    this.editingProduct = null;
    this.productForm = {
      productName: '',
      brandId: 0,
      productStatus: 'YES',
      productQuantityPerUnit: 0,
      productPerUnitPrice: 0,
      productMSRP: 0,
      productDiscountRate: 0,
      productSize: 0,
      productWeight: 0,
      productUnitStock: 0
    };
  }
}

