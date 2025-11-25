# Accounting Module API Requirements

## Overview
Create a complete accounting module for the POS system with financial tracking, reporting, and analytics capabilities.

---

## Required Models/Entities

### 1. AccountingEntry
Main transaction records for all financial activities.

**Fields:**
- `entryId` (Primary Key) - Unique identifier
- `entryType` (Enum) - Income, Expense, Sale, Purchase, Payment, Refund
- `amount` (Decimal) - Transaction amount
- `description` (String) - Transaction description
- `paymentMethod` (String, Optional) - Cash, Card, Bank Transfer, Mobile Payment
- `category` (String, Optional) - Transaction category
- `entryDate` (DateTime) - Date of transaction
- `createdBy` (String) - User who created the entry
- `createdAt` (DateTime) - Timestamp of creation
- `updatedAt` (DateTime) - Timestamp of last update

### 2. DailySales
Aggregated daily sales statistics.

**Fields:**
- `date` (Date) - Sales date
- `totalSales` (Decimal) - Total sales amount
- `totalOrders` (Integer) - Number of orders
- `totalExpenses` (Decimal) - Total expenses
- `netProfit` (Decimal) - Calculated profit (sales - expenses)
- `cashSales` (Decimal) - Cash payment total
- `cardSales` (Decimal) - Card payment total
- `averageOrderValue` (Decimal) - Average order amount

### 3. PaymentMethodSummary
Payment method breakdown and analytics.

**Fields:**
- `paymentMethod` (String) - Payment type
- `totalAmount` (Decimal) - Total amount
- `transactionCount` (Integer) - Number of transactions
- `percentage` (Decimal) - Percentage of total

---

## API Endpoints

### 1. Accounting Entries Management

#### Get All Entries
```
GET /api/accounting/entries
```

**Query Parameters:**
- `startDate` (Date, Optional) - Filter from date
- `endDate` (Date, Optional) - Filter to date
- `entryType` (String, Optional) - Filter by entry type
- `paymentMethod` (String, Optional) - Filter by payment method
- `category` (String, Optional) - Filter by category
- `page` (Integer, Optional, Default: 1) - Page number
- `limit` (Integer, Optional, Default: 50) - Items per page

**Response:**
```json
{
  "entries": [
    {
      "entryId": 1,
      "entryType": "Sale",
      "amount": 250.00,
      "description": "Order #1234",
      "paymentMethod": "Cash",
      "category": "Sales",
      "entryDate": "2025-11-25T10:30:00Z",
      "createdBy": "John Doe",
      "createdAt": "2025-11-25T10:30:00Z",
      "updatedAt": "2025-11-25T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  }
}
```

#### Create New Entry
```
POST /api/accounting/entries
```

**Request Body:**
```json
{
  "entryType": "Expense",
  "amount": 500.00,
  "description": "Office supplies",
  "paymentMethod": "Cash",
  "category": "Operations",
  "entryDate": "2025-11-25T10:30:00Z"
}
```

**Response:**
```json
{
  "message": "Accounting entry created successfully",
  "entryId": 123,
  "entry": { /* full entry object */ }
}
```

#### Delete Entry
```
DELETE /api/accounting/entries/{id}
```

**Access:** Admin only

**Response:**
```json
{
  "message": "Accounting entry deleted successfully",
  "entryId": 123
}
```

---

### 2. Financial Summary

#### Get Summary
```
GET /api/accounting/summary
```

**Query Parameters:**
- `startDate` (Date, Optional) - Start of period
- `endDate` (Date, Optional) - End of period

**Response:**
```json
{
  "totalIncome": 125000.00,
  "totalExpenses": 45000.00,
  "netProfit": 80000.00,
  "totalSales": 125000.00,
  "totalPurchases": 35000.00,
  "cashBalance": 80000.00,
  "period": "This Month"
}
```

---

### 3. Sales Analytics

#### Get Daily Sales
```
GET /api/accounting/daily-sales?days={number}
```

**Query Parameters:**
- `days` (Integer, Default: 7) - Number of days to retrieve

**Response:**
```json
[
  {
    "date": "2025-11-25",
    "totalSales": 18500.00,
    "totalOrders": 75,
    "totalExpenses": 6500.00,
    "netProfit": 12000.00,
    "cashSales": 8500.00,
    "cardSales": 10000.00,
    "averageOrderValue": 246.67
  },
  {
    "date": "2025-11-24",
    "totalSales": 22000.00,
    "totalOrders": 88,
    "totalExpenses": 7200.00,
    "netProfit": 14800.00,
    "cashSales": 11000.00,
    "cardSales": 11000.00,
    "averageOrderValue": 250.00
  }
]
```

#### Get Sales Graph Data
```
GET /api/accounting/sales-graph?startDate={date}&endDate={date}
```

**Query Parameters:**
- `startDate` (Date, Required) - Start date
- `endDate` (Date, Required) - End date

**Response:**
```json
{
  "labels": ["Nov 1", "Nov 2", "Nov 3", "Nov 4", "Nov 5"],
  "salesData": [5000.00, 6200.00, 4800.00, 7100.00, 5500.00],
  "expensesData": [2000.00, 1800.00, 2200.00, 2500.00, 1900.00],
  "profitData": [3000.00, 4400.00, 2600.00, 4600.00, 3600.00],
  "ordersData": [45, 62, 38, 71, 55]
}
```

---

### 4. Payment Methods Analytics

#### Get Payment Methods Summary
```
GET /api/accounting/payment-methods
```

**Query Parameters:**
- `startDate` (Date, Optional) - Start of period
- `endDate` (Date, Optional) - End of period

