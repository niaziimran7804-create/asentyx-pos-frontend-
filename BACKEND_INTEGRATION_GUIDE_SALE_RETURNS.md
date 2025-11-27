# Sale Returns Module - Complete Backend Integration Guide

## 📋 Overview

This document provides complete specifications for implementing the Sale Returns backend APIs to integrate with the Angular frontend. The module supports **two distinct return scenarios** with different workflows and payloads.

---

## 🎯 Return Scenarios

### **Scenario 1: Whole Bill Return**
- Return the **entire invoice** with all products and quantities as-is
- Quick processing for complete order returns
- Single transaction for full refund

### **Scenario 2: Partial Return**
- Return **selected products** from an invoice
- User can specify **custom quantities** for each product
- Flexible product-by-product return processing

---

## 📊 System Requirements

### Date Range Filter
- **CRITICAL**: Both return types must support invoices from the **last 14 days only**
- **No status restriction**: Accept invoices regardless of order status (Pending, Paid, Completed, etc.)
- Filter logic: `invoiceDate >= (Today - 14 days) AND invoiceDate <= Today`

### Invoice Eligibility
```typescript
// Frontend filtering logic (for reference)
const today = new Date();
const fourteenDaysAgo = new Date();
fourteenDaysAgo.setDate(today.getDate() - 14);

// Only invoices within this date range can be returned
invoices.filter(invoice => {
  const invoiceDate = new Date(invoice.invoiceDate);
  return invoiceDate >= fourteenDaysAgo && invoiceDate <= today;
});
```

**Important**: No filtering by order status - both pending and paid orders can be returned within the 14-day window.

---

## 🔌 Required API Endpoints

### 1. Get Last 14 Days Invoices
**Endpoint**: `GET /api/invoices`  
**Purpose**: Retrieve all invoices from the last 14 days for return selection

**Query Parameters**: None (filter on backend)

**Expected Response**:
```json
[
  {
    "invoiceId": 123,
    "invoiceNumber": "INV-2025-001",
    "invoiceDate": "2025-11-20T10:30:00Z",
    "orderId": 456,
    "order": {
      "orderId": 456,
      "customerFullName": "John Doe",
      "customerPhone": "+1234567890",
      "productId": 789,
      "productName": "Product A",
      "productMSRP": 50.00,
      "orderQuantity": 3,
      "totalAmount": 150.00,
      "status": "Paid",
      "orderDate": "2025-11-20T10:00:00Z"
    },
    "totalAmount": 150.00,
    "paidAmount": 150.00,
    "remainingAmount": 0.00
  }
]
```

**Notes**:
- Backend must automatically filter invoices to last 14 days
- Include complete order details in response
- No status filtering - return all invoices within date range

---

### 2. Create Whole Bill Return
**Endpoint**: `POST /api/returns/whole`  
**Purpose**: Process a complete invoice return

**Request Payload**:
```json
{
  "returnType": "whole",
  "invoiceId": 123,
  "orderId": 456,
  "returnReason": "Customer changed mind",
  "refundMethod": "Cash",
  "notes": "Customer preferred different model",
  "totalReturnAmount": 150.00
}
```

**Payload Field Definitions**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `returnType` | string | ✅ Yes | Always "whole" for this endpoint |
| `invoiceId` | number | ✅ Yes | ID of invoice being returned |
| `orderId` | number | ✅ Yes | ID of related order |
| `returnReason` | string | ✅ Yes | Reason for return (min 5 chars) |
| `refundMethod` | string | ✅ Yes | "Cash", "Card", or "Store Credit" |
| `notes` | string | ❌ No | Additional notes (optional) |
| `totalReturnAmount` | number | ✅ Yes | Total refund amount (equals invoice total) |

**Expected Response** (201 Created):
```json
{
  "returnId": 789,
  "returnType": "whole",
  "invoiceId": 123,
  "orderId": 456,
  "returnDate": "2025-11-26T14:30:00Z",
  "returnStatus": "Pending",
  "totalReturnAmount": 150.00,
  "refundMethod": "Cash",
  "returnReason": "Customer changed mind",
  "notes": "Customer preferred different model",
  "customerFullName": "John Doe",
  "processedBy": null,
  "processedDate": null,
  "message": "Whole bill return created successfully"
}
```

