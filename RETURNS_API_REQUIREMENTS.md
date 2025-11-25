# Purchase Returns API Requirements

## Overview
This document specifies the API endpoints required for the Purchase Returns Management System in the POS application.

## Base URL
```
https://localhost:7000/api/returns
```

---

## Data Models

### PurchaseReturnDto
```csharp
public class PurchaseReturnDto
{
    public int ReturnId { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string? ProductName { get; set; }
    public int ReturnQuantity { get; set; }
    public decimal ReturnAmount { get; set; }
    public string ReturnReason { get; set; }
    public string ReturnStatus { get; set; } // "Pending", "Approved", "Rejected", "Completed"
    public string? CustomerFullName { get; set; }
    public string? CustomerPhone { get; set; }
    public DateTime ReturnDate { get; set; }
    public int? ProcessedBy { get; set; }
    public string? ProcessedByName { get; set; }
    public DateTime? ProcessedDate { get; set; }
    public string RefundMethod { get; set; } // "Cash", "Card", "Store Credit"
    public string? Notes { get; set; }
}
```

### CreatePurchaseReturnDto
```csharp
public class CreatePurchaseReturnDto
{
    [Required]
    public int OrderId { get; set; }
    
    [Required]
    public int ProductId { get; set; }
    
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Return quantity must be at least 1")]
    public int ReturnQuantity { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Return amount must be greater than 0")]
    public decimal ReturnAmount { get; set; }
    
    [Required]
    [StringLength(500, ErrorMessage = "Return reason cannot exceed 500 characters")]
    public string ReturnReason { get; set; }
    
    [Required]
    public string RefundMethod { get; set; } // "Cash", "Card", "Store Credit"
    
    [StringLength(1000)]
    public string? Notes { get; set; }
}
```

### UpdateReturnStatusDto
```csharp
public class UpdateReturnStatusDto
{
    [Required]
    public string ReturnStatus { get; set; } // "Pending", "Approved", "Rejected", "Completed"
    
    [StringLength(1000)]
    public string? Notes { get; set; }
}
```

### ReturnFilterDto
```csharp
public class ReturnFilterDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Status { get; set; }
    public int? CustomerId { get; set; }
    public int? ProductId { get; set; }
}
```

### ReturnSummaryDto
```csharp
public class ReturnSummaryDto
{
    public int TotalReturns { get; set; }
    public int PendingReturns { get; set; }
    public int ApprovedReturns { get; set; }
    public int CompletedReturns { get; set; }
    public int RejectedReturns { get; set; }
    public decimal TotalReturnAmount { get; set; }
}
```

---

## API Endpoints

### 1. Get All Returns
**Endpoint:** `GET /api/returns`

**Description:** Retrieve all purchase returns

**Authorization:** Required (Any authenticated user)

**Response:** `200 OK`
```json
[
  {
    "returnId": 1,
    "orderId": 123,
    "productId": 45,
    "productName": "Laptop Dell XPS 15",
    "returnQuantity": 1,
    "returnAmount": 1299.99,
    "returnReason": "Customer received wrong color",
    "returnStatus": "Pending",
    "customerFullName": "John Doe",
    "customerPhone": "+1234567890",
    "returnDate": "2025-11-26T10:30:00Z",
    "processedBy": null,
    "processedByName": null,
    "processedDate": null,
    "refundMethod": "Card",
    "notes": "Customer wants black instead of silver"
  }
]
```

---

### 2. Get Return by ID
**Endpoint:** `GET /api/returns/{id}`

**Description:** Retrieve a specific return by ID

**Authorization:** Required (Any authenticated user)

**Parameters:**
- `id` (path) - Return ID

**Response:** `200 OK`
```json
{
  "returnId": 1,
  "orderId": 123,
  "productId": 45,
  "productName": "Laptop Dell XPS 15",
  "returnQuantity": 1,
  "returnAmount": 1299.99,
  "returnReason": "Customer received wrong color",
  "returnStatus": "Approved",
  "customerFullName": "John Doe",
  "customerPhone": "+1234567890",
  "returnDate": "2025-11-26T10:30:00Z",
  "processedBy": 5,
  "processedByName": "Admin User",
  "processedDate": "2025-11-26T14:15:00Z",
  "refundMethod": "Card",
  "notes": "Customer wants black instead of silver"
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Return not found"
}
```

---

### 3. Create Purchase Return
**Endpoint:** `POST /api/returns`

**Description:** Create a new purchase return request

**Authorization:** Required (Any authenticated user)

**Request Body:**
```json
{
  "orderId": 123,
  "productId": 45,
  "returnQuantity": 1,
  "returnAmount": 1299.99,
  "returnReason": "Customer received wrong color",
  "refundMethod": "Card",
  "notes": "Customer wants black instead of silver"
}
```