**Response:**
```json
[
  {
    "paymentMethod": "Cash",
    "totalAmount": 45000.00,
    "transactionCount": 250,
    "percentage": 36.0
  },
  {
    "paymentMethod": "Credit Card",
    "totalAmount": 50000.00,
    "transactionCount": 180,
    "percentage": 40.0
  },
  {
    "paymentMethod": "Debit Card",
    "totalAmount": 20000.00,
    "transactionCount": 90,
    "percentage": 16.0
  },
  {
    "paymentMethod": "Mobile Payment",
    "totalAmount": 10000.00,
    "transactionCount": 60,
    "percentage": 8.0
  }
]
```

---

### 5. Product Performance

#### Get Top Products
```
GET /api/accounting/top-products?limit={number}
```

**Query Parameters:**
- `limit` (Integer, Default: 10) - Number of products to return
- `startDate` (Date, Optional) - Start of period
- `endDate` (Date, Optional) - End of period

**Response:**
```json
[
  {
    "productId": 1,
    "productName": "Premium Coffee Beans",
    "totalQuantity": 450,
    "totalRevenue": 13500.00,
    "orderCount": 125
  },
  {
    "productId": 2,
    "productName": "Organic Tea Collection",
    "totalQuantity": 380,
    "totalRevenue": 11400.00,
    "orderCount": 95
  }
]
```

---

### 6. Reports Export

#### Export Accounting Report
```
GET /api/accounting/export?format={csv|pdf}&startDate={date}&endDate={date}
```

**Query Parameters:**
- `format` (String, Required) - Export format: `csv` or `pdf`
- `startDate` (Date, Required) - Start date
- `endDate` (Date, Required) - End date

**Access:** Admin only

**Response:**
- CSV: Returns file download with `Content-Type: text/csv`
- PDF: Returns file download with `Content-Type: application/pdf`

**Headers:**
```
Content-Disposition: attachment; filename="accounting-report-2025-11-25.csv"
```

---

## Implementation Requirements

### Authentication & Authorization
- All endpoints require valid JWT authentication token
- Delete and export endpoints restricted to Admin role only
- Track `createdBy` field using authenticated user information

### Database Considerations
- Use **DECIMAL/MONEY** types for all currency amounts (avoid floating point)
- Add indexes on:
  - `entryDate` for fast date range queries
  - `entryType` for filtering
  - `paymentMethod` for analytics
  - `createdBy` for user tracking
- Consider creating database views for aggregated daily sales data

### Auto-Generation
- Automatically create accounting entries when:
  - Orders are completed → Create "Sale" entry
  - Refunds are processed → Create "Refund" entry
  - Expenses are added → Create "Expense" entry
  - Payments are received → Create "Income" entry

### Validation Rules
- `amount` must be positive number with max 2 decimal places
- `entryType` must be valid enum value
- `entryDate` cannot be future date
- `description` is required (min 3 characters)
- `paymentMethod` required for Sale, Income, and Payment types

### Performance Optimization
- Implement caching for summary data (5-minute cache)
- Use database aggregation functions for calculations
- Paginate large result sets (default 50 items per page)
- Consider background jobs for report generation

### Error Handling
Return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": "Validation failed",
  "message": "Amount must be a positive number",
  "statusCode": 400,
  "timestamp": "2025-11-25T10:30:00Z"
}
```

---

## Database Schema Example

```sql
CREATE TABLE accounting_entries (
    entry_id INT PRIMARY KEY AUTO_INCREMENT,
    entry_type ENUM('Income', 'Expense', 'Sale', 'Purchase', 'Payment', 'Refund') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(500) NOT NULL,
    payment_method VARCHAR(50),
    category VARCHAR(100),
    entry_date DATETIME NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_entry_date (entry_date),
    INDEX idx_entry_type (entry_type),
    INDEX idx_payment_method (payment_method)
);

CREATE TABLE daily_sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_date DATE UNIQUE NOT NULL,
    total_sales DECIMAL(10, 2) DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_expenses DECIMAL(10, 2) DEFAULT 0,
    net_profit DECIMAL(10, 2) DEFAULT 0,
    cash_sales DECIMAL(10, 2) DEFAULT 0,
    card_sales DECIMAL(10, 2) DEFAULT 0,
    average_order_value DECIMAL(10, 2) DEFAULT 0,
    INDEX idx_sale_date (sale_date)
);
```

---

## Testing Requirements

### Unit Tests
- Test all calculation functions (profit, percentages, averages)
- Validate date range filtering
- Test pagination logic
- Verify access control rules

### Integration Tests
- Test complete order flow creating accounting entry
- Verify export functionality (CSV and PDF)
- Test concurrent entry creation
- Validate data aggregation accuracy

### API Tests
- Test all endpoints with valid and invalid data
- Verify authentication and authorization
- Test rate limiting and performance
- Validate response formats

---

## Technology Stack Considerations

Implement using your existing backend framework:

- **Node.js/Express**: Use libraries like `json2csv`, `pdfkit`
- **Python/Django**: Use `django-pandas`, `reportlab`
- **Java/Spring**: Use `Apache POI`, `iText`
- **.NET/ASP.NET**: Use `EPPlus`, `iTextSharp`

---

## Deliverables

1. ✅ Database migration scripts
2. ✅ All API endpoints implemented
3. ✅ Unit and integration tests
4. ✅ API documentation (Swagger/OpenAPI)
5. ✅ Error handling and logging
6. ✅ Authentication and authorization
7. ✅ Export functionality (CSV/PDF)
8. ✅ Performance optimization

---

## Notes

- All monetary values should be stored and returned with 2 decimal precision
- Dates should be in ISO 8601 format
- Follow existing POS system conventions for response structure
- Maintain backward compatibility with existing order system
- Consider time zones for multi-location deployments
