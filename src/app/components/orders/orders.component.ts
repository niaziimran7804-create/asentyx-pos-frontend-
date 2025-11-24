import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { InvoiceService } from '../../services/invoice.service';
import { OrderDto, CreateOrderDto, OrderItemDto, UpdateOrderStatusDto, CustomerSearchDto, BulkUpdateOrderStatusDto } from '../../models/order.models';
import { ProductDto } from '../../models/product.models';
import { AuthService } from '../../services/auth.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
    this.loadOrders();
    this.loadProducts();
    const user = this.authService.getCurrentUser();
    if (user) {
      this.orderForm.userId = user.id;
    }
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => this.orders = data,
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products = data.filter(p => p.productStatus === 'YES'),
      error: (error) => console.error('Error loading products:', error)
    });
  }

  selectProduct(product: ProductDto): void {
    this.selectedProduct = product;
    this.orderForm.productId = product.productId;
    this.orderForm.productMSRP = product.productMSRP;
  }

  addToCart(): void {
    if (this.selectedProduct && this.orderForm.orderQuantity > 0) {
      const item: OrderItemDto = {
        productId: this.selectedProduct.productId,
        quantity: this.orderForm.orderQuantity,
        unitPrice: this.selectedProduct.productPerUnitPrice
      };
      this.cartItems.push(item);
      this.selectedProduct = null;
      this.orderForm.orderQuantity = 1;
    }
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
  }

  createOrder(): void {
    if (this.cartItems.length === 0) {
      alert('Please add items to cart');
      return;
    }
    
    if (!this.orderForm.customerFullName || this.orderForm.customerFullName.trim().length === 0) {
      alert('Please enter customer information before completing the order');
      this.showCustomerForm = true;
      return;
    }

    this.orderForm.items = this.cartItems;
    this.orderService.createOrder(this.orderForm).subscribe({
      next: (order) => {
        alert('Order created successfully! Invoice has been automatically generated.');
        
        // Automatically print invoice if invoice ID is available
        if (order.invoiceId) {
          // Small delay to ensure invoice is fully created
          setTimeout(() => {
            this.invoiceService.openInvoicePrintWindow(order.invoiceId!);
          }, 500);
        }
        
        this.loadOrders();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating order:', error);
        alert('Error creating order. Please try again.');
      }
    });
  }

  resetForm(): void {
    this.showForm = false;
    this.showCustomerForm = false;
    this.cartItems = [];
    this.selectedProduct = null;
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
      alert('Status must be either "Paid", "Pending", or "Cancelled"');
      return;
    }

    if (this.updateStatusDto.orderStatus !== 'Paid' && this.updateStatusDto.orderStatus !== 'Pending' && this.updateStatusDto.orderStatus !== 'Cancelled') {
      alert('Order Status must be either "Paid", "Pending", or "Cancelled"');
      return;
    }

    this.orderService.updateOrderStatus(this.selectedOrderForUpdate.orderId, this.updateStatusDto).subscribe({
      next: () => {
        alert('Order status updated successfully!');
        this.loadOrders();
        this.cancelUpdate();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Error updating order status. Please try again.');
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
    if (confirm(`Mark Order #${order.orderId} as Paid?`)) {
      const updateDto: UpdateOrderStatusDto = {
        status: 'Paid',
        orderStatus: 'Paid'
      };
      this.orderService.updateOrderStatus(order.orderId, updateDto).subscribe({
        next: () => {
          alert('Order marked as Paid!');
          this.loadOrders();
          this.selectedOrderIds.delete(order.orderId);
        },
        error: (error) => {
          console.error('Error updating order:', error);
          alert('Error updating order status.');
        }
      });
    }
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
      alert('Please select at least one order');
      return;
    }

    if (confirm(`Mark ${this.selectedOrderIds.size} order(s) as Paid?`)) {
      const bulkUpdateDto: BulkUpdateOrderStatusDto = {
        orderIds: Array.from(this.selectedOrderIds),
        status: 'Paid',
        orderStatus: 'Paid'
      };

      this.orderService.bulkUpdateOrderStatus(bulkUpdateDto).subscribe({
        next: (response: any) => {
          alert(`${response.updatedCount || this.selectedOrderIds.size} order(s) marked as Paid!`);
          this.loadOrders();
          this.selectedOrderIds.clear();
          this.showBulkActions = false;
        },
        error: (error) => {
          console.error('Error bulk updating orders:', error);
          alert('Error updating orders. Please try again.');
        }
      });
    }
  }

  bulkMarkAsPending(): void {
    if (this.selectedOrderIds.size === 0) {
      alert('Please select at least one order');
      return;
    }

    if (confirm(`Mark ${this.selectedOrderIds.size} order(s) as Pending?`)) {
      const bulkUpdateDto: BulkUpdateOrderStatusDto = {
        orderIds: Array.from(this.selectedOrderIds),
        status: 'Pending',
        orderStatus: 'Pending'
      };

      this.orderService.bulkUpdateOrderStatus(bulkUpdateDto).subscribe({
        next: (response: any) => {
          alert(`${response.updatedCount || this.selectedOrderIds.size} order(s) marked as Pending!`);
          this.loadOrders();
          this.selectedOrderIds.clear();
          this.showBulkActions = false;
        },
        error: (error) => {
          console.error('Error bulk updating orders:', error);
          alert('Error updating orders. Please try again.');
        }
      });
    }
  }

  clearSelection(): void {
    this.selectedOrderIds.clear();
    this.showBulkActions = false;
  }
}