**Validation Rules**:
1. ✅ Invoice must exist
2. ✅ Invoice date must be within last 14 days
3. ✅ Order must be linked to invoice
4. ✅ `totalReturnAmount` must equal invoice total
5. ✅ `returnReason` must be at least 5 characters
6. ✅ `refundMethod` must be one of: "Cash", "Card", "Store Credit"
7. ✅ Invoice must not have been fully returned already

**Error Responses**:
```json
// 404 - Invoice not found
{
  "error": "Invoice with ID 123 not found"
}

// 400 - Invoice too old
{
  "error": "Invoice is older than 14 days and cannot be returned"
}

// 400 - Already returned
{
  "error": "Invoice has already been fully returned"
}

// 400 - Invalid amount
{
  "error": "Return amount must equal invoice total for whole returns"
}
```

---

### 3. Create Partial Return
**Endpoint**: `POST /api/returns/partial`  
**Purpose**: Process a partial invoice return with selected products

**Request Payload**:
```json
{
  "returnType": "partial",
  "invoiceId": 123,
  "orderId": 456,
  "returnReason": "Defective items",
  "refundMethod": "Card",
  "notes": "2 items damaged, 1 item wrong size",
  "items": [
    {
      "productId": 789,
      "returnQuantity": 2,
      "returnAmount": 100.00
    },
    {
      "productId": 790,
      "returnQuantity": 1,
      "returnAmount": 25.50
    }
  ],
  "totalReturnAmount": 125.50
}
```

**Payload Field Definitions**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `returnType` | string | ✅ Yes | Always "partial" for this endpoint |
| `invoiceId` | number | ✅ Yes | ID of invoice being returned |
| `orderId` | number | ✅ Yes | ID of related order |
| `returnReason` | string | ✅ Yes | Reason for return (min 5 chars) |
| `refundMethod` | string | ✅ Yes | "Cash", "Card", or "Store Credit" |
| `notes` | string | ❌ No | Additional notes (optional) |
| `items` | array | ✅ Yes | Array of products being returned (min 1 item) |
| `items[].productId` | number | ✅ Yes | ID of product being returned |
| `items[].returnQuantity` | number | ✅ Yes | Quantity to return (must be > 0) |
| `items[].returnAmount` | number | ✅ Yes | Refund for this item (unitPrice × quantity) |
| `totalReturnAmount` | number | ✅ Yes | Sum of all item returnAmounts |

**Expected Response** (201 Created):
```json
{
  "returnId": 790,
  "returnType": "partial",
  "invoiceId": 123,
  "orderId": 456,
  "returnDate": "2025-11-26T14:45:00Z",
  "returnStatus": "Pending",
  "totalReturnAmount": 125.50,
  "refundMethod": "Card",
  "returnReason": "Defective items",
  "notes": "2 items damaged, 1 item wrong size",
  "customerFullName": "John Doe",
  "itemsCount": 2,
  "returnedItems": [
    {
      "productId": 789,
      "productName": "Product A",
      "returnQuantity": 2,
      "returnAmount": 100.00
    },
    {
      "productId": 790,
      "productName": "Product B",
      "returnQuantity": 1,
      "returnAmount": 25.50
    }
  ],
  "processedBy": null,
  "processedDate": null,
  "message": "Partial return created successfully with 2 items"
}
```

**Validation Rules**:
1. ✅ Invoice must exist
2. ✅ Invoice date must be within last 14 days
3. ✅ Order must be linked to invoice
4. ✅ `items` array must contain at least 1 item
5. ✅ Each `returnQuantity` must be > 0
6. ✅ Each `returnQuantity` must not exceed ordered quantity for that product
7. ✅ Each `returnAmount` must equal `(unitPrice × returnQuantity)` ± 0.01 (rounding tolerance)
8. ✅ `totalReturnAmount` must equal sum of all `item.returnAmount` values
9. ✅ All `productId` values must belong to the original order
10. ✅ `returnReason` must be at least 5 characters
11. ✅ `refundMethod` must be one of: "Cash", "Card", "Store Credit"
12. ✅ Check for duplicate returns (same invoice + product combination)

