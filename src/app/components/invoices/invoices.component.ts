import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { OrderService } from '../../services/order.service';
import { InvoiceDto, CreateInvoiceDto, ShopConfigurationDto, UpdateShopConfigurationDto } from '../../models/invoice.models';
import { InvoiceFilterDto } from '../../models/invoice-filter.models';
import { OrderDto } from '../../models/order.models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  invoices: InvoiceDto[] = [];
  orders: OrderDto[] = [];
  showCreateForm: boolean = false;
  showShopConfigForm: boolean = false;
  selectedOrderId: number = 0;
  createInvoiceDto: CreateInvoiceDto = { orderId: 0 };
  shopConfig: ShopConfigurationDto = {
    shopName: '',
    shopAddress: '',
    shopPhone: '',
    shopEmail: '',
    shopWebsite: '',
    taxId: '',
    footerMessage: '',
    headerMessage: ''
  };
  logoFile: File | null = null;
  logoPreview: string | null = null;

  // Filter properties
  showFilters: boolean = false;
  filter: InvoiceFilterDto = {
    minAmount: undefined,
    maxAmount: undefined,
    startDate: undefined,
    endDate: undefined,
    customerAddress: '',
    status: ''
  };

  // Bulk selection properties
  selectedInvoiceIds: Set<number> = new Set();
  showBulkActions: boolean = false;

  constructor(
    private invoiceService: InvoiceService,
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
    this.loadOrders();
    this.loadShopConfiguration();
  }

  loadInvoices(): void {
    // Check if any filter is active
    const hasActiveFilters = this.filter.minAmount !== undefined || 
                            this.filter.maxAmount !== undefined ||
                            this.filter.startDate !== undefined ||
                            this.filter.endDate !== undefined ||
                            (this.filter.customerAddress && this.filter.customerAddress.trim() !== '') ||
                            (this.filter.status && this.filter.status !== '');

    if (hasActiveFilters) {
      this.applyFilters();
    } else {
      this.invoiceService.getAllInvoices().subscribe({
        next: (data) => this.invoices = data,
        error: (error) => console.error('Error loading invoices:', error)
      });
    }
  }

  applyFilters(): void {
    this.invoiceService.getFilteredInvoices(this.filter).subscribe({
      next: (data) => {
        this.invoices = data;
        this.showFilters = true;
      },
      error: (error) => {
        console.error('Error filtering invoices:', error);
        alert('Error applying filters. Please try again.');
      }
    });
  }

  clearFilters(): void {
    this.filter = {
      minAmount: undefined,
      maxAmount: undefined,
      startDate: undefined,
      endDate: undefined,
      customerAddress: '',
      status: ''
    };
    this.showFilters = false;
    this.loadInvoices();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (!this.showFilters) {
      this.clearFilters();
    }
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => this.orders = data,
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  loadShopConfiguration(): void {
    this.invoiceService.getShopConfiguration().subscribe({
      next: (data) => {
        this.shopConfig = {
          id: data.id,
          shopName: data.shopName,
          shopAddress: data.shopAddress || '',
          shopPhone: data.shopPhone || '',
          shopEmail: data.shopEmail || '',
          shopWebsite: data.shopWebsite || '',
          taxId: data.taxId || '',
          footerMessage: data.footerMessage || '',
          headerMessage: data.headerMessage || '',
          logoBase64: data.logoBase64
        };
        if (data.logoBase64) {
          this.logoPreview = `data:image/png;base64,${data.logoBase64}`;
        }
      },
      error: (error) => console.error('Error loading shop configuration:', error)
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  showCreateInvoiceForm(): void {
    this.showCreateForm = true;
    this.createInvoiceDto = { orderId: 0 };
  }

  createInvoice(): void {
    if (this.createInvoiceDto.orderId === 0) {
      alert('Please select an order');
      return;
    }

    this.invoiceService.createInvoice(this.createInvoiceDto).subscribe({
      next: () => {
        alert('Invoice created successfully!');
        this.loadInvoices();
        this.showCreateForm = false;
      },
      error: (error) => {
        console.error('Error creating invoice:', error);
        alert('Error creating invoice. It may already exist for this order.');
      }
    });
  }

  printInvoice(invoiceId: number): void {
    this.invoiceService.openInvoicePrintWindow(invoiceId);
  }

  downloadInvoice(invoiceId: number): void {
    this.invoiceService.downloadInvoice(invoiceId).subscribe({
      next: (blob) => {
        const invoice = this.invoices.find(i => i.invoiceId === invoiceId);
        const fileName = invoice ? `Invoice_${invoice.invoiceNumber}.html` : `Invoice_${invoiceId}.html`;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading invoice:', error);
        alert('Error downloading invoice');
      }
    });
  }

  showShopConfigurationForm(): void {
    this.showShopConfigForm = true;
  }

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveShopConfiguration(): void {
    const dto: UpdateShopConfigurationDto = {
      shopName: this.shopConfig.shopName,
      shopAddress: this.shopConfig.shopAddress,
      shopPhone: this.shopConfig.shopPhone,
      shopEmail: this.shopConfig.shopEmail,
      shopWebsite: this.shopConfig.shopWebsite,
      taxId: this.shopConfig.taxId,
      footerMessage: this.shopConfig.footerMessage,
      headerMessage: this.shopConfig.headerMessage,
      logoBase64: this.shopConfig.logoBase64
    };

    if (this.logoFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        dto.logoBase64 = base64;
        this.updateShopConfig(dto);
      };
      reader.readAsDataURL(this.logoFile);
    } else {
      this.updateShopConfig(dto);
    }
  }

  private updateShopConfig(dto: UpdateShopConfigurationDto): void {
    this.invoiceService.updateShopConfiguration(dto).subscribe({
      next: () => {
        alert('Shop configuration updated successfully!');
        this.loadShopConfiguration();
        this.showShopConfigForm = false;
        this.logoFile = null;
      },
      error: (error) => {
        console.error('Error updating shop configuration:', error);
        alert('Error updating shop configuration');
      }
    });
  }

  cancelShopConfig(): void {
    this.showShopConfigForm = false;
    this.logoFile = null;
    this.logoPreview = null;
    this.loadShopConfiguration();
  }

  getOrderById(orderId: number): OrderDto | undefined {
    return this.orders.find(o => o.orderId === orderId);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  // Bulk selection methods
  toggleInvoiceSelection(invoiceId: number): void {
    if (this.selectedInvoiceIds.has(invoiceId)) {
      this.selectedInvoiceIds.delete(invoiceId);
    } else {
      this.selectedInvoiceIds.add(invoiceId);
    }
    this.showBulkActions = this.selectedInvoiceIds.size > 0;
  }

  toggleSelectAll(): void {
    if (this.selectedInvoiceIds.size === this.invoices.length) {
      this.selectedInvoiceIds.clear();
    } else {
      this.invoices.forEach(invoice => this.selectedInvoiceIds.add(invoice.invoiceId));
    }
    this.showBulkActions = this.selectedInvoiceIds.size > 0;
  }

  isInvoiceSelected(invoiceId: number): boolean {
    return this.selectedInvoiceIds.has(invoiceId);
  }

  get selectedInvoicesCount(): number {
    return this.selectedInvoiceIds.size;
  }

  clearSelection(): void {
    this.selectedInvoiceIds.clear();
    this.showBulkActions = false;
  }

  printSelectedInvoices(): void {
    if (this.selectedInvoiceIds.size === 0) {
      alert('Please select at least one invoice to print');
      return;
    }

    const selectedIds = Array.from(this.selectedInvoiceIds);
    
    // Use bulk print endpoint - combines all invoices into one document
    // The endpoint will automatically trigger the print dialog when the page loads
    this.invoiceService.bulkPrintInvoices(selectedIds);
    
    // Clear selection after opening print window
    setTimeout(() => {
      this.clearSelection();
    }, 500);
  }
}

