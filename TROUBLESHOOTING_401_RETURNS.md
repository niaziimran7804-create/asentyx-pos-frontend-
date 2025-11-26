# Troubleshooting 401 Unauthorized Error on Returns Endpoints

## 🐛 Error Details

**Error**: `401 Unauthorized` when calling `/api/returns/partial` or `/api/returns/whole`

**Stack Trace**:
```
POST https://localhost:7000/api/returns/partial 401 (Unauthorized)
```

---

## 🔍 Possible Causes

### 1. **Expired or Missing Token** (Most Common)
Your authentication token may have expired or been cleared from localStorage.

**Check:**
```javascript
// Open browser console and run:
localStorage.getItem('token')
// Should return a JWT token string

localStorage.getItem('user')
// Should return user JSON object
```

**Solution:**
- Log out and log back in
- Token will be refreshed with new expiration

### 2. **Backend Authorization Configuration**
The backend endpoint may require specific role permissions.

**Check Backend Controller:**
```csharp
// These endpoints need proper authorization
[HttpPost("whole")]
[Authorize] // or [Authorize(Roles = "Admin,Cashier")]
public async Task<IActionResult> CreateWholeReturn([FromBody] WholeReturnRequest request)

[HttpPost("partial")]
[Authorize] // or [Authorize(Roles = "Admin,Cashier")]
public async Task<IActionResult> CreatePartialReturn([FromBody] PartialReturnRequest request)
```

**Required:**
- Both endpoints must have `[Authorize]` attribute
- User's role must be included in allowed roles
- Token must be valid and not expired

### 3. **CORS or SSL Certificate Issues**
The request might be blocked due to CORS policy or SSL certificate problems.

**Check Browser Console:**
- Look for CORS-related errors
- Check if other API calls (products, orders) are working

### 4. **Interceptor Not Adding Token**
The AuthInterceptor might not be correctly adding the Bearer token.

**Current Interceptor (Already Correct):**
```typescript
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = this.authService.getToken();
  
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next.handle(request);
}
```

---

## ✅ Step-by-Step Troubleshooting

### Step 1: Verify Token Exists
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.getItem('token')`
4. **Expected**: Should return a JWT token string
5. **If null**: You need to log in again

### Step 2: Check Token in Network Request
1. Open DevTools → Network tab
2. Try the partial return again
3. Click on the failed request (`/api/returns/partial`)
4. Go to "Headers" tab
5. Look for "Authorization" header under "Request Headers"
6. **Expected**: `Authorization: Bearer eyJhbGc...`
7. **If missing**: Interceptor issue (but it's configured correctly)

### Step 3: Verify User Role
```javascript
// In browser console:
const user = JSON.parse(localStorage.getItem('user'));
console.log('User Role:', user.role);
// Expected: "Admin", "Cashier", or "Salesman"
```

### Step 4: Test Other Endpoints
Try accessing other features:
- ✅ Products list loads? → Token is valid
- ✅ Orders list loads? → Token is valid
- ✅ Can create orders? → Token is valid
- ❌ Only returns fail? → Backend authorization issue

### Step 5: Check Backend Logs
Look at backend console for errors when the request arrives:
- Token validation errors
- Role authorization failures
- Database connection issues

---

## 🔧 Solutions

### Solution 1: Re-login (Recommended First)
```
1. Click "Logout" in the application
2. Log in again with your credentials
3. Try the partial return again
```

### Solution 2: Backend - Add Authorization to Endpoints
Ensure the backend controller has proper authorization:

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // Add this to the whole controller
public class ReturnsController : ControllerBase
{
    [HttpPost("whole")]
    // [Authorize] // Or add to individual endpoints
    public async Task<IActionResult> CreateWholeReturn([FromBody] WholeReturnRequest request)
    {
        // Check user role if needed
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        
        // Allow Admin and Cashier only
        if (userRole != "Admin" && userRole != "Cashier")
        {
            return Forbid(); // 403
        }
        
        // Process return...
    }
    
    [HttpPost("partial")]
    public async Task<IActionResult> CreatePartialReturn([FromBody] PartialReturnRequest request)
    {
        // Same authorization check
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        
        if (userRole != "Admin" && userRole != "Cashier")
        {
            return Forbid();
        }
        
        // Process return...
    }
}
```

### Solution 3: Backend - Configure JWT Authentication
Ensure JWT authentication is configured in `Program.cs` or `Startup.cs`:

```csharp
// Program.cs (.NET 6+)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };
    });

// Make sure these are in the right order:
app.UseAuthentication(); // MUST come before UseAuthorization
app.UseAuthorization();
```

### Solution 4: Frontend - Clear Cache and Re-login
```
1. Open DevTools → Application tab
2. Clear Storage → Clear site data
3. Close and reopen the application
4. Log in again
5. Try partial return
```

---

## 🧪 Testing

### Test 1: Token Validity
```javascript
// In browser console
const token = localStorage.getItem('token');
if (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    console.log('Token Payload:', payload);
    console.log('Token Expires:', new Date(payload.exp * 1000));
    console.log('Is Expired:', Date.now() >= payload.exp * 1000);
}
```

### Test 2: Manual API Call
```javascript
// In browser console
const token = localStorage.getItem('token');
fetch('https://localhost:7000/api/returns/partial', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        returnType: 'partial',
        invoiceId: 20,
        orderId: 31,
        returnReason: 'Testing',
        refundMethod: 'Cash',
        items: [],
        totalReturnAmount: 0
    })
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

---

## 📝 Frontend Updates Made

### Enhanced Error Handling
The error handler now provides detailed information for 401 errors:

```typescript
handleReturnError(error: any): void {
    // Handle 401 Unauthorized
    if (error.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        html: `Your session may have expired or you don't have permission...`,
        confirmButtonText: 'Understood',
        footer: '<a href="/login">Go to Login Page</a>'
      });
      return;
    }
    // ... other error handling
}
```

### Debug Logging
Added authentication status logging before API calls:

```typescript
console.log('Auth Status - Token exists:', !!token, 'User:', currentUser?.email, 'Role:', currentUser?.role);
```

---

## 🎯 Expected Behavior After Fix

1. **User logs in** → Token stored in localStorage
2. **User navigates to Returns** → Token sent with every request
3. **User submits return** → Backend validates token and role
4. **Return processed** → Success response returned
5. **UI updates** → Shows success message and refreshes list

---

## 📞 Quick Checklist

- [ ] Token exists in localStorage
- [ ] Token not expired (check exp claim)
- [ ] User has appropriate role (Admin or Cashier)
- [ ] Backend has `[Authorize]` on endpoints
- [ ] Backend JWT authentication configured
- [ ] `UseAuthentication()` called before `UseAuthorization()`
- [ ] CORS policy allows requests from frontend origin
- [ ] SSL certificate valid (or development exception configured)

---

**Document Created**: November 26, 2025  
**Issue**: 401 Unauthorized on `/api/returns/partial`  
**Status**: Frontend updated with better error handling  
**Next Steps**: Check backend authorization configuration
