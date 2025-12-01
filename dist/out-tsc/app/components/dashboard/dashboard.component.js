import { __decorate } from "tslib";
import { Component } from '@angular/core';
let DashboardComponent = class DashboardComponent {
    authService;
    productService;
    accountingService;
    router;
    currentUser;
    totalProducts = 0;
    availableProducts = 0;
    unavailableProducts = 0;
    isSidebarCollapsed = false;
    menuItems = [];
    loading = false;
    salesChartOptions = null;
    dailySales = [];
    constructor(authService, productService, accountingService, router) {
        this.authService = authService;
        this.productService = productService;
        this.accountingService = accountingService;
        this.router = router;
        this.currentUser = this.authService.getCurrentUser();
        this.setupMenuItems();
    }
    ngOnInit() {
        this.loading = true;
        this.loadStats();
        this.loadSalesChart();
    }
    setupMenuItems() {
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
        if (this.isAdmin() || this.getUserRole() === 'Cashier') {
            this.menuItems.push({ label: 'Barcodes', icon: 'fas fa-barcode', route: '/barcodes' });
        }
        if (this.isAdmin()) {
            this.menuItems.push({ label: 'Expenses', icon: 'fas fa-money-bill-wave', route: '/expenses' });
            this.menuItems.push({ label: 'Users', icon: 'fas fa-users', route: '/users' });
        }
    }
    get sidebarWidth() {
        return this.isSidebarCollapsed ? '80px' : '280px';
    }
    onSidebarCollapse(collapsed) {
        this.isSidebarCollapsed = collapsed;
    }
    loadStats() {
        let completedCalls = 0;
        const checkComplete = () => {
            completedCalls++;
            if (completedCalls === 3)
                this.loading = false;
        };
        this.productService.getTotalProducts().subscribe({
            next: count => this.totalProducts = count,
            error: () => checkComplete(),
            complete: () => checkComplete()
        });
        this.productService.getAvailableProducts().subscribe({
            next: count => this.availableProducts = count,
            error: () => checkComplete(),
            complete: () => checkComplete()
        });
        this.productService.getUnavailableProducts().subscribe({
            next: count => this.unavailableProducts = count,
            error: () => checkComplete(),
            complete: () => checkComplete()
        });
    }
    loadSalesChart() {
        // Load sales data from API for last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 29); // Last 30 days
        this.accountingService.getSalesGraph(startDate, endDate).subscribe({
            next: (graphData) => {
                // Use real data from API
                this.salesChartOptions = {
                    series: [
                        {
                            name: 'Sales',
                            data: graphData.salesData
                        },
                        {
                            name: 'Profit',
                            data: graphData.profitData
                        }
                    ],
                    chart: {
                        type: 'line',
                        height: 300,
                        toolbar: {
                            show: true
                        }
                    },
                    colors: ['#667eea', '#48bb78'],
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 3
                    },
                    xaxis: {
                        categories: graphData.labels,
                        labels: {
                            style: {
                                colors: '#6b7280'
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            formatter: (value) => {
                                return '$' + value.toFixed(2);
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
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                };
            },
            error: (error) => {
                console.error('Error loading sales graph:', error);
                // Fallback to empty chart if API fails
                this.initializeEmptyChart();
            }
        });
        // Load daily sales summary for recent days
        this.accountingService.getDailySales(7).subscribe({
            next: (data) => {
                this.dailySales = data;
            },
            error: (error) => {
                console.error('Error loading daily sales:', error);
            }
        });
    }
    initializeEmptyChart() {
        const labels = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        this.salesChartOptions = {
            series: [
                { name: 'Sales', data: Array(30).fill(0) },
                { name: 'Profit', data: Array(30).fill(0) }
            ],
            chart: {
                type: 'line',
                height: 300,
                toolbar: { show: true }
            },
            colors: ['#667eea', '#48bb78'],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 3 },
            xaxis: {
                categories: labels,
                labels: { style: { colors: '#6b7280' } }
            },
            yaxis: {
                labels: {
                    formatter: (value) => '$' + value.toFixed(2),
                    style: { colors: '#6b7280' }
                }
            },
            grid: { borderColor: '#e5e7eb' },
            legend: { position: 'top' },
            tooltip: {
                y: { formatter: (value) => '$' + value.toFixed(2) }
            }
        };
    }
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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
DashboardComponent = __decorate([
    Component({
        selector: 'app-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls: ['./dashboard.component.css']
    })
], DashboardComponent);
export { DashboardComponent };
//# sourceMappingURL=dashboard.component.js.map