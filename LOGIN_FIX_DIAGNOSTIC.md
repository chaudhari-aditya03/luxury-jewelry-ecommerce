# 🔍 Login/Registration Issue - Diagnostic & Fix

## ✅ Changes Applied

### 1. **Fixed Database Name**
- Changed from `jewelry_ecommerce` → `jewelry_shop`
- File: `application.properties`

### 2. **Fixed CORS Configuration**
- Removed property file dependencies
- Direct configuration for `localhost:5173` and `localhost:3000`
- File: `CorsConfig.java`

```java
configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
configuration.setAllowedHeaders(List.of("*"));
configuration.setAllowCredentials(true);
```

### 3. **Fixed Security Configuration (CRITICAL)**
- Added explicit `HttpMethod.OPTIONS` permission
- Changed CORS lambda from `.cors(cors -> cors.configure(http))` to `.cors(cors -> {})`
- File: `SecurityConfig.java`

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // ✅ PREFLIGHT
    .requestMatchers("/api/auth/**").permitAll()
    // ... rest
)
```

## 🚀 How to Test

### Step 1: Restart Backend
```powershell
# Navigate to backend
cd D:\clientsProjects\E-Commerce_Website\backend

# Clean and rebuild
mvn clean package -DskipTests

# Start the backend
mvn spring-boot:run
```

### Step 2: Verify Console Output
Look for these messages:
```
🔄 Starting data initialization...
✅ Admin user created: admin@gmail.com (or "already exists")
✅ Regular user created: aditya@gmail.com (or "already exists")
✅ Data initialization completed successfully!
🚀 Jewelry E-Commerce Backend Started Successfully!
```

### Step 3: Test with Browser Console

Open http://localhost:5173/login and open Developer Tools (F12). Try this in the Console:

```javascript
// Test Login
fetch("http://localhost:8080/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include",
  body: JSON.stringify({
    email: "aditya@gmail.com",
    password: "aditya@2005"
  })
})
.then(res => res.json())
.then(data => console.log("SUCCESS:", data))
.catch(err => console.error("ERROR:", err));
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 2,
      "fullName": "Aditya Kumar",
      "email": "aditya@gmail.com",
      "role": "USER",
      "isActive": true
    }
  }
}
```

### Step 4: Test Admin Login
```javascript
fetch("http://localhost:8080/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: "admin@gmail.com",
    password: "admin@2005"
  })
})
.then(res => res.json())
.then(data => console.log("ADMIN LOGIN:", data));
```

### Step 5: Test Registration
```javascript
fetch("http://localhost:8080/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    fullName: "Test User New",
    email: "testuser@example.com",
    password: "password123",
    phone: "9876543210"
  })
})
.then(res => res.json())
.then(data => console.log("REGISTRATION:", data));
```

### Step 6: Test with UI
1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: `aditya@gmail.com`
   - Password: `aditya@2005`
3. Click "Sign In"
4. Should redirect to `/account` page

## 🐛 Troubleshooting

### Check Backend Logs
When you try to login, backend should show:
```
2026-02-10 XX:XX:XX - User login attempt for email: aditya@gmail.com
2026-02-10 XX:XX:XX - User logged in successfully: aditya@gmail.com
```

### Check Network Tab in Browser
1. Open Developer Tools (F12)
2. Go to "Network" tab
3. Try to login
4. Click on the `login` request

**Check this:**
- Status: Should be `200 OK` (not 401, 403, or 500)
- Response Headers: Should include `Access-Control-Allow-Origin: http://localhost:5173`
- Request Headers: Should include `Content-Type: application/json`
- Response: Should have JSON with `success: true`

### Common Issues & Solutions

#### Issue: 401 Unauthorized
**Cause**: Wrong credentials
**Solution**: Use exact credentials:
- `aditya@gmail.com` / `aditya@2005`
- `admin@gmail.com` / `admin@2005`

#### Issue: CORS Error in Browser Console
**Example**: `Access to fetch has been blocked by CORS policy`
**Solution**: 
1. Verify backend is restarted after config changes
2. Check backend logs for CORS errors
3. Ensure frontend is on `localhost:5173`

