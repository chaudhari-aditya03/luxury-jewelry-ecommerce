# 🚀 Quick Debug Steps

## Step 1: Restart Backend
```powershell
cd D:\clientsProjects\E-Commerce_Website\backend
mvn spring-boot:run
```

Wait for these messages:
```
✅ Data initialization completed successfully!
🚀 Jewelry E-Commerce Backend Started Successfully!
```

## Step 2: Test Debug Endpoints

Open browser and test these URLs:

### Check All Users in Database
```
http://localhost:8080/api/debug/users
```

**Expected Response:**
```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "id": 1,
      "fullName": "Admin User",
      "email": "admin@gmail.com",
      "role": "ADMIN",
      "isActive": true,
      "hasPassword": true
    },
    {
      "id": 2,
      "fullName": "Aditya Kumar",
      "email": "aditya@gmail.com",
      "role": "USER",
      "isActive": true,
      "hasPassword": true
    }
  ]
}
```

### Check Specific User
```
http://localhost:8080/api/debug/user-by-email?email=admin@gmail.com
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "fullName": "Admin User",
    "email": "admin@gmail.com",
    "role": "ADMIN",
    "isActive": true,
    "passwordHash": "$2a$10$ABC...",
    "emailVerified": true
  }
}
```

## Step 3: Test Login API

Open **Browser Console** (F12) and paste:

```javascript
fetch("http://localhost:8080/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@gmail.com",
    password: "admin@2005"
  })
})
.then(res => res.json())
.then(data => {
  console.log("Status:", data.success);
  console.log("Message:", data.message);
  console.log("Full Response:", data);
});
```

## Step 4: Check Backend Logs

Look for these messages:
- `Login request received for email: admin@gmail.com` ✅
- `Authentication successful for email: admin@gmail.com` ✅ (or error message)
- `User logged in successfully: admin@gmail.com` ✅ (or exception details)

## Step 5: Share Results

Please share:
1. Output from `/api/debug/users`
2. Output from `/api/debug/user-by-email?email=admin@gmail.com`
3. Browser console output from login fetch test
4. Backend console errors (if any)

This will help identify:
- ✅ Are users actually saved in database?
- ✅ Are passwords properly encoded?
- ✅ Is authentication failing during login?
- ✅ What's the exact error message?
