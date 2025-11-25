import { Component, OnInit } from '@angular/core';
import { ReturnService } from '../../services/return.service';
import { OrderService } from '../../services/order.service';
import { PurchaseReturnDto, CreatePurchaseReturnDto, UpdateReturnStatusDto, ReturnSummaryDto } from '../../models/return.models';
import { OrderDto } from '../../models/order.models';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {
  returns: PurchaseReturnDto[] = [];
  orders: OrderDto[] = [];
  summary: ReturnSummaryDto | null = null;
  showForm: boolean = false;
  showDetailsModal: boolean = false;
  selectedReturn: PurchaseReturnDto | null = null;
  loading: boolean = false;

  // Sidebar and Navbar properties
  isSidebarCollapsed = false;
  sidebarWidth = '280px';
  currentUser: any;
  menuItems: MenuItem[] = [];

  // Filter properties
  statusFilter: string = 'All';
  searchTerm: string = '';

  // Form
  returnForm: CreatePurchaseReturnDto = {
    orderId: 0,
    productId: 0,
    returnQuantity: 1,
    returnAmount: 0,
    returnReason: '',
    refundMethod: 'Cash',
    notes: ''
  };

  selectedOrder: OrderDto | null = null;

  constructor(
    private returnService: ReturnService,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.setupMenuItems();
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadReturns();
    this.loadOrders();
    this.loadSummary();
    this.currentUser = {
      name: localStorage.getItem('userName') || 'User',
      role: localStorage.getItem('userRole') || 'cashier'
    };
  }

  setupMenuItems(): void {
    this.menuItems = [
      { label: 'Dashboard', icon: 'fas fa-chart-line', route: '/dashboard' },
      { label: 'Products', icon: 'fas fa-box', route: '/products' },
      { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
      { label: 'Returns', icon: 'fas fa-undo', route: '/returns' },
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

  onSidebarCollapse(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
    this.sidebarWidth = collapsed ? '80px' : '280px';
  }

  getUserRole(): string {
    return this.currentUser?.role || 'cashier';
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isCashier(): boolean {
    return this.authService.isCashier();
  }

  loadReturns(): void {
    this.loading = true;
    this.returnService.getAllReturns().subscribe({
      next: (data) => {
        this.returns = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading returns:', error);
        this.loading = false;
      }
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        // Only show paid orders for returns
        this.orders = data.filter(order => order.status === 'Paid');
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  loadSummary(): void {
    this.returnService.getReturnSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (error) => console.error('Error loading summary:', error)
    });
  }

  get filteredReturns(): PurchaseReturnDto[] {
    let filtered = this.returns;

    // Filter by status
    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(r => r.returnStatus === this.statusFilter);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.customerFullName?.toLowerCase().includes(term) ||
        r.productName?.toLowerCase().includes(term) ||
        r.returnId.toString().includes(term)
      );
    }

    return filtered;
  }

  onOrderSelect(): void {
    const order = this.orders.find(o => o.orderId === this.returnForm.orderId);
    if (order) {
      this.selectedOrder = order;
      this.returnForm.productId = order.productId;
      this.returnForm.returnAmount = order.totalAmount;
    }
  }

  calculateReturnAmount(): void {
    if (this.selectedOrder && this.returnForm.returnQuantity > 0) {
      const unitPrice = this.selectedOrder.totalAmount / this.selectedOrder.orderQuantity;
      this.returnForm.returnAmount = unitPrice * this.returnForm.returnQuantity;
    }
  }

  createReturn(): void {
    if (!this.returnForm.orderId || !this.returnForm.returnReason) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (this.selectedOrder && this.returnForm.returnQuantity > this.selectedOrder.orderQuantity) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Quantity',
        text: 'Return quantity cannot exceed order quantity',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    this.returnService.createReturn(this.returnForm).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Return Created!',
          text: 'Purchase return has been submitted successfully',
          confirmButtonColor: '#667eea',
          timer: 2000
        });
        this.loadReturns();
        this.loadSummary();
        this.resetForm();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Creating Return',
          text: error.error?.message || 'Failed to create return. Please try again.',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  updateReturnStatus(returnItem: PurchaseReturnDto, newStatus: string): void {
    if (!this.isAdmin()) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Only administrators can update return status',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    const statusDto: UpdateReturnStatusDto = {
      returnStatus: newStatus as any
    };

    this.returnService.updateReturnStatus(returnItem.returnId, statusDto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Status Updated!',
          text: `Return status changed to ${newStatus}`,
          confirmButtonColor: '#667eea',
          timer: 2000
        });
        this.loadReturns();
        this.loadSummary();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update return status',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  showReturnDetails(returnItem: PurchaseReturnDto): void {
    this.selectedReturn = returnItem;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedReturn = null;
  }

  approveReturn(returnItem: PurchaseReturnDto): void {
    Swal.fire({
      title: 'Approve Return?',
      text: `Approve return for ${returnItem.customerFullName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#48bb78',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateReturnStatus(returnItem, 'Approved');
      }
    });
  }

  rejectReturn(returnItem: PurchaseReturnDto): void {
    Swal.fire({
      title: 'Reject Return?',
      text: `Reject return for ${returnItem.customerFullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f56565',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateReturnStatus(returnItem, 'Rejected');
      }
    });
  }

  completeReturn(returnItem: PurchaseReturnDto): void {
    Swal.fire({
      title: 'Complete Return?',
      text: `Mark return as completed and process refund?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, complete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateReturnStatus(returnItem, 'Completed');
      }
    });
  }

  deleteReturn(id: number): void {
    if (!this.isAdmin()) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Only administrators can delete returns',
        confirmButtonColor: '#667eea'
      });
      return;
    }

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
        this.returnService.deleteReturn(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Return has been deleted.',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadReturns();
            this.loadSummary();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete return. Please try again.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }

  resetForm(): void {
    this.showForm = false;
    this.selectedOrder = null;
    this.returnForm = {
      orderId: 0,
      productId: 0,
      returnQuantity: 1,
      returnAmount: 0,
      returnReason: '',
      refundMethod: 'Cash',
      notes: ''
    };
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning';
      case 'Approved': return 'bg-info';
      case 'Completed': return 'bg-success';
      case 'Rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
}