**Response:** `201 Created`
```json
{
  "returnId": 1,
  "orderId": 123,
  "productId": 45,
  "productName": "Laptop Dell XPS 15",
  "returnQuantity": 1,
  "returnAmount": 1299.99,
  "returnReason": "Customer received wrong color",
  "returnStatus": "Pending",
  "customerFullName": "John Doe",
  "customerPhone": "+1234567890",
  "returnDate": "2025-11-26T10:30:00Z",
  "processedBy": null,
  "processedByName": null,
  "processedDate": null,
  "refundMethod": "Card",
  "notes": "Customer wants black instead of silver"
}
```

**Validation Rules:**
1. Order must exist and be in "Paid" status
2. Return quantity cannot exceed order quantity
3. Return amount must be positive
4. Return reason is required
5. Refund method must be one of: "Cash", "Card", "Store Credit"

**Error Responses:**

`400 Bad Request` - Validation failure
```json
{
  "message": "Return quantity cannot exceed order quantity",
  "errors": {
    "returnQuantity": ["Cannot return more items than ordered"]
  }
}
```

`404 Not Found` - Order not found
```json
{
  "message": "Order not found or not eligible for return"
}
```

---

### 4. Update Return Status
**Endpoint:** `PUT /api/returns/{id}/status`

**Description:** Update the status of a return (Admin only)

**Authorization:** Required (Admin role)

**Parameters:**
- `id` (path) - Return ID

**Request Body:**
```json
{
  "returnStatus": "Approved",
  "notes": "Return approved, processing refund"
}
```

**Response:** `200 OK`
```json
{
  "message": "Return status updated successfully",
  "returnId": 1,
  "newStatus": "Approved"
}
```

**Valid Status Transitions:**
- Pending → Approved
- Pending → Rejected
- Approved → Completed
- Approved → Rejected (with reason)

**Error Responses:**

`400 Bad Request` - Invalid status transition
```json
{
  "message": "Invalid status transition",
  "currentStatus": "Completed",
  "attemptedStatus": "Pending"
}
```

`403 Forbidden` - Insufficient permissions
```json
{
  "message": "Only administrators can update return status"
}
```

`404 Not Found`
```json
{
  "message": "Return not found"
}
```

---

### 5. Get Filtered Returns
**Endpoint:** `GET /api/returns/filter`

**Description:** Get returns with filters

**Authorization:** Required (Any authenticated user)

**Query Parameters:**
- `startDate` (optional) - Filter returns from this date (ISO 8601 format)
- `endDate` (optional) - Filter returns until this date (ISO 8601 format)
- `status` (optional) - Filter by status ("Pending", "Approved", "Completed", "Rejected")
- `productId` (optional) - Filter by product ID
- `customerId` (optional) - Filter by customer ID

**Example Request:**
```
GET /api/returns/filter?startDate=2025-11-01&endDate=2025-11-30&status=Pending
```

**Response:** `200 OK`
```json
[
  {
    "returnId": 1,
    "orderId": 123,
    "productId": 45,
    "productName": "Laptop Dell XPS 15",
    "returnQuantity": 1,
    "returnAmount": 1299.99,
    "returnReason": "Customer received wrong color",
    "returnStatus": "Pending",
    "customerFullName": "John Doe",
    "customerPhone": "+1234567890",
    "returnDate": "2025-11-26T10:30:00Z",
    "processedBy": null,
    "processedByName": null,
    "processedDate": null,
    "refundMethod": "Card",
    "notes": "Customer wants black instead of silver"
  }
]
```

---

### 6. Get Return Summary
**Endpoint:** `GET /api/returns/summary`

**Description:** Get summary statistics for returns

**Authorization:** Required (Any authenticated user)

**Response:** `200 OK`
```json
{
  "totalReturns": 45,
  "pendingReturns": 12,
  "approvedReturns": 8,
  "completedReturns": 20,
  "rejectedReturns": 5,
  "totalReturnAmount": 15678.50
}
```

---

### 7. Delete Return
**Endpoint:** `DELETE /api/returns/{id}`

**Description:** Delete a return (Admin only, only for Pending or Rejected returns)

**Authorization:** Required (Admin role)

**Parameters:**
- `id` (path) - Return ID

**Response:** `204 No Content`

**Error Responses:**

`400 Bad Request` - Cannot delete completed/approved returns
```json
{
  "message": "Cannot delete returns with status: Completed"
}
```

`403 Forbidden`
```json
{
  "message": "Only administrators can delete returns"
}
```

`404 Not Found`
```json
{
  "message": "Return not found"
}
```

---

## Business Logic Requirements

### 1. Return Creation
- Only orders with status "Paid" can have returns created
- Return quantity must not exceed order quantity
- Return amount should be calculated proportionally based on quantity
- Automatically set return status to "Pending" on creation
- Capture current date/time as returnDate
- Extract customer information from the order

