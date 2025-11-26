import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { InvoiceService } from '../../services/invoice.service';
import { OrderDto, CreateOrderDto, OrderItemDto, UpdateOrderStatusDto, CustomerSearchDto, BulkUpdateOrderStatusDto } from '../../models/order.models';
import { ProductDto } from '../../models/product.models';
import { AuthService } from '../../services/auth.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: OrderDto[] = [];
  products: ProductDto[] = [];
  showForm: boolean = false;
  orderForm: CreateOrderDto = {
    userId: 0,
    orderQuantity: 1,
    productId: 0,
    productMSRP: 0,
    paymentMethod: 'Cash',
    customerFullName: '',
    customerPhone: '',
    customerAddress: '',
    customerEmail: '',
    items: []
  };
  selectedProduct: ProductDto | null = null;
  cartItems: OrderItemDto[] = [];
  showCustomerForm: boolean = false;
  orderPaymentStatus: 'Pending' | 'Paid' = 'Pending'; // Payment status for new orders
  
  // Customer search
  customerSearchTerm: string = '';
  customerSearchResults: CustomerSearchDto[] = [];
  showCustomerSearchResults: boolean = false;
  private searchSubject = new Subject<string>();
  
  // Order update (for salesman)
  showUpdateForm: boolean = false;
  selectedOrderForUpdate: OrderDto | null = null;
  updateStatusDto: UpdateOrderStatusDto = {
    status: 'Pending',
    orderStatus: 'Pending'
  };

  // Filter and bulk operations
  statusFilter: string = 'All'; // 'All', 'Pending', 'Paid'
  selectedOrderIds: Set<number> = new Set();
  showBulkActions: boolean = false;
  expandedOrderIds: Set<number> = new Set(); // Track expanded multi-product orders

  // Sidebar and Navbar properties
  isSidebarCollapsed = false;
  sidebarWidth = '280px';
  currentUser: any;
  loading: boolean = false;
  menuItems: any[] = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/dashboard' },
    { label: 'Products', icon: 'fas fa-box', route: '/products' },
    { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
    { label: 'Returns', icon: 'fas fa-undo', route: '/returns' },
    { label: 'Categories', icon: 'fas fa-th-large', route: '/categories' },
    { label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' },
    { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' },
    { label: 'Accounting', icon: 'fas fa-calculator', route: '/accounting' },
    { label: 'Customer Balance', icon: 'fas fa-users-cog', route: '/customer-balance' },
    { label: 'Expenses', icon: 'fas fa-wallet', route: '/expenses' },
    { label: 'Users', icon: 'fas fa-users', route: '/users' }
  ];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private authService: AuthService
  ) {
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm && searchTerm.length >= 2) {
        this.searchCustomers(searchTerm);
      } else {
        this.customerSearchResults = [];
        this.showCustomerSearchResults = false;
      }
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadOrders();
    this.loadProducts();
    const user = this.authService.getCurrentUser();
    if (user) {
      this.orderForm.userId = user.id;
    }
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

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products = data,
      error: (error) => console.error('Error loading products:', error)
    });
  }

  selectProduct(product: ProductDto): void {
    // Prevent selection of out-of-stock products
    if (product.productUnitStock === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Out of Stock',
        text: `${product.productName} is currently out of stock`,
        confirmButtonColor: '#667eea'
      });
      return;
    }
    
    this.selectedProduct = product;
    this.orderForm.productId = product.productId;
    this.orderForm.productMSRP = product.productMSRP;
  }

  addToCart(): void {
    if (this.selectedProduct && this.orderForm.orderQuantity > 0) {
      // Calculate total quantity in cart for this product
      const existingItem = this.cartItems.find(item => item.productId === this.selectedProduct!.productId);
      const currentCartQuantity = existingItem ? existingItem.quantity : 0;
      const totalRequestedQuantity = currentCartQuantity + this.orderForm.orderQuantity;
      
      // Check if requested quantity exceeds available stock
      if (totalRequestedQuantity > this.selectedProduct.productUnitStock) {
        Swal.fire({
          icon: 'error',
          title: 'Insufficient Stock',
          html: `Cannot add ${this.orderForm.orderQuantity} units.<br/>
                 Available stock: <strong>${this.selectedProduct.productUnitStock}</strong><br/>
                 Already in cart: <strong>${currentCartQuantity}</strong><br/>
                 Maximum you can add: <strong>${this.selectedProduct.productUnitStock - currentCartQuantity}</strong>`,
          confirmButtonColor: '#667eea'
        });
        return;
      }
      
      if (existingItem) {
        // Update quantity of existing item
        existingItem.quantity += this.orderForm.orderQuantity;
        
        Swal.fire({
          icon: 'info',
          title: 'Cart Updated',
          text: `Quantity updated for ${this.selectedProduct.productName}`,
          confirmButtonColor: '#667eea',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // Add new item to cart
        const item: OrderItemDto = {
          productId: this.selectedProduct.productId,
          quantity: this.orderForm.orderQuantity,
          unitPrice: this.selectedProduct.productPerUnitPrice
        };
        this.cartItems.push(item);
        
        Swal.fire({
          icon: 'success',
          title: 'Added to Cart',
          text: `${this.selectedProduct.productName} added to cart`,
          confirmButtonColor: '#667eea',
          timer: 1500,
          showConfirmButton: false
        });
      }
      
      this.selectedProduct = null;
      this.orderForm.orderQuantity = 1;
    }
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
  }

  createOrder(): void {
    if (this.cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'Please add items to cart',
        confirmButtonColor: '#667eea'
      });
      return;
    }
    
    if (!this.orderForm.customerFullName || this.orderForm.customerFullName.trim().length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Customer Information Required',
        text: 'Please enter customer information before completing the order',
        confirmButtonColor: '#667eea'
      });
      this.showCustomerForm = true;
      return;
    }

    this.orderForm.items = this.cartItems;
    
    // Set orderQuantity to total quantity of all items in cart
    this.orderForm.orderQuantity = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Set payment amounts based on payment status
    const totalAmount = this.getTotalAmount();
    if (this.orderPaymentStatus === 'Paid') {
      this.orderForm.paidAmount = totalAmount;
      this.orderForm.remainingAmount = 0;
    } else {
      this.orderForm.paidAmount = 0;
      this.orderForm.remainingAmount = totalAmount;
    }
    
    // If single item order, use that item's details
    if (this.cartItems.length === 1) {
      this.orderForm.productId = this.cartItems[0].productId;
      this.orderForm.productMSRP = this.cartItems[0].unitPrice;
    }
    
    this.orderService.createOrder(this.orderForm).subscribe({
      next: (order) => {
        // If payment status is set to "Paid", mark the order as paid immediately
        if (this.orderPaymentStatus === 'Paid' && order.orderId) {
          const updateDto: UpdateOrderStatusDto = {
            status: 'Paid',
            orderStatus: 'Paid'
          };
          this.orderService.updateOrderStatus(order.orderId, updateDto).subscribe({
            next: () => {
              this.showOrderCreatedDialog(order);
            },
            error: (error) => {
              // Even if status update fails, order was created successfully
              console.error('Error updating order status:', error);
              this.showOrderCreatedDialog(order);
            }
          });
        } else {
          this.showOrderCreatedDialog(order);
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Creating Order',
          text: 'Error creating order. Please try again.',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  private showOrderCreatedDialog(order: any): void {
    // Ask if user wants to print receipt
    Swal.fire({
      icon: 'success',
      title: 'Order Created Successfully!',
      text: `Order has been marked as ${this.orderPaymentStatus}. Do you want to print the receipt?`,
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, print receipt!',
      cancelButtonText: 'No, thanks'
    }).then((result) => {
      if (result.isConfirmed && order.invoiceId) {
        // Small delay to ensure invoice is fully created
        setTimeout(() => {
          this.invoiceService.openInvoicePrintWindow(order.invoiceId!);
        }, 300);
      }
    });
    
    this.loadOrders();
    this.loadProducts(); // Refresh product list to show updated stock quantities
    this.resetForm();
  }

  resetForm(): void {
    this.showForm = false;
    this.showCustomerForm = false;
    this.cartItems = [];
    this.selectedProduct = null;
    this.orderPaymentStatus = 'Pending'; // Reset payment status to default
    const user = this.authService.getCurrentUser();
    this.orderForm = {
      userId: user?.id || 0,
      orderQuantity: 1,
      productId: 0,
      productMSRP: 0,
      paymentMethod: 'Cash',
      customerFullName: '',
      customerPhone: '',
      customerAddress: '',
      customerEmail: '',
      items: []
    };
  }

  toggleCustomerForm(): void {
    this.showCustomerForm = !this.showCustomerForm;
  }

  canCompleteOrder(): boolean {
    return this.cartItems.length > 0 && 
           !!this.orderForm.customerFullName && 
           this.orderForm.customerFullName.trim().length > 0;
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.productId === productId);
    return product ? product.productName : 'Unknown';
  }

  // Customer search functionality
  onCustomerSearchChange(): void {
    this.searchSubject.next(this.customerSearchTerm);
  }

  searchCustomers(searchTerm: string): void {
    this.orderService.searchCustomers(searchTerm).subscribe({
      next: (results) => {
        this.customerSearchResults = results;
        this.showCustomerSearchResults = results.length > 0;
      },
      error: (error) => {
        console.error('Error searching customers:', error);
        this.customerSearchResults = [];
        this.showCustomerSearchResults = false;
      }
    });
  }

  selectCustomer(customer: CustomerSearchDto): void {
    this.orderForm.customerFullName = customer.customerFullName;
    this.orderForm.customerPhone = customer.customerPhone || '';
    this.orderForm.customerEmail = customer.customerEmail || '';
    this.orderForm.customerAddress = customer.customerAddress || '';
    this.customerSearchTerm = customer.customerFullName;
    this.showCustomerSearchResults = false;
    this.showCustomerForm = true;
  }

  clearCustomerSearch(): void {
    this.customerSearchTerm = '';
    this.customerSearchResults = [];
    this.showCustomerSearchResults = false;
  }

  // Order update functionality (for salesman and admin)
  isSalesman(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'Salesman';
  }

  canUpdateOrderStatus(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'Salesman' || user?.role === 'Admin';
  }

  showUpdateOrderForm(order: OrderDto): void {
    this.selectedOrderForUpdate = order;
    this.updateStatusDto = {
      status: order.status,
      orderStatus: order.orderStatus
    };
    this.showUpdateForm = true;
  }

  updateOrderStatus(): void {
    if (!this.selectedOrderForUpdate) return;

    // Validate status values
    if (this.updateStatusDto.status !== 'Paid' && this.updateStatusDto.status !== 'Pending' && this.updateStatusDto.status !== 'Cancelled') {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Status',
        text: 'Status must be either "Paid", "Pending", or "Cancelled"',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (this.updateStatusDto.orderStatus !== 'Paid' && this.updateStatusDto.orderStatus !== 'Pending' && this.updateStatusDto.orderStatus !== 'Cancelled') {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Order Status',
        text: 'Order Status must be either "Paid", "Pending", or "Cancelled"',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    this.orderService.updateOrderStatus(this.selectedOrderForUpdate.orderId, this.updateStatusDto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Order status updated successfully!',
          confirmButtonColor: '#667eea',
          timer: 2000
        });
        this.loadOrders();
        this.cancelUpdate();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error updating order status. Please try again.',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }

  cancelUpdate(): void {
    this.showUpdateForm = false;
    this.selectedOrderForUpdate = null;
    this.updateStatusDto = {
      status: 'Pending',
      orderStatus: 'Pending'
    };
  }

  // Filter orders
  get filteredOrders(): OrderDto[] {
    if (this.statusFilter === 'All') {
      return this.orders;
    }
    return this.orders.filter(order => order.status === this.statusFilter);
  }

  get pendingOrdersCount(): number {
    return this.orders.filter(o => o.status === 'Pending').length;
  }

  get paidOrdersCount(): number {
    return this.orders.filter(o => o.status === 'Paid').length;
  }

  // Quick mark as paid
  quickMarkAsPaid(order: OrderDto): void {
    Swal.fire({
      title: 'Mark as Paid?',
      text: `Mark Order #${order.orderId} as Paid?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark as paid!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updateDto: UpdateOrderStatusDto = {
          status: 'Paid',
          orderStatus: 'Paid'
        };
        this.orderService.updateOrderStatus(order.orderId, updateDto).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Order marked as Paid!',
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadOrders();
            this.selectedOrderIds.delete(order.orderId);
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error updating order status.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }

  // Bulk selection
  toggleOrderSelection(orderId: number): void {
    if (this.selectedOrderIds.has(orderId)) {
      this.selectedOrderIds.delete(orderId);
    } else {
      this.selectedOrderIds.add(orderId);
    }
    this.showBulkActions = this.selectedOrderIds.size > 0;
  }

  toggleSelectAll(): void {
    const filtered = this.filteredOrders;
    if (this.selectedOrderIds.size === filtered.length) {
      this.selectedOrderIds.clear();
    } else {
      filtered.forEach(order => this.selectedOrderIds.add(order.orderId));
    }
    this.showBulkActions = this.selectedOrderIds.size > 0;
  }

  isOrderSelected(orderId: number): boolean {
    return this.selectedOrderIds.has(orderId);
  }

  get selectedOrdersCount(): number {
    return this.selectedOrderIds.size;
  }

  // Bulk update
  bulkMarkAsPaid(): void {
    if (this.selectedOrderIds.size === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Orders Selected',
        text: 'Please select at least one order',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    Swal.fire({
      title: 'Mark Orders as Paid?',
      text: `Mark ${this.selectedOrderIds.size} order(s) as Paid?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark as paid!'
    }).then((result) => {
      if (result.isConfirmed) {
        const bulkUpdateDto: BulkUpdateOrderStatusDto = {
          orderIds: Array.from(this.selectedOrderIds),
          status: 'Paid',
          orderStatus: 'Paid'
        };

        this.orderService.bulkUpdateOrderStatus(bulkUpdateDto).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: `${response.updatedCount || this.selectedOrderIds.size} order(s) marked as Paid!`,
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadOrders();
            this.selectedOrderIds.clear();
            this.showBulkActions = false;
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error updating orders. Please try again.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }

  bulkMarkAsPending(): void {
    if (this.selectedOrderIds.size === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Orders Selected',
        text: 'Please select at least one order',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    Swal.fire({
      title: 'Mark Orders as Pending?',
      text: `Mark ${this.selectedOrderIds.size} order(s) as Pending?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark as pending!'
    }).then((result) => {
      if (result.isConfirmed) {
        const bulkUpdateDto: BulkUpdateOrderStatusDto = {
          orderIds: Array.from(this.selectedOrderIds),
          status: 'Pending',
          orderStatus: 'Pending'
        };

        this.orderService.bulkUpdateOrderStatus(bulkUpdateDto).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: `${response.updatedCount || this.selectedOrderIds.size} order(s) marked as Pending!`,
              confirmButtonColor: '#667eea',
              timer: 2000
            });
            this.loadOrders();
            this.selectedOrderIds.clear();
            this.showBulkActions = false;
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error updating orders. Please try again.',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }

  clearSelection(): void {
    this.selectedOrderIds.clear();
    this.showBulkActions = false;
  }

  // Multi-product order display helpers
  toggleOrderDetails(orderId: number): void {
    if (this.expandedOrderIds.has(orderId)) {
      this.expandedOrderIds.delete(orderId);
    } else {
      this.expandedOrderIds.add(orderId);
    }
  }

  isOrderExpanded(orderId: number): boolean {
    return this.expandedOrderIds.has(orderId);
  }

  // View Invoice Details
  viewInvoice(order: OrderDto): void {
    if (!order.invoiceId) {
      Swal.fire({
        icon: 'warning',
        title: 'No Invoice',
        text: 'This order does not have an associated invoice yet.',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    this.invoiceService.getInvoiceById(order.invoiceId).subscribe({
      next: (invoice) => {
        const productsList = order.items && order.items.length > 0
          ? order.items.map(item => `
              <tr>
                <td style="text-align: left; padding: 8px; border: 1px solid #ddd;">${item.productName || 'Product #' + item.productId}</td>
                <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">$${item.unitPrice}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">$${(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            `).join('')
          : `
            <tr>
              <td style="text-align: left; padding: 8px; border: 1px solid #ddd;">${order.productName || 'N/A'}</td>
              <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${order.orderQuantity}</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">$${order.productMSRP}</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">$${order.totalAmount}</td>
            </tr>
          `;

        Swal.fire({
          title: `<i class="fas fa-file-invoice text-primary"></i> Invoice #${invoice.invoiceNumber}`,
          html: `
            <div style="text-align: left; padding: 20px;">
              <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h5 style="margin: 0 0 10px 0; color: #667eea;"><i class="fas fa-receipt"></i> Order Information</h5>
                <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order.orderId}</p>
                <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                <p style="margin: 5px 0;"><strong>Payment Method:</strong> <span class="badge bg-info">${order.paymentMethod}</span></p>
                <p style="margin: 5px 0;"><strong>Status:</strong> <span class="badge ${order.status === 'Paid' ? 'bg-success' : order.status === 'Pending' ? 'bg-warning' : 'bg-secondary'}">${order.status}</span></p>
              </div>

              <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h5 style="margin: 0 0 10px 0; color: #667eea;"><i class="fas fa-user"></i> Customer Information</h5>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${invoice.order.customerFullName || invoice.order.customerName || 'N/A'}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${invoice.order.customerPhone || 'N/A'}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${invoice.order.customerEmail || 'N/A'}</p>
                <p style="margin: 5px 0;"><strong>Address:</strong> ${invoice.order.customerAddress || 'N/A'}</p>
              </div>

              <div style="margin-bottom: 20px;">
                <h5 style="margin: 0 0 10px 0; color: #667eea;"><i class="fas fa-box"></i> Products</h5>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                  <thead style="background: #667eea; color: white;">
                    <tr>
                      <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Product</th>
                      <th style="text-align: center; padding: 10px; border: 1px solid #ddd;">Qty</th>
                      <th style="text-align: right; padding: 10px; border: 1px solid #ddd;">Unit Price</th>
                      <th style="text-align: right; padding: 10px; border: 1px solid #ddd;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${productsList}
                  </tbody>
                </table>
              </div>

              <div style="padding: 15px; background: #e8f5e9; border-radius: 8px; border: 2px solid #4caf50;">
                <h5 style="margin: 0 0 10px 0; color: #2e7d32;"><i class="fas fa-dollar-sign"></i> Invoice Summary</h5>
                <p style="margin: 5px 0;"><strong>Total Amount:</strong> <span style="font-size: 1.2em; color: #4caf50;">$${invoice.totalAmount}</span></p>
                <p style="margin: 5px 0;"><strong>Paid Amount:</strong> $${invoice.amountPaid}</p>
                <p style="margin: 5px 0;"><strong>Remaining:</strong> <span style="color: ${invoice.balance > 0 ? '#f44336' : '#4caf50'};">$${invoice.balance}</span></p>
              </div>
            </div>
          `,
          width: '800px',
          showCloseButton: true,
          showCancelButton: false,
          confirmButtonText: '<i class="fas fa-print me-2"></i>Print Invoice',
          confirmButtonColor: '#667eea',
          customClass: {
            popup: 'swal-wide'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate to invoices page to print
            window.location.href = `/invoices?id=${invoice.invoiceId}`;
          }
        });
      },
      error: (error) => {
        console.error('Error loading invoice:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load invoice details. Please try again.',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }
}
