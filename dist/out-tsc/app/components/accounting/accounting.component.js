import { __decorate } from "tslib";
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
let AccountingComponent = class AccountingComponent {
    authService;
    accountingService;
    router;
    currentUser;
    isSidebarCollapsed = false;
    menuItems = [];
    activeTab = 'dashboard';
    loading = false;
    // Dashboard Data
    summary = null;
    dailySales = [];
    paymentMethods = [];
    topProducts = [];
    salesReturns = [];
    totalReturnsAmount = 0;
    totalReturnsProfitImpact = 0;
    // Chart Options
    salesChartOptions = null;
    revenueChartOptions = null;
    // Accounting Entries
    entries = [];
    showEntryForm = false;
    entryForm = this.getEmptyEntryForm();
    // Filters
    filterForm = {};
    dateRange = 'month';
    startDate = null;
    endDate = null;
    constructor(authService, accountingService, router) {
        this.authService = authService;
        this.accountingService = accountingService;
        this.router = router;
        this.currentUser = this.authService.getCurrentUser();
        this.setupMenuItems();
    }
    ngOnInit() {
        this.loading = true;
        this.setDateRange(this.dateRange);
        this.loadDashboardData();
    }
    setupMenuItems() {
        this.menuItems = [
            { label: 'Dashboard', icon: 'fas fa-chart-line', route: '/dashboard' },
            { label: 'Products', icon: 'fas fa-box', route: '/products' },
            { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
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
    get sidebarWidth() {
        return this.isSidebarCollapsed ? '80px' : '250px';
    }
    onSidebarCollapse(collapsed) {
        this.isSidebarCollapsed = collapsed;
    }
    setTab(tab) {
        this.activeTab = tab;
        if (tab === 'entries') {
            this.loadEntries();
        }
    }
    setDateRange(range) {
        this.dateRange = range;
        const now = new Date();
        this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        if (range === 'custom') {
            // User will set dates manually
            return;
        }
        switch (range) {
            case 'today':
                this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                break;
            case 'week':
                this.startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                this.startDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                this.startDate = new Date(now.getFullYear(), 0, 1);
                break;
        }
        this.loadDashboardData();
    }
    loadDashboardData() {
        this.loading = true;
        let completedCalls = 0;
        const totalCalls = 6;
        const checkComplete = () => {
            completedCalls++;
            if (completedCalls >= totalCalls) {
                this.loading = false;
            }
        };
        this.loadSummary(checkComplete);
        this.loadDailySales(checkComplete);
        this.loadPaymentMethods(checkComplete);
        this.loadTopProducts(checkComplete);
        this.loadSalesChart(checkComplete);
        this.loadSalesReturns(checkComplete);
    }
    refreshData() {
        this.loadDashboardData();
        Swal.fire({
            icon: 'success',
            title: 'Data Refreshed',
            text: 'All accounting data has been updated',
            timer: 2000,
            showConfirmButton: false
        });
    }
    loadSummary(callback) {
        if (!this.startDate || !this.endDate) {
            callback?.();
            return;
        }
        this.accountingService.getAccountingSummary(this.startDate, this.endDate).subscribe({
            next: (data) => {
                this.summary = data;
                callback?.();
            },
            error: (error) => {
                console.error('Error loading summary:', error);
                callback?.();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load financial summary'
                });
            }
        });
    }
    loadDailySales(callback) {
        this.accountingService.getDailySales(7).subscribe({
            next: (data) => {
                this.dailySales = data;
                // Calculate total refunds from daily sales if not available in summary
                if (data && data.length > 0) {
                    const calculatedRefunds = data.reduce((sum, day) => sum + (day.totalRefunds || 0), 0);
                    console.log('💰 Total Refunds from Daily Sales:', calculatedRefunds);
                    // If we don't have returns from accounting entries, use daily sales refunds
                    if (this.totalReturnsAmount === 0) {
                        this.totalReturnsAmount = calculatedRefunds;
                    }
                }
                callback?.();
            },
            error: (error) => {
                console.error('Error loading daily sales:', error);
                callback?.();
            }
        });
    }
    loadPaymentMethods(callback) {
        if (!this.startDate || !this.endDate) {
            callback?.();
            return;
        }
        this.accountingService.getPaymentMethodSummary(this.startDate, this.endDate).subscribe({
            next: (data) => {
                this.paymentMethods = data;
                callback?.();
            },
            error: (error) => {
                console.error('Error loading payment methods:', error);
            }
        });
    }
    loadTopProducts(callback) {
        this.accountingService.getTopProducts(10, this.startDate || undefined, this.endDate || undefined).subscribe({
            next: (data) => {
                this.topProducts = data;
                callback?.();
            },
            error: (error) => {
                console.error('Error loading top products:', error);
                callback?.();
            }
        });
    }
    loadSalesChart(callback) {
        if (!this.startDate || !this.endDate) {
            callback?.();
            return;
        }
        this.accountingService.getSalesGraph(this.startDate, this.endDate).subscribe({
            next: (data) => {
                this.initializeSalesChart(data);
                this.initializeRevenueChart(data);
                callback?.();
            },
            error: (error) => {
                console.error('Error loading sales chart:', error);
                callback?.();
            }
        });
    }
    loadSalesReturns(callback) {
        this.accountingService.getSalesReturns(this.startDate || undefined, this.endDate || undefined).subscribe({
            next: (data) => {
                console.log('📊 Raw Sales Returns Response:', data);
                // Ensure data is an array
                if (!Array.isArray(data)) {
                    console.warn('⚠️ Sales returns response is not an array:', data);
                    this.salesReturns = [];
                    this.totalReturnsAmount = 0;
                    this.totalReturnsProfitImpact = 0;
                    callback?.();
                    return;
                }
                this.salesReturns = data;
                this.totalReturnsAmount = data.reduce((sum, entry) => sum + (entry.amount || 0), 0);
                this.totalReturnsProfitImpact = data.reduce((sum, entry) => sum + (entry.profitImpact || 0), 0);
                console.log('✅ Sales Returns Loaded:', {
                    count: data.length,
                    totalAmount: this.totalReturnsAmount,
                    profitImpact: this.totalReturnsProfitImpact
                });
                callback?.();
            },
            error: (error) => {
                console.error('❌ Error loading sales returns:', error);
                this.salesReturns = [];
                this.totalReturnsAmount = 0;
                this.totalReturnsProfitImpact = 0;
                callback?.();
            }
        });
    }
    initializeSalesChart(data) {
        this.salesChartOptions = {
            series: [
                {
                    name: 'Sales',
                    data: data.salesData || []
                },
                {
                    name: 'Expenses',
                    data: data.expensesData || []
                },
                {
                    name: 'Refunds',
                    data: data.refundsData || []
                },
                {
                    name: 'Profit',
                    data: data.profitData || []
                }
            ],
            chart: {
                type: 'line',
                height: 350,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            colors: ['#667eea', '#f56565', '#f59e0b', '#48bb78'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            xaxis: {
                categories: data.labels || [],
                labels: {
                    rotate: -45,
                    rotateAlways: false,
                    hideOverlappingLabels: true,
                    trim: true,
                    style: {
                        colors: '#6b7280',
                        fontSize: '12px'
                    }
                },
                tickPlacement: 'on'
            },
            yaxis: {
                labels: {
                    formatter: (value) => {
                        return '$' + value.toFixed(2);
                    },
                    style: {
                        colors: '#6b7280',
                        fontSize: '12px'
                    }
                }
            },
            grid: {
                borderColor: '#e5e7eb'
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                floating: false,
                offsetY: 0,
                offsetX: 0,
                fontSize: '13px',
                markers: {
                    width: 12,
                    height: 12,
                    radius: 2
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5
                }
            },
            tooltip: {
                y: {
                    formatter: (value) => {
                        return '$' + value.toFixed(2);
                    }
                }
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: {
                            height: 300
                        },
                        legend: {
                            position: 'bottom',
                            fontSize: '11px'
                        },
                        xaxis: {
                            labels: {
                                rotate: -45,
                                style: {
                                    fontSize: '10px'
                                }
                            }
                        }
                    }
                }
            ]
        };
    }
    initializeRevenueChart(data) {
        this.revenueChartOptions = {
            series: [
                {
                    name: 'Orders',
                    data: data.ordersData || []
                }
            ],
            chart: {
                type: 'line',
                height: 350,
                toolbar: {
                    show: true,
                    offsetY: -5
                }
            },
            colors: ['#764ba2'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                categories: data.labels || [],
                labels: {
                    style: {
                        colors: '#6b7280'
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: (value) => {
                        return value.toFixed(0);
                    },
                    style: {
                        colors: '#6b7280'
                    }
                }
            },
            grid: {
                borderColor: '#e5e7eb'
            },
            legend: {
                position: 'top'
            },
            tooltip: {
                y: {
                    formatter: (value) => {
                        return value.toFixed(0) + ' orders';
                    }
                }
            }
        };
    }
    loadEntries() {
        this.accountingService.getAccountingEntries(this.filterForm).subscribe({
            next: (response) => {
                console.log('📝 Accounting Entries Response:', response);
                // Handle paginated response
                if (response && response.entries && Array.isArray(response.entries)) {
                    this.entries = response.entries;
                    console.log('✅ Loaded', this.entries.length, 'entries from paginated response');
                }
                // Handle direct array response (fallback)
                else if (Array.isArray(response)) {
                    this.entries = response;
                    console.log('✅ Loaded', this.entries.length, 'entries from direct array');
                }
                else {
                    console.warn('⚠️ Unexpected response format:', response);
                    this.entries = [];
                }
            },
            error: (error) => {
                console.error('❌ Error loading entries:', error);
                this.entries = [];
            }
        });
    }
    applyFilter() {
        this.loadDashboardData();
    }
    resetFilter() {
        this.filterForm = {};
        this.setDateRange('month');
    }
    showAddEntryForm() {
        this.showEntryForm = true;
        this.entryForm = this.getEmptyEntryForm();
    }
    createEntry() {
        this.accountingService.createAccountingEntry(this.entryForm).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Accounting entry created successfully',
                    confirmButtonColor: '#667eea',
                    timer: 2000
                });
                this.loadEntries();
                this.loadDashboardData();
                this.cancelEntryForm();
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to create accounting entry',
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    deleteEntry(id) {
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
                this.accountingService.deleteAccountingEntry(id).subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Entry has been deleted.',
                            confirmButtonColor: '#667eea',
                            timer: 2000
                        });
                        this.loadEntries();
                        this.loadDashboardData();
                    },
                    error: (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete entry',
                            confirmButtonColor: '#667eea'
                        });
                    }
                });
            }
        });
    }
    cancelEntryForm() {
        this.showEntryForm = false;
        this.entryForm = this.getEmptyEntryForm();
    }
    getEmptyEntryForm() {
        return {
            entryType: 'Income',
            amount: 0,
            description: '',
            entryDate: new Date(),
            costOfGoodsSold: 0,
            profitImpact: 0
        };
    }
    getEntryTypeLabel(type) {
        const labels = {
            'Income': 'Income',
            'Expense': 'Expense',
            'Sale': 'Sale',
            'Purchase': 'Purchase',
            'Payment': 'Payment',
            'Refund': 'Refund',
            'SalesReturn': 'Sales Return'
        };
        return labels[type] || type;
    }
    getEntryTypeBadgeClass(type) {
        const classes = {
            'Income': 'bg-success',
            'Sale': 'bg-success',
            'Expense': 'bg-danger',
            'Purchase': 'bg-warning',
            'Payment': 'bg-info',
            'Refund': 'bg-secondary',
            'SalesReturn': 'bg-danger'
        };
        return classes[type] || 'bg-secondary';
    }
    exportReport(format) {
        // Prepare filter with date range
        const exportFilter = {
            ...this.filterForm,
            startDate: this.startDate || undefined,
            endDate: this.endDate || undefined
        };
        console.log('📤 Exporting report:', { format, filter: exportFilter });
        this.accountingService.exportAccountingReport(format, exportFilter).subscribe({
            next: (blob) => {
                console.log('✅ Export successful, blob size:', blob.size);
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                // Generate filename with date
                const dateStr = new Date().toISOString().split('T')[0];
                link.download = `accounting_report_${dateStr}.${format}`;
                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                // Cleanup
                window.URL.revokeObjectURL(url);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: `Report exported successfully as ${format.toUpperCase()}`,
                    confirmButtonColor: '#667eea',
                    timer: 2000
                });
            },
            error: (error) => {
                console.error('❌ Export error:', error);
                let errorMessage = 'Failed to export report';
                if (error.status === 404) {
                    errorMessage = 'Export endpoint not found. Please contact administrator.';
                }
                else if (error.status === 500) {
                    errorMessage = 'Server error while generating report. Please try again.';
                }
                else if (error.error instanceof Blob) {
                    // Try to read error message from blob
                    const reader = new FileReader();
                    reader.onload = () => {
                        console.error('Error details:', reader.result);
                    };
                    reader.readAsText(error.error);
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Export Failed',
                    text: errorMessage,
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    }
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
    navigateTo(route) {
        this.router.navigate([route]);
    }
    isAdmin() {
        return this.authService.isAdmin();
    }
    isCashier() {
        return this.authService.isCashier();
    }
    getUserRole() {
        return this.currentUser?.role || 'User';
    }
};
AccountingComponent = __decorate([
    Component({
        selector: 'app-accounting',
        templateUrl: './accounting.component.html',
        styleUrls: ['./accounting.component.css']
    })
], AccountingComponent);
export { AccountingComponent };
//# sourceMappingURL=accounting.component.js.map