**Error Responses**:
```json
// 404 - Invoice not found
{
  "error": "Invoice with ID 123 not found"
}

// 400 - Invoice too old
{
  "error": "Invoice is older than 14 days and cannot be returned"
}

// 400 - Empty items
{
  "error": "At least one product must be selected for return"
}

// 400 - Quantity exceeded
{
  "error": "Return quantity for product 789 exceeds ordered quantity (ordered: 3, returning: 5)"
}

// 400 - Invalid product
{
  "error": "Product 999 does not belong to this order"
}

// 400 - Amount mismatch
{
  "error": "Total return amount (125.50) does not match sum of item amounts (120.00)"
}

// 409 - Already returned
{
  "error": "Product 789 has already been fully returned for this invoice"
}
```

---

## 📦 Database Schema Requirements

### Returns Table
```sql
CREATE TABLE Returns (
    ReturnId INT PRIMARY KEY IDENTITY(1,1),
    ReturnType NVARCHAR(20) NOT NULL, -- 'whole' or 'partial'
    InvoiceId INT NOT NULL,
    OrderId INT NOT NULL,
    ReturnDate DATETIME NOT NULL DEFAULT GETDATE(),
    ReturnStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending', -- Pending, Approved, Completed, Rejected
    ReturnReason NVARCHAR(500) NOT NULL,
    RefundMethod NVARCHAR(50) NOT NULL, -- Cash, Card, Store Credit
    Notes NVARCHAR(1000),
    TotalReturnAmount DECIMAL(18,2) NOT NULL,
    ProcessedBy INT NULL,
    ProcessedDate DATETIME NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    
    CONSTRAINT FK_Returns_Invoices FOREIGN KEY (InvoiceId) REFERENCES Invoices(InvoiceId),
    CONSTRAINT FK_Returns_Orders FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    CONSTRAINT FK_Returns_ProcessedBy FOREIGN KEY (ProcessedBy) REFERENCES Users(UserId),
    CONSTRAINT CHK_ReturnType CHECK (ReturnType IN ('whole', 'partial')),
    CONSTRAINT CHK_ReturnStatus CHECK (ReturnStatus IN ('Pending', 'Approved', 'Completed', 'Rejected')),
    CONSTRAINT CHK_RefundMethod CHECK (RefundMethod IN ('Cash', 'Card', 'Store Credit'))
);
```

### ReturnItems Table (for Partial Returns)
```sql
CREATE TABLE ReturnItems (
    ReturnItemId INT PRIMARY KEY IDENTITY(1,1),
    ReturnId INT NOT NULL,
    ProductId INT NOT NULL,
    ReturnQuantity INT NOT NULL,
    ReturnAmount DECIMAL(18,2) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_ReturnItems_Returns FOREIGN KEY (ReturnId) REFERENCES Returns(ReturnId) ON DELETE CASCADE,
    CONSTRAINT FK_ReturnItems_Products FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    CONSTRAINT CHK_ReturnQuantity CHECK (ReturnQuantity > 0),
    CONSTRAINT CHK_ReturnAmount CHECK (ReturnAmount >= 0)
);
```

---

## 🔄 Business Logic Requirements

### 1. Whole Bill Return Processing
```csharp
// Pseudocode for backend logic
public async Task<ReturnDto> CreateWholeReturn(WholeReturnRequest request)
{
    // 1. Validate invoice exists
    var invoice = await GetInvoiceById(request.InvoiceId);
    if (invoice == null) throw new NotFoundException("Invoice not found");
    
    // 2. Check 14-day limit
    var daysDifference = (DateTime.Now - invoice.InvoiceDate).TotalDays;
    if (daysDifference > 14) throw new BadRequestException("Invoice is older than 14 days");
    
    // 3. Validate return amount matches invoice total
    if (request.TotalReturnAmount != invoice.TotalAmount)
        throw new BadRequestException("Return amount must equal invoice total");
    
    // 4. Check if already returned
    var existingReturn = await GetReturnByInvoiceId(request.InvoiceId);
    if (existingReturn != null && existingReturn.ReturnType == "whole")
        throw new ConflictException("Invoice already fully returned");
    
    // 5. Create return record
    var return = new Return
    {
        ReturnType = "whole",
        InvoiceId = request.InvoiceId,
        OrderId = request.OrderId,
        ReturnDate = DateTime.Now,
        ReturnStatus = "Pending",
        ReturnReason = request.ReturnReason,
        RefundMethod = request.RefundMethod,
        Notes = request.Notes,
        TotalReturnAmount = request.TotalReturnAmount
    };
    
    await SaveReturn(return);
    
    // 6. Update inventory (restore returned products)
    await RestoreInventoryForWholeOrder(request.OrderId);
    
    // 7. Create accounting entry
    await CreateAccountingEntry(new AccountingEntry
    {
        Type = "Debit",
        Category = "Sales Return - Whole",
        Amount = request.TotalReturnAmount,
        Description = $"Whole bill return for Invoice #{invoice.InvoiceNumber}",
        ReferenceType = "Return",
        ReferenceId = return.ReturnId
    });
    
    return MapToDto(return);
}
```

