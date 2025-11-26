# Sales Graph API - Backend Implementation Guide

## 📊 Overview

This document specifies the API endpoint required for the Dashboard Sales Trend Chart. The frontend calls this endpoint to display real-time sales and profit data.

---

## 🔌 Required API Endpoint

### Get Sales Graph Data
**Endpoint**: `GET /api/accounting/sales-graph`  
**Purpose**: Retrieve daily sales, expenses, and profit data for chart visualization

---

## 📥 Request Parameters

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string (ISO 8601) | ✅ Yes | Start date for data range |
| `endDate` | string (ISO 8601) | ✅ Yes | End date for data range |

### Example Request
```http
GET /api/accounting/sales-graph?startDate=2025-10-28T00:00:00Z&endDate=2025-11-26T23:59:59Z
```

**Frontend sends last 30 days by default:**
```typescript
const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 29); // Last 30 days
```

---

## 📤 Response Format

### Response Body (JSON)

```json
{
  "labels": [
    "Oct 28",
    "Oct 29",
    "Oct 30",
    "...",
    "Nov 25",
    "Nov 26"
  ],
  "salesData": [
    1250.50,
    1890.75,
    2150.00,
    0,
    3200.50,
    2850.00
  ],
  "expensesData": [
    450.00,
    680.25,
    720.00,
    0,
    1100.00,
    950.00
  ],
  "profitData": [
    800.50,
    1210.50,
    1430.00,
    0,
    2100.50,
    1900.00
  ],
  "ordersData": [
    15,
    22,
    28,
    0,
    35,
    30
  ]
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `labels` | string[] | Array of date labels for X-axis (format: "MMM DD") |
| `salesData` | number[] | Total sales amount for each day |
| `expensesData` | number[] | Total expenses for each day |
| `profitData` | number[] | Net profit for each day (sales - expenses) |
| `ordersData` | number[] | Number of orders for each day |

**Important Notes:**
- All arrays **must have the same length**
- Array indices correspond to the same date (e.g., `salesData[0]` is sales for `labels[0]`)
- If no data for a date, use `0` instead of omitting the entry
- `profitData[i] = salesData[i] - expensesData[i]`

---

## 🔄 Backend Implementation Logic

### Step 1: Parse Date Range
```csharp
[HttpGet("sales-graph")]
public async Task<ActionResult<SalesGraphDto>> GetSalesGraph(
    [FromQuery] DateTime startDate, 
    [FromQuery] DateTime endDate)
{
    // Validate date range
    if (startDate > endDate)
        return BadRequest(new { error = "startDate cannot be after endDate" });
    
    if ((endDate - startDate).TotalDays > 90)
        return BadRequest(new { error = "Date range cannot exceed 90 days" });
```

### Step 2: Generate Date Range
```csharp
    var dateRange = new List<DateTime>();
    for (var date = startDate.Date; date <= endDate.Date; date = date.AddDays(1))
    {
        dateRange.Add(date);
    }
```

### Step 3: Query Sales Data
```csharp
    // Get all orders within date range
    var orders = await _context.Orders
        .Include(o => o.Invoice)
        .Where(o => o.Date >= startDate && o.Date <= endDate)
        .ToListAsync();
    
    // Get all expenses within date range
    var expenses = await _context.AccountingEntries
        .Where(e => e.EntryType == "Expense" && 
                    e.EntryDate >= startDate && 
                    e.EntryDate <= endDate)
        .ToListAsync();
```

### Step 4: Aggregate Data by Day
```csharp
    var salesByDay = orders
        .GroupBy(o => o.Date.Date)
        .ToDictionary(
            g => g.Key,
            g => g.Sum(o => o.TotalAmount)
        );
    
    var expensesByDay = expenses
        .GroupBy(e => e.EntryDate.Date)
        .ToDictionary(
            g => g.Key,
            g => g.Sum(e => e.Amount)
        );
    
    var orderCountByDay = orders
        .GroupBy(o => o.Date.Date)
        .ToDictionary(
            g => g.Key,
            g => g.Count()
        );
```

### Step 5: Build Response Arrays
```csharp
    var result = new SalesGraphDto
    {
        Labels = new List<string>(),
        SalesData = new List<decimal>(),
        ExpensesData = new List<decimal>(),
        ProfitData = new List<decimal>(),
        OrdersData = new List<int>()
    };
    
    foreach (var date in dateRange)
    {
        // Format date label
        result.Labels.Add(date.ToString("MMM dd"));
        
        // Get sales for this day (0 if no sales)
        var dailySales = salesByDay.ContainsKey(date) ? salesByDay[date] : 0;
        result.SalesData.Add(dailySales);
        
        // Get expenses for this day (0 if no expenses)
        var dailyExpenses = expensesByDay.ContainsKey(date) ? expensesByDay[date] : 0;
        result.ExpensesData.Add(dailyExpenses);
        
        // Calculate profit
        result.ProfitData.Add(dailySales - dailyExpenses);
        
        // Get order count for this day (0 if no orders)
        var dailyOrders = orderCountByDay.ContainsKey(date) ? orderCountByDay[date] : 0;
        result.OrdersData.Add(dailyOrders);
    }
    
    return Ok(result);
}
```

---

## 📦 Backend DTO Model

### C# Model
```csharp
public class SalesGraphDto
{
    public List<string> Labels { get; set; } = new List<string>();
    public List<decimal> SalesData { get; set; } = new List<decimal>();
    public List<decimal> ExpensesData { get; set; } = new List<decimal>();
    public List<decimal> ProfitData { get; set; } = new List<decimal>();
    public List<int> OrdersData { get; set; } = new List<int>();
}
```

---

## 🧪 Testing Examples

### Test Case 1: Happy Path (Last 7 Days)
```http
GET /api/accounting/sales-graph?startDate=2025-11-20T00:00:00Z&endDate=2025-11-26T23:59:59Z