### 2. Return Processing Workflow
1. **Pending State:**
   - Initial state when return is created
   - Can be approved or rejected by admin

2. **Approved State:**
   - Admin has approved the return
   - Can be completed (refund processed) or rejected (if issues found)

3. **Completed State:**
   - Refund has been processed
   - Should update inventory (increase product stock by return quantity)
   - Record processedBy and processedDate
   - Final state - no further changes allowed

4. **Rejected State:**
   - Return request denied
   - Record reason in notes
   - Final state - no further changes allowed

### 3. Inventory Impact
When return status changes to "Completed":
- Increase product stock by returnQuantity
- Update product.productUnitStock in Products table

### 4. Accounting Integration
When return is completed:
- Create accounting entry with type "Refund"
- Record refund amount as expense
- Link to order and return IDs

### 5. Authorization Rules
- **Any authenticated user:** Can create returns, view returns
- **Admin only:** Can approve, reject, complete, or delete returns

### 6. Notifications (Optional Enhancement)
- Notify customer when return status changes
- Notify admin when new return is created
- Email/SMS notifications based on customer preferences

---

## Database Schema Suggestions

### Returns Table
```sql
CREATE TABLE Returns (
    ReturnId INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    ReturnQuantity INT NOT NULL,
    ReturnAmount DECIMAL(18,2) NOT NULL,
    ReturnReason NVARCHAR(500) NOT NULL,
    ReturnStatus NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    ReturnDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    ProcessedBy INT NULL,
    ProcessedDate DATETIME2 NULL,
    RefundMethod NVARCHAR(50) NOT NULL,
    Notes NVARCHAR(1000) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_Returns_Orders FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    CONSTRAINT FK_Returns_Products FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    CONSTRAINT FK_Returns_ProcessedBy FOREIGN KEY (ProcessedBy) REFERENCES Users(Id),
    CONSTRAINT CHK_Returns_Status CHECK (ReturnStatus IN ('Pending', 'Approved', 'Rejected', 'Completed')),
    CONSTRAINT CHK_Returns_RefundMethod CHECK (RefundMethod IN ('Cash', 'Card', 'Store Credit')),
    CONSTRAINT CHK_Returns_Quantity CHECK (ReturnQuantity > 0),
    CONSTRAINT CHK_Returns_Amount CHECK (ReturnAmount > 0)
);

CREATE INDEX IX_Returns_OrderId ON Returns(OrderId);
CREATE INDEX IX_Returns_Status ON Returns(ReturnStatus);
CREATE INDEX IX_Returns_Date ON Returns(ReturnDate);
```

---

## Testing Scenarios

### Test Case 1: Create Return
1. Create a paid order
2. Submit return request with valid data
3. Verify return is created with "Pending" status
4. Verify customer information is captured

### Test Case 2: Approve Return
1. Create a pending return
2. Admin approves the return
3. Verify status changes to "Approved"
4. Verify processedBy and processedDate are set

### Test Case 3: Complete Return with Inventory Update
1. Create and approve a return
2. Complete the return
3. Verify product stock is increased
4. Verify accounting entry is created
5. Verify status cannot be changed from "Completed"

### Test Case 4: Reject Return
1. Create a pending return
2. Admin rejects with reason
3. Verify status is "Rejected"
4. Verify notes contain rejection reason

### Test Case 5: Validation - Exceed Order Quantity
1. Attempt to create return with quantity > order quantity
2. Verify 400 Bad Request is returned
3. Verify appropriate error message

### Test Case 6: Authorization
1. Non-admin user attempts to approve return
2. Verify 403 Forbidden is returned
3. Admin user can perform all operations

### Test Case 7: Filter Returns
1. Create returns with various statuses and dates
2. Filter by status = "Pending"
3. Verify only pending returns are returned
4. Filter by date range
5. Verify only returns within range are returned

---

## Error Handling

All endpoints should return consistent error responses:

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": {
    "fieldName": ["Error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred processing your request",
  "details": "Error details for debugging (only in development)"
}
```

---

## Notes for Backend Implementation

1. **Transaction Management:** Use database transactions when updating return status to "Completed" to ensure inventory updates and accounting entries are atomic

2. **Audit Trail:** Consider logging all status changes for compliance and troubleshooting

3. **Validation:** Validate that orders are eligible for returns (not older than X days, order status is "Paid", etc.)

4. **Concurrency:** Implement optimistic concurrency control to prevent race conditions when multiple users access the same return

5. **Performance:** Add database indexes on frequently queried columns (OrderId, ReturnStatus, ReturnDate)

6. **Security:** Always validate user permissions before allowing status updates or deletions

7. **Data Integrity:** Ensure foreign key constraints are properly enforced in the database