### 2. Partial Return Processing
```csharp
// Pseudocode for backend logic
public async Task<ReturnDto> CreatePartialReturn(PartialReturnRequest request)
{
    // 1. Validate invoice exists
    var invoice = await GetInvoiceById(request.InvoiceId);
    if (invoice == null) throw new NotFoundException("Invoice not found");
    
    // 2. Check 14-day limit
    var daysDifference = (DateTime.Now - invoice.InvoiceDate).TotalDays;
    if (daysDifference > 14) throw new BadRequestException("Invoice is older than 14 days");
    
    // 3. Validate items array
    if (request.Items.Count == 0)
        throw new BadRequestException("At least one product must be selected");
    
    // 4. Get order details
    var order = await GetOrderWithProducts(request.OrderId);
    
    // 5. Validate each return item
    decimal calculatedTotal = 0;
    foreach (var item in request.Items)
    {
        // Check product belongs to order
        var orderProduct = order.Products.FirstOrDefault(p => p.ProductId == item.ProductId);
        if (orderProduct == null)
            throw new BadRequestException($"Product {item.ProductId} not in order");
        
        // Check quantity limits
        var previouslyReturned = await GetReturnedQuantity(request.InvoiceId, item.ProductId);
        if (item.ReturnQuantity + previouslyReturned > orderProduct.Quantity)
            throw new BadRequestException($"Return quantity exceeds available quantity for product {item.ProductId}");
        
        // Validate amount calculation
        var expectedAmount = orderProduct.UnitPrice * item.ReturnQuantity;
        if (Math.Abs(item.ReturnAmount - expectedAmount) > 0.01m)
            throw new BadRequestException($"Invalid return amount for product {item.ProductId}");
        
        calculatedTotal += item.ReturnAmount;
    }
    
    // 6. Validate total amount
    if (Math.Abs(request.TotalReturnAmount - calculatedTotal) > 0.01m)
        throw new BadRequestException("Total return amount does not match sum of items");
    
    // 7. Create return record
    var return = new Return
    {
        ReturnType = "partial",
        InvoiceId = request.InvoiceId,
        OrderId = request.OrderId,
        ReturnDate = DateTime.Now,
        ReturnStatus = "Pending",
        ReturnReason = request.ReturnReason,
        RefundMethod = request.RefundMethod,
        Notes = request.Notes,
        TotalReturnAmount = request.TotalReturnAmount
    };
    
    await SaveReturn(return);
    
    // 8. Create return items
    foreach (var item in request.Items)
    {
        await SaveReturnItem(new ReturnItem
        {
            ReturnId = return.ReturnId,
            ProductId = item.ProductId,
            ReturnQuantity = item.ReturnQuantity,
            ReturnAmount = item.ReturnAmount
        });
        
        // 9. Update inventory for each product
        await RestoreInventory(item.ProductId, item.ReturnQuantity);
        
        // 10. Create individual accounting entry per product
        await CreateAccountingEntry(new AccountingEntry
        {
            Type = "Debit",
            Category = "Sales Return - Partial",
            Amount = item.ReturnAmount,
            Description = $"Partial return: Product {item.ProductId} - Qty {item.ReturnQuantity}",
            ReferenceType = "ReturnItem",
            ReferenceId = returnItem.ReturnItemId
        });
    }
    
    return MapToDto(return);
}
```

---

## 💰 Accounting Integration

### Entry Types by Return Scenario

