import { Component, OnInit } from '@angular/core';
import { BarcodeService } from '../../services/barcode.service';
import { BarCodeDto, CreateBarCodeDto, GenerateBarCodeDto } from '../../models/barcode.models';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barcodes',
  templateUrl: './barcodes.component.html',
  styleUrls: ['./barcodes.component.css']
})
export class BarcodesComponent implements OnInit {
  barcodes: BarCodeDto[] = [];
  showForm: boolean = false;
  editingBarcode: BarCodeDto | null = null;
  barcodeForm: CreateBarCodeDto = { barCode1: '' };
  generateForm: GenerateBarCodeDto = {};

  // Sidebar and Navbar properties
  isSidebarCollapsed = false;
  sidebarWidth = '280px';
  currentUser: any;
  loading: boolean = false;
  menuItems: any[] = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/dashboard' },
    { label: 'Categories', icon: 'fas fa-th-large', route: '/categories' },
    { label: 'Products', icon: 'fas fa-box', route: '/products' },
    { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
    { label: 'Returns', icon: 'fas fa-undo', route: '/returns' },
    { label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' },
    { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' },
    { label: 'Accounting', icon: 'fas fa-calculator', route: '/accounting' },
    { label: 'Customer Balance', icon: 'fas fa-users-cog', route: '/customer-balance' },
    { label: 'Expenses', icon: 'fas fa-wallet', route: '/expenses' },
    { label: 'Users', icon: 'fas fa-users', route: '/users' }
  ];

  constructor(
    private barcodeService: BarcodeService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadBarcodes();
    this.currentUser = {
      name: localStorage.getItem('userName') || 'User',
      role: localStorage.getItem('userRole') || 'cashier'
    };
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
    this.sidebarWidth = collapsed ? '80px' : '280px';
  }

  getUserRole(): string {
    return this.currentUser?.role || 'cashier';
  }

  loadBarcodes(): void {
    this.barcodeService.getBarCodes().subscribe({
      next: (data) => {
        this.barcodes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading barcodes:', error);
        this.loading = false;
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCashier(): boolean {
    return this.authService.isCashier();
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingBarcode = null;
    this.barcodeForm = { barCode1: '' };
  }

  showEditForm(barcode: BarCodeDto): void {
    this.showForm = true;
    this.editingBarcode = barcode;
    this.barcodeForm = { barCode1: barcode.barCode1 };
  }

  saveBarcode(): void {
    if (this.editingBarcode) {
      this.barcodeService.updateBarCode(this.editingBarcode.barCodeId, this.barcodeForm).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Barcode updated successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadBarcodes();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Updating Barcode',
            text: 'Failed to update barcode. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    } else {
      this.barcodeService.createBarCode(this.barcodeForm).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Barcode created successfully',
            confirmButtonColor: '#667eea',
            timer: 2000
          });
          this.loadBarcodes();
          this.resetForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error Creating Barcode',
            text: 'Failed to create barcode. Please try again.',
            confirmButtonColor: '#667eea'
          });
        }
      });
    }
  }

  generateBarcode(): void {
    this.barcodeService.generateBarCode(this.generateForm).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Barcode generated successfully',
          confirmButtonColor: '#667eea',
          timer: 2000
        });
        this.loadBarcodes();
        this.generateForm = {};
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Generating Barcode',
          text: 'Failed to generate barcode. Please try again.',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  deleteBarcode(id: number): void {
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
        this.barcodeService.deleteBarCode(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Barcode has been deleted.',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadBarcodes();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete barcode. Please try again.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }

  resetForm(): void {
    this.showForm = false;
    this.editingBarcode = null;
    this.barcodeForm = { barCode1: '' };
  }
}

