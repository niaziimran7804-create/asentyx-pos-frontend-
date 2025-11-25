import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductDto, CreateProductDto } from '../../models/product.models';
import { CategoryService } from '../../services/category.service';
import { BrandDto } from '../../models/category.models';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

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
  currentUser: any;
  isSidebarCollapsed = false;
  menuItems: MenuItem[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  loading: boolean = false;
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
    productUnitStock: 0,
    productImage: undefined
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.setupMenuItems();
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadProducts();
    this.loadBrands();
  }

  setupMenuItems(): void {
    this.menuItems = [
      { label: 'Dashboard', icon: 'fas fa-chart-line', route: '/dashboard' },
      { label: 'Products', icon: 'fas fa-box', route: '/products' },
      { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
      { label: 'Categories', icon: 'fas fa-tags', route: '/categories' },
      { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' }
    ];

    if (this.isAdmin() || this.isCashier()) {
      this.menuItems.push({ label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' });
    }

    if (this.isAdmin()) {
      this.menuItems.push({ label: 'Expenses', icon: 'fas fa-money-bill-wave', route: '/expenses' });
      this.menuItems.push({ label: 'Users', icon: 'fas fa-users', route: '/users' });
    }
  }

  get sidebarWidth(): string {
    return this.isSidebarCollapsed ? '80px' : '280px';
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getUserRole(): string {
    return this.currentUser?.role || 'User';
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCashier(): boolean {
    return this.authService.isCashier();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts(this.searchKey || undefined).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
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
    const formData = new FormData();
    
    // Append all form fields
    formData.append('productName', this.productForm.productName);
    formData.append('brandId', this.productForm.brandId.toString());
    formData.append('productStatus', this.productForm.productStatus);
    formData.append('productQuantityPerUnit', this.productForm.productQuantityPerUnit.toString());
    formData.append('productPerUnitPrice', this.productForm.productPerUnitPrice.toString());
    formData.append('productMSRP', this.productForm.productMSRP.toString());
    formData.append('productDiscountRate', this.productForm.productDiscountRate.toString());
    formData.append('productSize', this.productForm.productSize.toString());
    formData.append('productWeight', this.productForm.productWeight.toString());
    formData.append('productUnitStock', this.productForm.productUnitStock.toString());
    
    // Append image file if selected
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    
    this.productService.createProduct(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Product created successfully',
          confirmButtonColor: '#667eea',
          timer: 2000
        });
        this.loadProducts();
        this.resetForm();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Creating Product',
          text: 'Failed to create product. Please try again.',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  editProduct(product: ProductDto): void {
    this.editingProduct = product;
    this.showForm = true;
    // Set image preview from existing product image (base64)
    if (product.productImageBase64) {
      this.imagePreview = 'data:image/jpeg;base64,' + product.productImageBase64;
    } else {
      this.imagePreview = null;
    }
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
      productUnitStock: product.productUnitStock,
      productImage: product.productImage
    };
    this.showForm = true;
  }

  updateProduct(): void {
    if (this.editingProduct) {
      const formData = new FormData();
      
      // Append all form fields
      formData.append('productName', this.productForm.productName);
      formData.append('brandId', this.productForm.brandId.toString());
      formData.append('productStatus', this.productForm.productStatus);
      formData.append('productQuantityPerUnit', this.productForm.productQuantityPerUnit.toString());
      formData.append('productPerUnitPrice', this.productForm.productPerUnitPrice.toString());
      formData.append('productMSRP', this.productForm.productMSRP.toString());
      formData.append('productDiscountRate', this.productForm.productDiscountRate.toString());
      formData.append('productSize', this.productForm.productSize.toString());
      formData.append('productWeight', this.productForm.productWeight.toString());
      formData.append('productUnitStock', this.productForm.productUnitStock.toString());
      
      // Append new image file if selected
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }
      
      this.productService.updateProduct(this.editingProduct.productId, formData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Product updated successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadProducts();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Updating Product',
            text: 'Failed to update product. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    }
  }

  deleteProduct(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Product has been deleted.',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadProducts();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete product. Please try again.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }

  resetForm(): void {
    this.showForm = false;
    this.editingProduct = null;
    this.selectedImage = null;
    this.imagePreview = null;
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
      productUnitStock: 0,
      productImage: undefined
    };
  }
}