Expected Response:
{
  "labels": ["Nov 20", "Nov 21", "Nov 22", "Nov 23", "Nov 24", "Nov 25", "Nov 26"],
  "salesData": [1500.00, 1800.00, 1650.00, 2200.00, 1900.00, 2100.00, 2300.00],
  "expensesData": [500.00, 600.00, 550.00, 700.00, 650.00, 680.00, 750.00],
  "profitData": [1000.00, 1200.00, 1100.00, 1500.00, 1250.00, 1420.00, 1550.00],
  "ordersData": [18, 22, 20, 28, 24, 26, 30]
}
```

### Test Case 2: No Data Available
```http
GET /api/accounting/sales-graph?startDate=2024-01-01T00:00:00Z&endDate=2024-01-03T23:59:59Z

Expected Response:
{
  "labels": ["Jan 01", "Jan 02", "Jan 03"],
  "salesData": [0, 0, 0],
  "expensesData": [0, 0, 0],
  "profitData": [0, 0, 0],
  "ordersData": [0, 0, 0]
}
```

### Test Case 3: Validation Error
```http
GET /api/accounting/sales-graph?startDate=2025-11-26T00:00:00Z&endDate=2025-11-20T23:59:59Z

Expected Response (400 Bad Request):
{
  "error": "startDate cannot be after endDate"
}
```

---

## 📋 Data Sources

### For `salesData`:
```sql
SELECT 
    CAST(o.Date AS DATE) as OrderDate,
    SUM(o.TotalAmount) as DailySales
FROM Orders o
WHERE o.Date >= @startDate AND o.Date <= @endDate
GROUP BY CAST(o.Date AS DATE)
ORDER BY OrderDate;
```

### For `expensesData`:
```sql
SELECT 
    CAST(ae.EntryDate AS DATE) as ExpenseDate,
    SUM(ae.Amount) as DailyExpenses
FROM AccountingEntries ae
WHERE ae.EntryType = 'Expense'
  AND ae.EntryDate >= @startDate 
  AND ae.EntryDate <= @endDate
GROUP BY CAST(ae.EntryDate AS DATE)
ORDER BY ExpenseDate;
```

### For `ordersData`:
```sql
SELECT 
    CAST(o.Date AS DATE) as OrderDate,
    COUNT(*) as OrderCount
FROM Orders o
WHERE o.Date >= @startDate AND o.Date <= @endDate
GROUP BY CAST(o.Date AS DATE)
ORDER BY OrderDate;
```

---

## ⚠️ Important Requirements

1. **Array Length Consistency**: All arrays must have **exactly the same length** equal to the number of days in the date range
2. **Date Coverage**: Include **every day** in the range, even if sales/expenses are zero
3. **Date Format**: Labels must be formatted as `"MMM DD"` (e.g., "Nov 26", "Dec 01")
4. **Decimal Precision**: Sales and expenses should be decimal/float, not integers
5. **Profit Calculation**: `profitData[i] = salesData[i] - expensesData[i]` for each index
6. **Time Zone**: Use UTC for consistency or match your system's timezone

---

## 🎯 Frontend Usage

The frontend will:
- Call this endpoint when dashboard loads
- Display Sales (purple line) and Profit (green line) on the chart
- Format Y-axis with currency symbols ($)
- Show date labels on X-axis
- Enable toolbar for zoom/pan/download

**Chart Configuration:**
- Sales line: Purple (#667eea)
- Profit line: Green (#48bb78)
- Smooth curves with 3px width
- Tooltips show formatted currency

---

## ✅ Validation Checklist

Backend implementation must:
- [ ] Accept `startDate` and `endDate` as query parameters
- [ ] Return data in exact JSON format specified above
- [ ] Include all 5 arrays: labels, salesData, expensesData, profitData, ordersData
- [ ] Ensure all arrays have equal length
- [ ] Include zero values for days with no data (don't skip days)
- [ ] Format date labels as "MMM DD"
- [ ] Calculate profit correctly (sales - expenses)
- [ ] Return 200 OK on success
- [ ] Return 400 Bad Request for invalid date ranges
- [ ] Handle empty data gracefully (return arrays of zeros)

---

**Document Version**: 1.0  
**Last Updated**: November 26, 2025  
**Frontend Compatibility**: Angular 17.0.0  
**API Base URL**: https://localhost:7000/api/accounting
