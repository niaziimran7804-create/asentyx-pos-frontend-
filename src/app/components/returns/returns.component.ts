import { Component, OnInit } from '@angular/core';
import { ReturnService } from '../../services/return.service';
import { OrderService } from '../../services/order.service';
import { InvoiceService } from '../../services/invoice.service';
import { PurchaseReturnDto, CreatePurchaseReturnDto, UpdateReturnStatusDto, ReturnSummaryDto } from '../../models/return.models';
import { OrderDto } from '../../models/order.models';
import { InvoiceDto } from '../../models/invoice.models';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

interface InvoiceWithDetails extends InvoiceDto {
  products?: Array<{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    remainingQuantity?: number; // For tracking what can still be returned
  }>;
}

interface PartialReturnItem {
  productId: number;
  productName: string;
  orderedQuantity: number;
  returnQuantity: number;
  unitPrice: number;
  returnAmount: number;
  selected: boolean;
}

interface WholeReturnPayload {
  returnType: 'whole';
  invoiceId: number;
  orderId: number;
  returnReason: string;
  refundMethod: string;
  notes?: string;
  totalReturnAmount: number;
}

interface PartialReturnPayload {
  returnType: 'partial';
  invoiceId: number;
  orderId: number;
  returnReason: string;
  refundMethod: string;
  notes?: string;
  items: Array<{
    productId: number;
    returnQuantity: number;
    returnAmount: number;
  }>;
  totalReturnAmount: number;
}

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {
  // Return Lists
  returns: PurchaseReturnDto[] = [];
  summary: ReturnSummaryDto | null = null;
  
  // Loading States
  loading: boolean = false;
  loadingInvoices: boolean = false;
  submittingReturn: boolean = false;

  // Sidebar and Navbar
  isSidebarCollapsed = false;
  sidebarWidth = '280px';
  currentUser: any;
  menuItems: MenuItem[] = [];

  // Return Type Selection
  showReturnTypeSelection: boolean = false;
  selectedReturnType: 'whole' | 'partial' | null = null;

  // Invoice Selection
  invoices: InvoiceWithDetails[] = [];
  filteredInvoices: InvoiceWithDetails[] = [];
  selectedInvoice: InvoiceWithDetails | null = null;
  invoiceSearchTerm: string = '';
  showInvoiceSelection: boolean = false;

  // Whole Bill Return
  showWholeReturnForm: boolean = false;
  wholeReturnReason: string = '';
  wholeReturnRefundMethod: string = 'Cash';
  wholeReturnNotes: string = '';

  // Partial Return
  showPartialReturnForm: boolean = false;
  partialReturnItems: PartialReturnItem[] = [];
  partialReturnReason: string = '';
  partialReturnRefundMethod: string = 'Cash';
  partialReturnNotes: string = '';

  // Return Details Modal
  showDetailsModal: boolean = false;
  selectedReturn: PurchaseReturnDto | null = null;

  // Invoice Products Preview Modal
  showProductsPreviewModal: boolean = false;
  previewInvoice: InvoiceWithDetails | null = null;

  // Filter properties for returns list
  statusFilter: string = 'All';
  searchTerm: string = '';

  constructor(
    private returnService: ReturnService,
    private orderService: OrderService,
    private invoiceService: InvoiceService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.setupMenuItems();
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadReturns();
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
        console.log('📋 Loaded returns from API:', data);
        
        // Map returns and ensure all fields have values
        this.returns = data.map(returnItem => {
          // Handle partial returns with returnedItems array
          if (returnItem.returnType === 'partial' && returnItem.returnedItems && returnItem.returnedItems.length > 0) {
            console.log('📦 Partial return detected:', returnItem.returnId, 'with', returnItem.returnedItems.length, 'items');
            
            // For display purposes, use the first item or aggregate info
            const firstItem = returnItem.returnedItems[0];
            const totalQuantity = returnItem.returnedItems.reduce((sum, item) => sum + item.returnQuantity, 0);
            const itemsList = returnItem.returnedItems.map(item => item.productName).join(', ');
            
            return {
              ...returnItem,
              productName: returnItem.returnedItems.length > 1 
                ? `Multiple Items (${returnItem.returnedItems.length})` 
                : firstItem.productName,
              returnQuantity: totalQuantity,
              returnAmount: returnItem.totalReturnAmount || returnItem.returnAmount || 0,
              productId: firstItem.productId
            };
          }
          
          // Handle whole returns or legacy single-product returns
          if (!returnItem.productName || returnItem.returnQuantity === undefined || returnItem.returnAmount === undefined) {
            console.warn('⚠️ Return with missing data:', {
              returnId: returnItem.returnId,
              productName: returnItem.productName,
              returnQuantity: returnItem.returnQuantity,
              returnAmount: returnItem.returnAmount
            });
          }
          
          return {
            ...returnItem,
            productName: returnItem.productName || `Product #${returnItem.productId || 'Unknown'}`,
            returnQuantity: returnItem.returnQuantity ?? 0,
            returnAmount: returnItem.totalReturnAmount || returnItem.returnAmount || 0
          };
        });
        
        console.log('✅ Processed returns:', this.returns);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading returns:', error);
        this.loading = false;
      }
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

  // ===== NEW: RETURN TYPE SELECTION =====
  showReturnOptions(): void {
    this.showReturnTypeSelection = true;
  }

  selectReturnType(type: 'whole' | 'partial'): void {
    this.selectedReturnType = type;
    this.showReturnTypeSelection = false;
    this.loadLast14DaysInvoices();
  }

  cancelReturnTypeSelection(): void {
    this.showReturnTypeSelection = false;
    this.selectedReturnType = null;
  }

  // ===== LOAD INVOICES FROM LAST 14 DAYS =====
  loadLast14DaysInvoices(): void {
    this.loadingInvoices = true;
    const today = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 14);

    // Get all invoices and filter by date
    this.invoiceService.getAllInvoices().subscribe({
      next: (data) => {
        console.log('📋 Loaded invoices from API:', data.length);
        
        // Filter invoices from last 14 days
        const recentInvoices = data.filter(invoice => {
          const invoiceDate = new Date(invoice.invoiceDate);
          return invoiceDate >= fourteenDaysAgo && invoiceDate <= today;
        });

        console.log('📅 Recent invoices (last 14 days):', recentInvoices.length);

        // Fetch full order details for each invoice to get items array
        const orderFetchRequests = recentInvoices.map(invoice => 
          this.orderService.getOrderById(invoice.orderId)
        );

        // Wait for all order details to be fetched
        Promise.all(orderFetchRequests.map(req => req.toPromise()))
          .then(orders => {
            console.log('✅ Fetched full order details for all invoices');
            
            // Map invoices with full order details including items
            this.invoices = recentInvoices.map((invoice, index) => {
              const fullOrder = orders[index];
              console.log(`Order ${fullOrder?.orderId} has ${fullOrder?.items?.length || 0} items`);
              
              return {
                ...invoice,
                order: fullOrder || invoice.order, // Use full order with items
                products: this.extractProductsFromInvoice({
                  ...invoice,
                  order: fullOrder || invoice.order
                })
              };
            });

            console.log('📦 Processed invoices with products:', this.invoices);
            this.filteredInvoices = [...this.invoices];
            this.loadingInvoices = false;
            this.showInvoiceSelection = true;
          })
          .catch(error => {
            console.error('❌ Error fetching order details:', error);
            // Fallback: use invoices without full order details
            this.invoices = recentInvoices.map(invoice => ({
              ...invoice,
              products: this.extractProductsFromInvoice(invoice)
            }));
            this.filteredInvoices = [...this.invoices];
            this.loadingInvoices = false;
            this.showInvoiceSelection = true;
          });
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load invoices',
          confirmButtonColor: '#667eea'
        });
        this.loadingInvoices = false;
      }
    });
  }

  // Extract products from invoice/order
  extractProductsFromInvoice(invoice: InvoiceDto): any[] {
    console.log('🔍 Extracting products from invoice:', invoice.invoiceId);
    console.log('Full invoice object:', invoice);
    console.log('Order data:', invoice.order);
    
    if (!invoice.order) {
      console.warn('⚠️ No order data found for invoice', invoice.invoiceId);
      return [];
    }

    // Check if order has items array (multi-product order)
    if (invoice.order.items && Array.isArray(invoice.order.items) && invoice.order.items.length > 0) {
      console.log('✅ Multi-product order detected, items count:', invoice.order.items.length);
      console.log('Items data:', invoice.order.items);
      
      const products = invoice.order.items.map((item, index) => {
        console.log(`Processing item ${index + 1}:`, item);
        return {
          productId: item.productId,
          productName: item.productName || `Product ${item.productId}`,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice || (item.unitPrice * item.quantity),
          remainingQuantity: item.quantity
        };
      });
      
      console.log('✅ Extracted products:', products);
      return products;
    }

    // Fallback for single-product order (legacy structure)
    console.log('📦 Single-product order (legacy structure) - using fallback');
    console.log('Order details:', {
      productId: invoice.order.productId,
      productName: invoice.order.productName,
      orderQuantity: invoice.order.orderQuantity,
      totalAmount: invoice.order.totalAmount,
      productMSRP: invoice.order.productMSRP
    });
    
    // Calculate actual unit price from total amount
    const actualUnitPrice = invoice.order.orderQuantity > 0 
      ? invoice.order.totalAmount / invoice.order.orderQuantity 
      : invoice.order.productMSRP;

    console.log('Calculated unit price:', actualUnitPrice);

    const product = {
      productId: invoice.order.productId,
      productName: invoice.order.productName || `Product ${invoice.order.productId}`,
      quantity: invoice.order.orderQuantity || 1,
      unitPrice: actualUnitPrice,
      totalPrice: invoice.order.totalAmount || 0,
      remainingQuantity: invoice.order.orderQuantity || 1
    };
    
    console.log('Extracted product:', product);
    return [product];
  }

  // ===== INVOICE SEARCH =====
  searchInvoices(): void {
    const term = this.invoiceSearchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredInvoices = [...this.invoices];
      return;
    }

    this.filteredInvoices = this.invoices.filter(invoice => {
      const invoiceNumber = invoice.invoiceNumber?.toLowerCase() || '';
      const customerName = invoice.order?.customerFullName?.toLowerCase() || '';
      const invoiceId = invoice.invoiceId.toString();
      
      return invoiceNumber.includes(term) || 
             customerName.includes(term) ||
             invoiceId.includes(term);
    });
  }

  // ===== SELECT INVOICE FOR RETURN =====
  selectInvoiceForReturn(invoice: InvoiceWithDetails): void {
    this.selectedInvoice = invoice;
    this.showInvoiceSelection = false;

    if (this.selectedReturnType === 'whole') {
      this.initializeWholeReturn();
    } else if (this.selectedReturnType === 'partial') {
      this.initializePartialReturn();
    }
  }

  // ===== SHOW INVOICE PRODUCTS PREVIEW =====
  showInvoiceProducts(invoice: InvoiceWithDetails): void {
    this.previewInvoice = invoice;
    this.showProductsPreviewModal = true;
  }

  closeProductsPreview(): void {
    this.showProductsPreviewModal = false;
    this.previewInvoice = null;
  }

  backToInvoiceSelection(): void {
    this.selectedInvoice = null;
    this.showInvoiceSelection = true;
    this.showWholeReturnForm = false;
    this.showPartialReturnForm = false;
    this.resetReturnForms();
  }

  backToReturnTypeSelection(): void {
    this.selectedInvoice = null;
    this.selectedReturnType = null;
    this.showInvoiceSelection = false;
    this.showWholeReturnForm = false;
    this.showPartialReturnForm = false;
    this.showReturnTypeSelection = true;
    this.resetReturnForms();
  }

  // ===== WHOLE BILL RETURN =====
  initializeWholeReturn(): void {
    this.showWholeReturnForm = true;
    this.wholeReturnReason = '';
    this.wholeReturnRefundMethod = 'Cash';
    this.wholeReturnNotes = '';
  }

  calculateWholeReturnAmount(): number {
    return this.selectedInvoice?.order?.totalAmount || 0;
  }

  submitWholeReturn(): void {
    if (!this.wholeReturnReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please provide a reason for the return',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (this.wholeReturnReason.trim().length < 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Return Reason',
        text: 'Return reason must be at least 5 characters long',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (!this.selectedInvoice) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No invoice selected',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    const totalAmount = this.calculateWholeReturnAmount();

    const payload: WholeReturnPayload = {
      returnType: 'whole',
      invoiceId: this.selectedInvoice.invoiceId,
      orderId: this.selectedInvoice.orderId,
      returnReason: this.wholeReturnReason,
      refundMethod: this.wholeReturnRefundMethod,
      notes: this.wholeReturnNotes,
      totalReturnAmount: totalAmount
    };

    console.log('Whole Return Payload:', payload);
    
    // Debug: Check authentication
    const token = this.authService.getToken();
    const currentUser = this.authService.getCurrentUser();
    console.log('Auth Status - Token exists:', !!token, 'User:', currentUser?.email, 'Role:', currentUser?.role);
    
    this.submittingReturn = true;

    // Call backend API for whole return
    this.returnService.createWholeReturn(payload).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Return Created!',
          text: `Whole bill return processed successfully. Return ID: ${response.returnId}`,
          confirmButtonColor: '#667eea',
          timer: 3000
        });
        this.resetReturnProcess();
        this.loadReturns();
        this.loadSummary();
        this.submittingReturn = false;
      },
      error: (error) => {
        console.error('Error creating whole return:', error);
        this.handleReturnError(error);
        this.submittingReturn = false;
      }
    });
  }

  // ===== PARTIAL RETURN =====
  initializePartialReturn(): void {
    console.log('🔄 Initializing partial return for invoice:', this.selectedInvoice?.invoiceId);
    console.log('Invoice products:', this.selectedInvoice?.products);
    
    this.showPartialReturnForm = true;
    this.partialReturnReason = '';
    this.partialReturnRefundMethod = 'Cash';
    this.partialReturnNotes = '';

    // Initialize partial return items from invoice products
    this.partialReturnItems = (this.selectedInvoice?.products || []).map(product => {
      console.log('Creating partial return item for product:', product);
      const item = {
        productId: product.productId,
        productName: product.productName,
        orderedQuantity: product.quantity,
        returnQuantity: 0,
        unitPrice: product.unitPrice,
        returnAmount: 0,
        selected: false
      };
      console.log('Created item:', item);
      return item;
    });
    
    console.log('All partial return items:', this.partialReturnItems);
  }

  togglePartialItem(item: PartialReturnItem): void {
    item.selected = !item.selected;
    if (!item.selected) {
      item.returnQuantity = 0;
      item.returnAmount = 0;
    } else {
      item.returnQuantity = 1;
      this.calculatePartialItemAmount(item);
    }
  }

  onPartialQuantityChange(item: PartialReturnItem): void {
    if (item.returnQuantity > item.orderedQuantity) {
      item.returnQuantity = item.orderedQuantity;
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Quantity',
        text: `Cannot return more than ordered quantity (${item.orderedQuantity})`,
        confirmButtonColor: '#667eea',
        timer: 2000
      });
    }

    if (item.returnQuantity < 0) {
      item.returnQuantity = 0;
    }

    this.calculatePartialItemAmount(item);
  }

  calculatePartialItemAmount(item: PartialReturnItem): void {
    item.returnAmount = Math.round(item.unitPrice * item.returnQuantity * 100) / 100;
  }

  calculatePartialReturnTotal(): number {
    return this.partialReturnItems
      .filter(item => item.selected && item.returnQuantity > 0)
      .reduce((total, item) => total + item.returnAmount, 0);
  }

  getSelectedPartialItemsCount(): number {
    return this.partialReturnItems.filter(item => item.selected && item.returnQuantity > 0).length;
  }

  submitPartialReturn(): void {
    if (!this.partialReturnReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please provide a reason for the return',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (this.partialReturnReason.trim().length < 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Return Reason',
        text: 'Return reason must be at least 5 characters long',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    const selectedItems = this.partialReturnItems.filter(item => item.selected && item.returnQuantity > 0);

    if (selectedItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Items Selected',
        text: 'Please select at least one product to return',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (!this.selectedInvoice) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No invoice selected',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    const totalAmount = this.calculatePartialReturnTotal();

    const payload: PartialReturnPayload = {
      returnType: 'partial',
      invoiceId: this.selectedInvoice.invoiceId,
      orderId: this.selectedInvoice.orderId,
      returnReason: this.partialReturnReason,
      refundMethod: this.partialReturnRefundMethod,
      notes: this.partialReturnNotes,
      items: selectedItems.map(item => ({
        productId: item.productId,
        returnQuantity: item.returnQuantity,
        returnAmount: item.returnAmount
      })),
      totalReturnAmount: totalAmount
    };

    console.log('📦 Partial Return Payload:', payload);
    console.log('📊 Item details:');
    selectedItems.forEach(item => {
      console.log(`  Product ${item.productId}:`);
      console.log(`    - Unit Price: ${item.unitPrice}`);
      console.log(`    - Return Quantity: ${item.returnQuantity}`);
      console.log(`    - Calculated Amount (unitPrice × quantity): ${item.unitPrice * item.returnQuantity}`);
      console.log(`    - Sending Return Amount: ${item.returnAmount}`);
      console.log(`    - Match: ${item.returnAmount === (item.unitPrice * item.returnQuantity)}`);
    });
    
    // Debug: Check authentication
    const token = this.authService.getToken();
    const currentUser = this.authService.getCurrentUser();
    console.log('Auth Status - Token exists:', !!token, 'User:', currentUser?.email, 'Role:', currentUser?.role);
    
    this.submittingReturn = true;

    // Call backend API for partial return
    this.returnService.createPartialReturn(payload).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Return Created!',
          text: `Partial return processed. ${selectedItems.length} item(s) returned. Return ID: ${response.returnId}`,
          confirmButtonColor: '#667eea',
          timer: 3000
        });
        this.resetReturnProcess();
        this.loadReturns();
        this.loadSummary();
        this.submittingReturn = false;
      },
      error: (error) => {
        console.error('Error creating partial return:', error);
        console.error('📋 Full error response:', error.error);
        console.error('📋 Error message:', error.error?.error || error.message);
        console.error('📋 Error details:', error.error?.details);
        this.handleReturnError(error);
        this.submittingReturn = false;
      }
    });
  }

  // ===== RESET & CLEANUP =====
  resetReturnForms(): void {
    this.wholeReturnReason = '';
    this.wholeReturnRefundMethod = 'Cash';
    this.wholeReturnNotes = '';
    this.partialReturnReason = '';
    this.partialReturnRefundMethod = 'Cash';
    this.partialReturnNotes = '';
    this.partialReturnItems = [];
    this.invoiceSearchTerm = '';
  }

  resetReturnProcess(): void {
    this.selectedReturnType = null;
    this.selectedInvoice = null;
    this.showReturnTypeSelection = false;
    this.showInvoiceSelection = false;
    this.showWholeReturnForm = false;
    this.showPartialReturnForm = false;
    this.resetReturnForms();
  }

  cancelReturn(): void {
    Swal.fire({
      title: 'Cancel Return?',
      text: 'All entered information will be lost',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#667eea',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'Continue Return'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetReturnProcess();
      }
    });
  }

  // ===== ERROR HANDLING =====
  handleReturnError(error: any): void {
    console.error('Return error details:', error);
    
    // Handle 401 Unauthorized
    if (error.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        html: `Your session may have expired or you don't have permission to perform this action.<br/><br/>
               <strong>Status:</strong> ${error.status} ${error.statusText}<br/>
               <strong>URL:</strong> ${error.url}<br/><br/>
               Please try logging out and logging back in.`,
        confirmButtonColor: '#667eea',
        confirmButtonText: 'Understood',
        footer: '<a href="/login">Go to Login Page</a>'
      });
      return;
    }
    
    // Handle 403 Forbidden
    if (error.status === 403) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'You do not have permission to perform this action. Please contact an administrator.',
        confirmButtonColor: '#667eea'
      });
      return;
    }
    
    const errorMessage = error.error?.message || error.error?.title || 'Failed to process return';
    
    if (errorMessage.includes('quantity cannot exceed')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Quantity',
        text: errorMessage,
        confirmButtonColor: '#667eea',
        timer: 5000
      });
    } else if (errorMessage.includes('not found')) {
      Swal.fire({
        icon: 'error',
        title: 'Not Found',
        text: errorMessage,
        confirmButtonColor: '#667eea'
      });
    } else if (errorMessage.includes('already returned')) {
      Swal.fire({
        icon: 'error',
        title: 'Already Returned',
        text: errorMessage,
        confirmButtonColor: '#667eea',
        timer: 5000
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: `<strong>Message:</strong> ${errorMessage}<br/>
               <strong>Status:</strong> ${error.status || 'Unknown'}<br/>
               ${error.error?.errors ? '<br/><strong>Validation Errors:</strong><br/>' + JSON.stringify(error.error.errors) : ''}`,
        confirmButtonColor: '#667eea'
      });
    }
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

  // Old resetForm method removed - now using resetReturnProcess() and resetReturnForms()

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