#### Issue: OPTIONS request returns 403
**Cause**: OPTIONS not permitted in security config
**Solution**: Already fixed - `requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()`

#### Issue: 500 Internal Server Error
**Cause**: Database connection or backend error
**Solution**: Check backend console for stack trace:
```powershell
# Check if MySQL is running
Get-Service -Name MySQL*

# If stopped, start it
Start-Service -Name MySQL80
```

#### Issue: Empty response or network error
**Cause**: Backend not running
**Solution**: 
```powershell
cd backend
mvn spring-boot:run
```

#### Issue: "Email is already registered"
**Cause**: User already exists in database
**Solution**: 
- Use login instead of registration
- Or use different email for new registration

#### Issue: Frontend shows "undefined" or null user
**Cause**: Response structure mismatch
**Solution**: Check AuthContext.jsx - it should parse `response.data.data`:
```javascript
const authData = response.data.data;
localStorage.setItem('authToken', authData.token);
localStorage.setItem('authUser', JSON.stringify(authData.user));
```

## 🔍 Verify Database Data

```sql
-- Connect to MySQL
mysql -u root -p

-- Use correct database
USE jewelry_shop;

-- Check users exist
SELECT id, full_name, email, role, is_active 
FROM users;

-- Expected output:
-- id | full_name    | email              | role  | is_active
-- 1  | Admin User   | admin@gmail.com    | ADMIN | 1
-- 2  | Aditya Kumar | aditya@gmail.com   | USER  | 1

-- Check products
SELECT id, name, price, discount_price 
FROM products 
LIMIT 5;
```

## 📋 Pre-Start Checklist

Before testing, ensure:
- [ ] MySQL service is running
- [ ] Database `jewelry_shop` exists (auto-created on first run)
- [ ] Backend is restarted after config changes
- [ ] Frontend is running on port 5173
- [ ] No firewall/antivirus blocking ports 8080 or 5173
- [ ] Browser cache cleared (Ctrl + Shift + Delete)

## ✅ Success Indicators

When everything works:
1. ✅ Backend logs show "User logged in successfully"
2. ✅ Network tab shows 200 OK status
3. ✅ Response has `success: true` and `token` field
4. ✅ User is redirected to `/account` page
5. ✅ localStorage has `authToken` and `authUser`
6. ✅ Navbar shows user name/avatar (logged in state)

## 🎯 Quick Test Commands (PowerShell)

```powershell
# Test login via curl
$body = @{
    email = "aditya@gmail.com"
    password = "aditya@2005"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

# If successful, you'll see the user object and token
```

## 🎉 Expected Final State

After successful login:
- **localStorage.authToken**: Long JWT string starting with `eyJ...`
- **localStorage.authUser**: JSON with user info
- **Navbar**: Shows user name and logout option
- **Browser**: Redirected from `/login` to `/account`
- **Backend console**: Shows "User logged in successfully: aditya@gmail.com"

## 🔄 If Still Not Working

1. **Clear Everything:**
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Restart Both Services:**
   ```powershell
   # Stop backend (Ctrl+C in backend terminal)
   # Stop frontend (Ctrl+C in frontend terminal)
   
   # Start backend
   cd backend
   mvn spring-boot:run
   
   # Start frontend (new terminal)
   cd frontend
   npm run dev
   ```

3. **Check Backend Health:**
   ```powershell
   # Should return JSON
   Invoke-RestMethod -Uri "http://localhost:8080/api/products"
   ```

4. **Enable Detailed Logging**
   Add to `application.properties`:
   ```properties
   logging.level.org.springframework.security=TRACE
   logging.level.org.springframework.web.cors=DEBUG
   ```

## 📞 Support Information

If you see any of these in backend logs, REPORT THEM:
- ❌ Stack traces with exceptions
- ❌ "Access denied" messages
- ❌ Database connection errors
- ❌ CORS-related warnings

The key changes that fix the issue:
1. ✅ Database name: `jewelry_shop`
2. ✅ OPTIONS requests: explicitly permitted
3. ✅ CORS: hardcoded origins (no property files)
4. ✅ Security: proper filter chain order
