import { __decorate } from "tslib";
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
let CustomerBalanceComponent = class CustomerBalanceComponent {
    authService;
    router;
    customerBalanceService;
    currentUser;
    isSidebarCollapsed = false;
    menuItems = [];
    loading = false;
    // Customer balances data
    customerBalances = [];
    filteredBalances = [];
    searchTerm = '';
    areaSearchTerm = '';
    // Totals
    totalDays0To30 = 0;
    totalDays31To60 = 0;
    totalDays61To90 = 0;
    totalDays91Plus = 0;
    grandTotal = 0;
    // Pagination
    currentPage = 1;
    itemsPerPage = 20;
    totalPages = 1;
    // Date
    reportDate = new Date();
    constructor(authService, router, customerBalanceService) {
        this.authService = authService;
        this.router = router;
        this.customerBalanceService = customerBalanceService;
        this.currentUser = this.authService.getCurrentUser();
        this.setupMenuItems();
    }
    ngOnInit() {
        this.loadCustomerBalances();
    }
    setupMenuItems() {
        this.menuItems = [
            { label: 'Dashboard', icon: 'fas fa-chart-line', route: '/dashboard' },
            { label: 'Products', icon: 'fas fa-box', route: '/products' },
            { label: 'Orders', icon: 'fas fa-shopping-cart', route: '/orders' },
            { label: 'Returns', icon: 'fas fa-undo', route: '/returns' },
            { label: 'Categories', icon: 'fas fa-tags', route: '/categories' },
            { label: 'Invoices', icon: 'fas fa-file-invoice', route: '/invoices' },
            { label: 'Accounting', icon: 'fas fa-calculator', route: '/accounting' }
        ];
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
    loadCustomerBalances() {
        this.loading = true;
        // Format date as YYYY-MM-DD for API
        const asOfDate = this.reportDate.toISOString().split('T')[0];
        this.customerBalanceService.getAgingReport(asOfDate).subscribe({
            next: (response) => {
                this.customerBalances = response.customers;
                this.filteredBalances = [...this.customerBalances];
                // Set totals from API response
                this.totalDays0To30 = response.totalDays0To30;
                this.totalDays31To60 = response.totalDays31To60;
                this.totalDays61To90 = response.totalDays61To90;
                this.totalDays91Plus = response.totalDays91Plus;
                this.grandTotal = response.grandTotal;
                this.calculatePagination();
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading customer balances:', error);
                this.loading = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load customer balances. Please try again.',
                    confirmButtonColor: '#3085d6'
                });
            }
        });
    }
    calculateTotals() {
        this.totalDays0To30 = this.filteredBalances.reduce((sum, item) => sum + item.days0To30, 0);
        this.totalDays31To60 = this.filteredBalances.reduce((sum, item) => sum + item.days31To60, 0);
        this.totalDays61To90 = this.filteredBalances.reduce((sum, item) => sum + item.days61To90, 0);
        this.totalDays91Plus = this.filteredBalances.reduce((sum, item) => sum + item.days91Plus, 0);
        this.grandTotal = this.filteredBalances.reduce((sum, item) => sum + item.totalOutstanding, 0);
    }
    calculatePagination() {
        this.totalPages = Math.ceil(this.filteredBalances.length / this.itemsPerPage);
    }
    get paginatedBalances() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredBalances.slice(start, end);
    }
    searchCustomers() {
        const nameTerm = this.searchTerm.toLowerCase().trim();
        const areaTerm = this.areaSearchTerm.toLowerCase().trim();
        if (!nameTerm && !areaTerm) {
            this.filteredBalances = [...this.customerBalances];
            // Restore original totals from API
            this.loadCustomerBalances();
        }
        else {
            this.filteredBalances = this.customerBalances.filter(customer => {
                const matchesName = !nameTerm || customer.customerName.toLowerCase().includes(nameTerm);
                const matchesArea = !areaTerm || (customer.customerAddress && customer.customerAddress.toLowerCase().includes(areaTerm));
                return matchesName && matchesArea;
            });
            // Recalculate totals for filtered results
            this.calculateTotals();
        }
        this.currentPage = 1;
        this.calculatePagination();
    }
    changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }
    printReport() {
        // Create a printable window with properly formatted content
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to open print window. Please check your popup blocker.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Customer Account Balance - Aging Report</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
          
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }
          
          .report-header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .report-header h1 {
            margin: 0 0 5px 0;
            font-size: 24px;
            color: #333;
          }
          
          .report-header p {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 12px 8px;
            text-align: left;
          }
          
          th {
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
          }
          
          td {
            font-size: 11px;
          }
          
          .text-right {
            text-align: right;
          }
          
          .total-row {
            background-color: #f2f2f2;
            font-weight: bold;
            border-top: 3px solid #333;
          }
          
          .total-row td {
            font-size: 12px;
          }
          
          @media print {
            body {
              padding: 0;
            }
            
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>Customer Account Balance</h1>
          <p><strong>Aging Report</strong></p>
          <p>As of: ${this.formatDate(this.reportDate)}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 25%;">Customer Name</th>
              <th style="width: 15%;">Area</th>
              <th class="text-right" style="width: 12%;">To 30 Days</th>
              <th class="text-right" style="width: 12%;">31 to 60 Days</th>
              <th class="text-right" style="width: 12%;">61 to 90 Days</th>
              <th class="text-right" style="width: 12%;">91+ Days</th>
              <th class="text-right" style="width: 12%;">Total Outstanding</th>
            </tr>
          </thead>
          <tbody>
    `;
        // Add customer rows
        this.filteredBalances.forEach(customer => {
            printContent += `
        <tr>
          <td>${customer.customerName}</td>
          <td>${customer.customerAddress || '-'}</td>
          <td class="text-right">$${customer.days0To30.toFixed(2)}</td>
          <td class="text-right">$${customer.days31To60.toFixed(2)}</td>
          <td class="text-right">$${customer.days61To90.toFixed(2)}</td>
          <td class="text-right">$${customer.days91Plus.toFixed(2)}</td>
          <td class="text-right">$${customer.totalOutstanding.toFixed(2)}</td>
        </tr>
      `;
        });
        // Add totals row
        printContent += `
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="2"><strong>TOTALS</strong></td>
              <td class="text-right"><strong>$${this.totalDays0To30.toFixed(2)}</strong></td>
              <td class="text-right"><strong>$${this.totalDays31To60.toFixed(2)}</strong></td>
              <td class="text-right"><strong>$${this.totalDays61To90.toFixed(2)}</strong></td>
              <td class="text-right"><strong>$${this.totalDays91Plus.toFixed(2)}</strong></td>
              <td class="text-right"><strong>$${this.grandTotal.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <script>
          window.onload = function() {
            window.print();
            // Optionally close the window after printing
            // window.onafterprint = function() { window.close(); };
          };
        </script>
      </body>
      </html>
    `;
        printWindow.document.write(printContent);
        printWindow.document.close();
    }
    exportToExcel() {
        try {
            // Create CSV content
            let csvContent = 'Customer Account Balance - Aging Report\n';
            csvContent += `As of: ${this.formatDate(this.reportDate)}\n\n`;
            // Add headers
            csvContent += 'Customer Name,Area,To 30 Days,31 to 60 Days,61 to 90 Days,91+ Days,Total Outstanding\n';
            // Add customer data
            this.filteredBalances.forEach(customer => {
                csvContent += `"${customer.customerName}",`;
                csvContent += `"${customer.customerAddress || '-'}",`;
                csvContent += `${customer.days0To30.toFixed(2)},`;
                csvContent += `${customer.days31To60.toFixed(2)},`;
                csvContent += `${customer.days61To90.toFixed(2)},`;
                csvContent += `${customer.days91Plus.toFixed(2)},`;
                csvContent += `${customer.totalOutstanding.toFixed(2)}\n`;
            });
            // Add totals row
            csvContent += `TOTALS,,`;
            csvContent += `${this.totalDays0To30.toFixed(2)},`;
            csvContent += `${this.totalDays31To60.toFixed(2)},`;
            csvContent += `${this.totalDays61To90.toFixed(2)},`;
            csvContent += `${this.totalDays91Plus.toFixed(2)},`;
            csvContent += `${this.grandTotal.toFixed(2)}\n`;
            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `customer-balances-${new Date().getTime()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Customer balances exported successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        }
        catch (error) {
            console.error('Error exporting customer balances:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to export customer balances. Please try again.',
                confirmButtonColor: '#3085d6'
            });
        }
    }
    exportToExcelFormat() {
        try {
            // Create HTML table for Excel
            let htmlContent = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            htmlContent += '<head><meta charset="UTF-8">';
            htmlContent += '<style>';
            htmlContent += 'table { border-collapse: collapse; width: 100%; }';
            htmlContent += 'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }';
            htmlContent += 'th { background-color: #4CAF50; color: white; font-weight: bold; }';
            htmlContent += '.text-right { text-align: right; }';
            htmlContent += '.total-row { background-color: #f2f2f2; font-weight: bold; }';
            htmlContent += '</style></head><body>';
            htmlContent += '<h2>Customer Account Balance - Aging Report</h2>';
            htmlContent += `<p>As of: ${this.formatDate(this.reportDate)}</p>`;
            htmlContent += '<table>';
            htmlContent += '<thead><tr>';
            htmlContent += '<th>Customer Name</th>';
            htmlContent += '<th>Area</th>';
            htmlContent += '<th class="text-right">To 30 Days</th>';
            htmlContent += '<th class="text-right">31 to 60 Days</th>';
            htmlContent += '<th class="text-right">61 to 90 Days</th>';
            htmlContent += '<th class="text-right">91+ Days</th>';
            htmlContent += '<th class="text-right">Total Outstanding</th>';
            htmlContent += '</tr></thead><tbody>';
            // Add customer rows
            this.filteredBalances.forEach(customer => {
                htmlContent += '<tr>';
                htmlContent += `<td>${customer.customerName}</td>`;
                htmlContent += `<td>${customer.customerAddress || '-'}</td>`;
                htmlContent += `<td class="text-right">${customer.days0To30.toFixed(2)}</td>`;
                htmlContent += `<td class="text-right">${customer.days31To60.toFixed(2)}</td>`;
                htmlContent += `<td class="text-right">${customer.days61To90.toFixed(2)}</td>`;
                htmlContent += `<td class="text-right">${customer.days91Plus.toFixed(2)}</td>`;
                htmlContent += `<td class="text-right">${customer.totalOutstanding.toFixed(2)}</td>`;
                htmlContent += '</tr>';
            });
            // Add totals row
            htmlContent += '<tr class="total-row">';
            htmlContent += '<td colspan="2">TOTALS</td>';
            htmlContent += `<td class="text-right">${this.totalDays0To30.toFixed(2)}</td>`;
            htmlContent += `<td class="text-right">${this.totalDays31To60.toFixed(2)}</td>`;
            htmlContent += `<td class="text-right">${this.totalDays61To90.toFixed(2)}</td>`;
            htmlContent += `<td class="text-right">${this.totalDays91Plus.toFixed(2)}</td>`;
            htmlContent += `<td class="text-right">${this.grandTotal.toFixed(2)}</td>`;
            htmlContent += '</tr>';
            htmlContent += '</tbody></table></body></html>';
            // Create blob and download
            const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `customer-balances-${new Date().getTime()}.xls`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Customer balances exported to Excel successfully!',
                timer: 2000,
                showConfirmButton: false
            });
        }
        catch (error) {
            console.error('Error exporting to Excel:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to export to Excel. Please try again.',
                confirmButtonColor: '#3085d6'
            });
        }
    }
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).format(date);
    }
    isAdmin() {
        return this.authService.isAdmin();
    }
    getUserRole() {
        return this.currentUser?.role || 'User';
    }
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
    navigateTo(route) {
        this.router.navigate([route]);
    }
};
CustomerBalanceComponent = __decorate([
    Component({
        selector: 'app-customer-balance',
        templateUrl: './customer-balance.component.html',
        styleUrls: ['./customer-balance.component.css']
    })
], CustomerBalanceComponent);
export { CustomerBalanceComponent };
//# sourceMappingURL=customer-balance.component.js.map