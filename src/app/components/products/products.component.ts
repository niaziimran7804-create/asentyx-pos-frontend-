import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductDto, CreateProductDto } from '../../models/product.models';
import { CategoryService } from '../../services/category.service';
import { BrandDto } from '../../models/category.models';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

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
  showImportForm: boolean = false;
  importFile: File | null = null;
  importProgress: number = 0;
  importResults: { success: number; failed: number; errors: string[] } = { success: 0, failed: 0, errors: [] };
  productForm: CreateProductDto = {
    productName: '',
    brandId: 0,
    productStatus: 'YES',
    productQuantityPerUnit: 0,
    productPerUnitPrice: 0,
    productMSRP: 0,
    productDiscountRate: 0,
    productColor: 0,
    productUnitStock: 0,
    stockThreshold: 10,
    productImageBase64: null
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
      { label: 'Returns', icon: 'fas fa-undo', route: '/returns' },
      { label: 'Categories', icon: 'fas fa-tags', route: '/categories' },
      { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' },
      { label: 'Accounting', icon: 'fas fa-calculator', route: '/accounting' },
      { label: 'Customer Balance', icon: 'fas fa-users-cog', route: '/customer-balance' }
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

  // Helper method to convert image file to base64
  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async createProduct(): Promise<void> {
    // Convert image to base64 if selected
    let productImageBase64: string | null = null;
    if (this.selectedImage) {
      productImageBase64 = await this.convertImageToBase64(this.selectedImage);
    }

    // Create JSON payload matching backend DTO
    const productPayload: CreateProductDto = {
      productIdTag: this.productForm.productIdTag,
      productName: this.productForm.productName,
      brandId: this.productForm.brandId,
      productDescription: this.productForm.productDescription,
      productQuantityPerUnit: this.productForm.productQuantityPerUnit,
      productPerUnitPrice: this.productForm.productPerUnitPrice,
      productMSRP: this.productForm.productMSRP,
      productStatus: this.productForm.productStatus,
      productDiscountRate: this.productForm.productDiscountRate,
      productColor: this.productForm.productColor,
      productUnitStock: this.productForm.productUnitStock,
      stockThreshold: this.productForm.stockThreshold || 10,
      productImageBase64: productImageBase64
    };
    
    this.productService.createProduct(productPayload).subscribe({
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
      productColor: typeof product.productColor === 'string' ? parseInt(product.productColor) || 0 : 0,
      productUnitStock: product.productUnitStock,
      stockThreshold: 10,
      productImageBase64: product.productImageBase64 || null
    };
    this.showForm = true;
  }

  async updateProduct(): Promise<void> {
    if (this.editingProduct) {
      // Convert image to base64 if selected
      let productImageBase64: string | null = null;
      if (this.selectedImage) {
        productImageBase64 = await this.convertImageToBase64(this.selectedImage);
      }
      
      // Create JSON payload matching backend DTO
      const productPayload = {
        productName: this.productForm.productName,
        brandId: this.productForm.brandId,
        productStatus: this.productForm.productStatus,
        productQuantityPerUnit: this.productForm.productQuantityPerUnit,
        productPerUnitPrice: this.productForm.productPerUnitPrice,
        productMSRP: this.productForm.productMSRP,
        productDiscountRate: this.productForm.productDiscountRate,
        //productColor: this.productForm.productColor,
        productUnitStock: this.productForm.productUnitStock,
        stockThreshold: this.productForm.stockThreshold || 10,
        productImageBase64: productImageBase64 || this.productForm.productImageBase64
      };
      
      this.productService.updateProduct(this.editingProduct.productId, productPayload).subscribe({
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
      productColor: 0,
      productUnitStock: 0,
      stockThreshold: 10,
      productImageBase64: null
    };
  }

  // Excel Import Functionality
  onImportFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please select an Excel file (.xlsx or .xls)',
          confirmButtonColor: '#667eea'
        });
        return;
      }
      this.importFile = file;
    }
  }

  processImportFile(): void {
    if (!this.importFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select an Excel file to import',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Empty File',
            text: 'The Excel file is empty',
            confirmButtonColor: '#667eea'
          });
          return;
        }

        // Validate and import products
        this.importProducts(jsonData);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error Reading File',
          text: 'Failed to read the Excel file. Please check the file format.',
          confirmButtonColor: '#667eea'
        });
      }
    };
    fileReader.readAsArrayBuffer(this.importFile);
  }

  importProducts(data: any[]): void {
    this.importResults = { success: 0, failed: 0, errors: [] };
    this.importProgress = 0;
    let processed = 0;

    const importNext = (index: number) => {
      if (index >= data.length) {
        // All products processed
        this.showImportResults();
        return;
      }

      const row = data[index];
      const product = this.mapExcelRowToProduct(row);

      if (!product) {
        this.importResults.failed++;
        this.importResults.errors.push(`Row ${index + 2}: Invalid data format`);
        processed++;
        this.importProgress = Math.round((processed / data.length) * 100);
        setTimeout(() => importNext(index + 1), 100);
        return;
      }

      // Create product via API
      this.productService.createProduct(product).subscribe({
        next: () => {
          this.importResults.success++;
          processed++;
          this.importProgress = Math.round((processed / data.length) * 100);
          setTimeout(() => importNext(index + 1), 100);
        },
        error: (error) => {
          this.importResults.failed++;
          const errorMsg = error.error?.message || error.message || 'Unknown error';
          this.importResults.errors.push(`Row ${index + 2} (${row.ProductName || 'Unknown'}): ${errorMsg}`);
          processed++;
          this.importProgress = Math.round((processed / data.length) * 100);
          setTimeout(() => importNext(index + 1), 100);
        }
      });
    };

    // Start importing
    importNext(0);
  }

  mapExcelRowToProduct(row: any): CreateProductDto | null {
    try {
      // Map Excel columns to product properties
      // Expected columns: ProductName, BrandName, Price, MSRP, Stock, Status
      const brandName = row.BrandName || row['Brand Name'] || row.Brand;
      const brand = this.brands.find(b => b.brandName.toLowerCase() === brandName?.toLowerCase());

      if (!brand) {
        return null;
      }

      const product: CreateProductDto = {
        productName: row.ProductName || row['Product Name'] || row.Name || '',
        brandId: brand.brandId,
        productPerUnitPrice: parseFloat(row.Price || row['Unit Price'] || 0),
        productMSRP: parseFloat(row.MSRP || row['MSRP Price'] || 0),
        productUnitStock: parseInt(row.Stock || row.Quantity || 0),
        productStatus: (row.Status || 'YES').toUpperCase() === 'YES' ? 'YES' : 'NO',
        productQuantityPerUnit: parseInt(row.QuantityPerUnit || 0) || 0,
        productDiscountRate: parseFloat(row.DiscountRate || 0) || 0,
        productColor: parseInt(row.Color || row.ColorId || 0) || 0,
        stockThreshold: parseInt(row.StockThreshold || 10) || 10,
        productImageBase64: null
      };

      // Validate required fields
      if (!product.productName || product.brandId === 0 || product.productPerUnitPrice <= 0) {
        return null;
      }

      return product;
    } catch (error) {
      return null;
    }
  }

  showImportResults(): void {
    const total = this.importResults.success + this.importResults.failed;
    const errorList = this.importResults.errors.length > 0
      ? `<div style="max-height: 200px; overflow-y: auto; text-align: left; margin-top: 10px;">
           <strong>Errors:</strong><br>
           ${this.importResults.errors.slice(0, 10).map(e => `<small>• ${e}</small>`).join('<br>')}
           ${this.importResults.errors.length > 10 ? `<br><small>...and ${this.importResults.errors.length - 10} more errors</small>` : ''}
         </div>`
      : '';

    Swal.fire({
      icon: this.importResults.failed === 0 ? 'success' : 'warning',
      title: 'Import Complete',
      html: `
        <div style="text-align: center;">
          <p><strong>Total Products:</strong> ${total}</p>
          <p><strong style="color: #48bb78;">✓ Successfully Imported:</strong> ${this.importResults.success}</p>
          <p><strong style="color: #f56565;">✗ Failed:</strong> ${this.importResults.failed}</p>
        </div>
        ${errorList}
      `,
      confirmButtonColor: '#667eea',
      width: '600px'
    }).then(() => {
      // Refresh products list and reset form
      this.loadProducts();
      this.resetImportForm();
    });
  }

  resetImportForm(): void {
    this.showImportForm = false;
    this.importFile = null;
    this.importProgress = 0;
    this.importResults = { success: 0, failed: 0, errors: [] };
  }

  downloadTemplate(): void {
    // Create a sample Excel template
    const template = [
      {
        'Product Name': 'Sample Product 1',
        'Brand Name': this.brands.length > 0 ? this.brands[0].brandName : 'Sample Brand',
        'Price': 10.99,
        'MSRP': 15.99,
        'Stock': 100,
        'Status': 'YES',
        'QuantityPerUnit': 1,
        'DiscountRate': 0,
        'Size': 0,
        'Weight': 0
      },
      {
        'Product Name': 'Sample Product 2',
        'Brand Name': this.brands.length > 0 ? this.brands[0].brandName : 'Sample Brand',
        'Price': 25.50,
        'MSRP': 30.00,
        'Stock': 50,
        'Status': 'YES',
        'QuantityPerUnit': 1,
        'DiscountRate': 0,
        'Size': 0,
        'Weight': 0
      }
    ];

    const worksheet = (XLSX.utils as any).json_to_sheet(template);
    const workbook = { Sheets: { 'Products': worksheet }, SheetNames: ['Products'] };
    (XLSX as any).writeFile(workbook, 'product_import_template.xlsx');

    Swal.fire({
      icon: 'success',
      title: 'Template Downloaded',
      text: 'Please fill in the template with your product data',
      confirmButtonColor: '#667eea',
      timer: 2000
    });
  }
}

