import { __decorate } from "tslib";
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
let InvoicesComponent = class InvoicesComponent {
    invoiceService;
    orderService;
    authService;
    invoices = [];
    orders = [];
    showCreateForm = false;
    showShopConfigForm = false;
    selectedOrderId = 0;
    createInvoiceDto = { orderId: 0 };
    shopConfig = {
        shopName: '',
        shopAddress: '',
        shopPhone: '',
        shopEmail: '',
        shopWebsite: '',
        taxId: '',
        footerMessage: '',
        headerMessage: ''
    };
    logoFile = null;
    logoPreview = null;
    // Filter properties
    showFilters = false;
    filter = {
        minAmount: undefined,
        maxAmount: undefined,
        startDate: undefined,
        endDate: undefined,
        customerAddress: '',
        status: ''
    };
    // Bulk selection properties
    selectedInvoiceIds = new Set();
    showBulkActions = false;
    // Payment properties
    showPaymentModal = false;
    showPaymentHistoryModal = false;
    showDueDateModal = false;
    selectedInvoice = null;
    payments = [];
    paymentSummary = null;
    newDueDate = new Date();
    paymentForm = {
        amount: 0,
        paymentMethod: 'Cash',
        transactionReference: '',
        notes: '',
        paymentDate: new Date()
    };
    // Sidebar and Navbar properties
    isSidebarCollapsed = false;
    sidebarWidth = '280px';
    currentUser;
    loading = false;
    menuItems = [
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
    constructor(invoiceService, orderService, authService) {
        this.invoiceService = invoiceService;
        this.orderService = orderService;
        this.authService = authService;
    }
    ngOnInit() {
        this.loading = true;
        this.loadInvoices();
        this.loadOrders();
        this.loadShopConfiguration();
        this.loadPaymentSummary();
        this.currentUser = {
            name: localStorage.getItem('userName') || 'User',
            role: localStorage.getItem('userRole') || 'cashier'
        };
    }
    onSidebarCollapse(collapsed) {
        this.isSidebarCollapsed = collapsed;
        this.sidebarWidth = collapsed ? '80px' : '280px';
    }
    getUserRole() {
        return this.currentUser?.role || 'cashier';
    }
    loadInvoices() {
        this.loading = true;
        // Check if any filter is active
        const hasActiveFilters = this.filter.minAmount !== undefined ||
            this.filter.maxAmount !== undefined ||
            this.filter.startDate !== undefined ||
            this.filter.endDate !== undefined ||
            (this.filter.customerAddress && this.filter.customerAddress.trim() !== '') ||
            (this.filter.status && this.filter.status !== '');
        if (hasActiveFilters) {
            this.applyFilters();
        }
        else {
            this.invoiceService.getAllInvoices().subscribe({
                next: (data) => {
                    this.invoices = data;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading invoices:', error);
                    this.loading = false;
                }
            });
        }
    }
    applyFilters() {
        this.loading = true;
        this.invoiceService.getFilteredInvoices(this.filter).subscribe({
            next: (data) => {
                this.invoices = data;
                this.showFilters = true;
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error applying filters. Please try again.',
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    clearFilters() {
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
    toggleFilters() {
        this.showFilters = !this.showFilters;
        if (!this.showFilters) {
            this.clearFilters();
        }
    }
    loadOrders() {
        this.orderService.getAllOrders().subscribe({
            next: (data) => this.orders = data,
            error: (error) => console.error('Error loading orders:', error)
        });
    }
    loadShopConfiguration() {
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
    isAdmin() {
        return this.authService.isAdmin();
    }
    showCreateInvoiceForm() {
        this.showCreateForm = true;
        this.createInvoiceDto = { orderId: 0 };
    }
    createInvoice() {
        if (this.createInvoiceDto.orderId === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Order Required',
                text: 'Please select an order',
                confirmButtonColor: '#667eea'
            });
            return;
        }
        this.invoiceService.createInvoice(this.createInvoiceDto).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Invoice created successfully!',
                    confirmButtonColor: '#667eea',
                    timer: 2000
                });
                this.loadInvoices();
                this.showCreateForm = false;
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Creating Invoice',
                    text: 'Error creating invoice. It may already exist for this order.',
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    printInvoice(invoiceId) {
        this.invoiceService.openInvoicePrintWindow(invoiceId);
    }
    downloadInvoice(invoiceId) {
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
                Swal.fire({
                    icon: 'error',
                    title: 'Download Error',
                    text: 'Error downloading invoice',
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    showShopConfigurationForm() {
        this.showShopConfigForm = true;
    }
    onLogoSelected(event) {
        const file = event.target.files[0];
        if (file) {
            this.logoFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.logoPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
    saveShopConfiguration() {
        const dto = {
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
                const base64 = reader.result.split(',')[1];
                dto.logoBase64 = base64;
                this.updateShopConfig(dto);
            };
            reader.readAsDataURL(this.logoFile);
        }
        else {
            this.updateShopConfig(dto);
        }
    }
    updateShopConfig(dto) {
        this.invoiceService.updateShopConfiguration(dto).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Shop configuration updated successfully!',
                    confirmButtonColor: '#667eea',
                    timer: 2000
                });
                this.loadShopConfiguration();
                this.showShopConfigForm = false;
                this.logoFile = null;
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Error',
                    text: 'Error updating shop configuration',
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    cancelShopConfig() {
        this.showShopConfigForm = false;
        this.logoFile = null;
        this.logoPreview = null;
        this.loadShopConfiguration();
    }
    getOrderById(orderId) {
        return this.orders.find(o => o.orderId === orderId);
    }
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    }
    // Bulk selection methods
    toggleInvoiceSelection(invoiceId) {
        if (this.selectedInvoiceIds.has(invoiceId)) {
            this.selectedInvoiceIds.delete(invoiceId);
        }
        else {
            this.selectedInvoiceIds.add(invoiceId);
        }
        this.showBulkActions = this.selectedInvoiceIds.size > 0;
    }
    toggleSelectAll() {
        if (this.selectedInvoiceIds.size === this.invoices.length) {
            this.selectedInvoiceIds.clear();
        }
        else {
            this.invoices.forEach(invoice => this.selectedInvoiceIds.add(invoice.invoiceId));
        }
        this.showBulkActions = this.selectedInvoiceIds.size > 0;
    }
    isInvoiceSelected(invoiceId) {
        return this.selectedInvoiceIds.has(invoiceId);
    }
    get selectedInvoicesCount() {
        return this.selectedInvoiceIds.size;
    }
    clearSelection() {
        this.selectedInvoiceIds.clear();
        this.showBulkActions = false;
    }
    printSelectedInvoices() {
        if (this.selectedInvoiceIds.size === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Invoices Selected',
                text: 'Please select at least one invoice to print',
                confirmButtonColor: '#667eea'
            });
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
    // Payment Management Methods
    loadPaymentSummary() {
        this.invoiceService.getPaymentSummary().subscribe({
            next: (data) => {
                this.paymentSummary = data;
            },
            error: (error) => console.error('Error loading payment summary:', error)
        });
    }
    showAddPaymentModal(invoice) {
        this.selectedInvoice = invoice;
        this.paymentForm = {
            amount: invoice.balance || 0,
            paymentMethod: 'Cash',
            transactionReference: '',
            notes: '',
            paymentDate: new Date()
        };
        this.showPaymentModal = true;
    }
    closePaymentModal() {
        this.showPaymentModal = false;
        this.selectedInvoice = null;
        this.resetPaymentForm();
    }
    resetPaymentForm() {
        this.paymentForm = {
            amount: 0,
            paymentMethod: 'Cash',
            transactionReference: '',
            notes: '',
            paymentDate: new Date()
        };
    }
    addPayment() {
        if (!this.selectedInvoice)
            return;
        // Validation
        if (this.paymentForm.amount <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount',
                text: 'Payment amount must be greater than 0',
                confirmButtonColor: '#667eea'
            });
            return;
        }
        if (this.paymentForm.amount > this.selectedInvoice.balance) {
            Swal.fire({
                icon: 'warning',
                title: 'Amount Exceeds Balance',
                text: `Payment amount cannot exceed remaining balance of ${this.formatCurrency(this.selectedInvoice.balance)}`,
                confirmButtonColor: '#667eea'
            });
            return;
        }
        this.invoiceService.addPayment(this.selectedInvoice.invoiceId, this.paymentForm).subscribe({
            next: (payment) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Added!',
                    text: `Payment of ${this.formatCurrency(this.paymentForm.amount)} has been recorded`,
                    confirmButtonColor: '#667eea',
                    timer: 2000
                });
                this.loadInvoices();
                this.loadPaymentSummary();
                this.closePaymentModal();
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.error?.message || 'Failed to add payment. Please try again.',
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    viewPaymentHistory(invoice) {
        this.selectedInvoice = invoice;
        this.loadPaymentHistory(invoice.invoiceId);
    }
    loadPaymentHistory(invoiceId) {
        this.invoiceService.getInvoicePayments(invoiceId).subscribe({
            next: (data) => {
                this.payments = data;
                this.showPaymentHistoryModal = true;
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load payment history',
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    closePaymentHistoryModal() {
        this.showPaymentHistoryModal = false;
        this.selectedInvoice = null;
        this.payments = [];
    }
    // Due Date Management
    openDueDateModal(invoice) {
        this.selectedInvoice = invoice;
        this.newDueDate = new Date(invoice.dueDate);
        this.showDueDateModal = true;
    }
    closeDueDateModal() {
        this.showDueDateModal = false;
        this.selectedInvoice = null;
        this.newDueDate = new Date();
    }
    updateDueDate() {
        if (!this.selectedInvoice)
            return;
        const updateDto = {
            dueDate: this.newDueDate
        };
        this.invoiceService.updateInvoiceDueDate(this.selectedInvoice.invoiceId, updateDto).subscribe({
            next: (updatedInvoice) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Due Date Updated!',
                    text: `Due date has been updated to ${this.formatDate(updatedInvoice.dueDate)}`,
                    confirmButtonColor: '#667eea',
                    timer: 2000
                });
                this.loadInvoices();
                this.closeDueDateModal();
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.error?.message || 'Failed to update due date. Please try again.',
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    deletePayment(paymentId) {
        Swal.fire({
            title: 'Delete Payment?',
            text: 'This action cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#667eea',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.invoiceService.deletePayment(paymentId).subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Payment has been deleted',
                            confirmButtonColor: '#667eea',
                            timer: 2000
                        });
                        if (this.selectedInvoice) {
                            this.loadPaymentHistory(this.selectedInvoice.invoiceId);
                        }
                        this.loadInvoices();
                        this.loadPaymentSummary();
                    },
                    error: (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete payment',
                            confirmButtonColor: '#667eea'
                        });
                    }
                });
            }
        });
    }
    getStatusBadgeClass(status) {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'fully paid':
                return 'bg-success';
            case 'partially paid':
                return 'bg-warning';
            case 'unpaid':
            case 'pending':
                return 'bg-danger';
            case 'overdue':
                return 'bg-dark';
            default:
                return 'bg-secondary';
        }
    }
    getPaymentProgress(invoice) {
        if (!invoice.totalAmount || invoice.totalAmount === 0)
            return 0;
        return (invoice.amountPaid / invoice.totalAmount) * 100;
    }
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    }
    isOverdue(dueDate) {
        return new Date(dueDate) < new Date();
    }
};
InvoicesComponent = __decorate([
    Component({
        selector: 'app-invoices',
        templateUrl: './invoices.component.html',
        styleUrls: ['./invoices.component.css']
    })
], InvoicesComponent);
export { InvoicesComponent };
//# sourceMappingURL=invoices.component.js.map