#### Whole Bill Return
**Single accounting entry** for the entire return:
```json
{
  "transactionType": "Debit",
  "category": "Sales Return - Whole Bill",
  "amount": 150.00,
  "description": "Full return of Invoice #INV-2025-001",
  "referenceType": "Return",
  "referenceId": 789,
  "date": "2025-11-26T14:30:00Z",
  "metadata": {
    "invoiceId": 123,
    "orderId": 456,
    "returnType": "whole",
    "refundMethod": "Cash"
  }
}
```

#### Partial Return
**Multiple accounting entries**, one per returned product:
```json
[
  {
    "transactionType": "Debit",
    "category": "Sales Return - Partial",
    "amount": 100.00,
    "description": "Partial return: Product A (2 units)",
    "referenceType": "ReturnItem",
    "referenceId": 1,
    "date": "2025-11-26T14:45:00Z",
    "metadata": {
      "returnId": 790,
      "invoiceId": 123,
      "orderId": 456,
      "productId": 789,
      "productName": "Product A",
      "returnQuantity": 2,
      "returnType": "partial"
    }
  },
  {
    "transactionType": "Debit",
    "category": "Sales Return - Partial",
    "amount": 25.50,
    "description": "Partial return: Product B (1 unit)",
    "referenceType": "ReturnItem",
    "referenceId": 2,
    "date": "2025-11-26T14:45:00Z",
    "metadata": {
      "returnId": 790,
      "invoiceId": 123,
      "orderId": 456,
      "productId": 790,
      "productName": "Product B",
      "returnQuantity": 1,
      "returnType": "partial"
    }
  }
]
```

### Chart of Accounts
```
5000 - Revenue
  5100 - Sales Revenue
  5200 - Sales Returns and Allowances
    5210 - Whole Bill Returns
    5220 - Partial Returns

1000 - Assets
  1100 - Current Assets
    1110 - Cash
    1120 - Inventory
```

---

## 🔍 Additional API Endpoints (Already Exists)

### Get All Returns
**Endpoint**: `GET /api/returns`  
**Purpose**: Retrieve all returns for the returns list view

**Expected Response**:
```json
[
  {
    "returnId": 789,
    "returnType": "whole",
    "invoiceId": 123,
    "orderId": 456,
    "returnDate": "2025-11-26T14:30:00Z",
    "returnStatus": "Pending",
    "customerFullName": "John Doe",
    "customerPhone": "+1234567890",
    "productName": "Product A",
    "returnQuantity": 3,
    "returnAmount": 150.00,
    "refundMethod": "Cash",
    "returnReason": "Customer changed mind",
    "notes": "Customer preferred different model",
    "processedByName": null,
    "processedDate": null
  }
]
```

### Get Return Summary
**Endpoint**: `GET /api/returns/summary`  
**Purpose**: Get statistics for dashboard cards

**Expected Response**:
```json
{
  "totalReturns": 45,
  "pendingReturns": 12,
  "approvedReturns": 18,
  "completedReturns": 15,
  "totalReturnAmount": 12500.50,
  "wholeReturnsCount": 20,
  "partialReturnsCount": 25
}
```

### Update Return Status
**Endpoint**: `PUT /api/returns/{id}/status`  
**Purpose**: Admin can approve/reject/complete returns

**Request Payload**:
```json
{
  "returnStatus": "Approved"
}
```

---

## 🧪 Testing Scenarios

### Test Case 1: Whole Bill Return - Happy Path
```http
POST /api/returns/whole
Content-Type: application/json

{
  "returnType": "whole",
  "invoiceId": 123,
  "orderId": 456,
  "returnReason": "Customer not satisfied with product quality",
  "refundMethod": "Cash",
  "notes": "Customer was very polite",
  "totalReturnAmount": 150.00
}

Expected: 201 Created with returnId
```

### Test Case 2: Partial Return - Multiple Products
```http
POST /api/returns/partial
Content-Type: application/json

{
  "returnType": "partial",
  "invoiceId": 124,
  "orderId": 457,
  "returnReason": "Some items defective, keeping the rest",
  "refundMethod": "Card",
  "notes": "Defective units had manufacturing issues",
  "items": [
    {
      "productId": 10,
      "returnQuantity": 2,
      "returnAmount": 60.00
    },
    {
      "productId": 11,
      "returnQuantity": 1,
      "returnAmount": 35.00
    }
  ],
  "totalReturnAmount": 95.00
}

Expected: 201 Created with returnId and itemsCount: 2
```

### Test Case 3: Validation Error - Invoice Too Old
```http
POST /api/returns/whole
Content-Type: application/json

{
  "returnType": "whole",
  "invoiceId": 100,
  "orderId": 400,
  "returnReason": "Changed mind",
  "refundMethod": "Cash",
  "totalReturnAmount": 200.00
}

Expected: 400 Bad Request
{
  "error": "Invoice is older than 14 days and cannot be returned"
}
```

### Test Case 4: Validation Error - Quantity Exceeded
```http
POST /api/returns/partial
Content-Type: application/json

{
  "returnType": "partial",
  "invoiceId": 125,
  "orderId": 458,
  "returnReason": "Returning excess items",
  "refundMethod": "Cash",
  "items": [
    {
      "productId": 20,
      "returnQuantity": 10,
      "returnAmount": 500.00
    }
  ],
  "totalReturnAmount": 500.00
}

Expected: 400 Bad Request
{
  "error": "Return quantity for product 20 exceeds ordered quantity (ordered: 5, returning: 10)"
}
```

### Test Case 5: Duplicate Return Prevention
```http
POST /api/returns/whole
Content-Type: application/json

{
  "returnType": "whole",
  "invoiceId": 123,
  "orderId": 456,
  "returnReason": "Duplicate attempt",
  "refundMethod": "Cash",
  "totalReturnAmount": 150.00
}

Expected: 409 Conflict
{
  "error": "Invoice has already been fully returned"
}
```

---

## 📝 Frontend Service Methods to Add

Add these methods to `return.service.ts`:

```typescript
// Add to return.service.ts
createWholeReturn(payload: WholeReturnPayload): Observable<any> {
  return this.http.post(`${this.baseUrl}/returns/whole`, payload);
}

createPartialReturn(payload: PartialReturnPayload): Observable<any> {
  return this.http.post(`${this.baseUrl}/returns/partial`, payload);
}
```

---

## 🚀 Implementation Checklist

### Backend Tasks
- [ ] Create `/api/returns/whole` POST endpoint
- [ ] Create `/api/returns/partial` POST endpoint
- [ ] Implement 14-day date validation
- [ ] Add quantity validation for partial returns
- [ ] Implement inventory restoration logic
- [ ] Create accounting entries for both scenarios
- [ ] Add duplicate return prevention
- [ ] Update `GET /api/invoices` to return last 14 days only
- [ ] Test all validation rules
- [ ] Test error handling scenarios

### Database Tasks
- [ ] Create `Returns` table with `ReturnType` column
- [ ] Create `ReturnItems` table for partial returns
- [ ] Add indexes on `InvoiceId`, `OrderId`, `ReturnDate`
- [ ] Set up foreign key constraints
- [ ] Add check constraints for enums

### Integration Tasks
- [ ] Update frontend service with new methods
- [ ] Uncomment API calls in returns.component.ts (lines 398-417, 559-578)
- [ ] Test end-to-end whole bill return flow
- [ ] Test end-to-end partial return flow
- [ ] Verify accounting entries are created correctly
- [ ] Test error handling and validation messages

---

## 📞 Support & Questions

If you need clarification on any aspect of this integration:

1. **Date Filtering**: Invoices must be from last 14 days, no status restrictions
2. **Return Types**: Two distinct endpoints for whole vs partial returns
3. **Accounting**: Whole returns = 1 entry, Partial returns = multiple entries
4. **Validation**: Quantity limits per product, amount calculations must match
5. **Inventory**: Both return types restore inventory automatically

---

## 🎯 Success Criteria

The integration is complete when:
- ✅ Users can select invoices from last 14 days
- ✅ Whole bill returns process entire invoice refunds
- ✅ Partial returns allow product-by-product selection
- ✅ All validation rules prevent invalid returns
- ✅ Inventory quantities are restored correctly
- ✅ Accounting entries differentiate between return types
- ✅ Return status workflow (Pending → Approved → Completed) works
- ✅ Error messages guide users to fix issues
- ✅ Returns list displays all return types correctly

---

**Document Version**: 1.0  
**Last Updated**: November 26, 2025  
**Frontend Version**: Angular 17.0.0  
**Compatible Backend**: .NET Core 6.0+, Node.js/Express, Any REST API
