# Quick Deployment Steps

## Prerequisites
- Backend deployed on Render/Railway (HTTPS URL ready)
- Vercel project created for frontend

## Step 1: Run Database Migration (Backend Database)

Connect to your backend database and run:

```sql
-- File: MIGRATION_ACTIVITY_LOG.sql
CREATE TABLE activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    status VARCHAR(50),
    ip_address VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_activity_user (user_id),
    KEY idx_activity_type (activity_type),
    KEY idx_activity_created (created_at),
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Step 2: Backend Deployment

If using Render/Railway:
- Push code changes to GitHub
- They auto-redeploy on push
- Should pick up new ActivityLog beans automatically

The new files are:
- `ActivityLog.java` (entity)
- `ActivityLogRepository.java` (repo interface)
- `ActivityLogService.java` (service interface)
- `ActivityLogServiceImpl.java` (service impl)
- `ActivityLogResponse.java` (DTO)
- `ActivityLogController.java` (REST controller)

## Step 3: Backend Environment Variables

Go to your backend (Render/Railway) dashboard and set:

```
CORS_ALLOWED_ORIGINS=https://jewelryeshop.vercel.app,http://localhost:5173
```

Save and redeploy.

## Step 4: Frontend Vercel Deployment

Go to Vercel Dashboard → your project → Settings → Environment Variables

Add these variables:

```
VITE_API_URL=https://<your-backend-domain>/api
VITE_RAZORPAY_KEY_ID=<your-razorpay-public-key>
VITE_APP_NAME=Jewelry Store
VITE_ENABLE_REVIEWS=true
VITE_ENABLE_WISHLIST=true
VITE_ENABLE_COUPONS=true
```

**Replace** `<your-backend-domain>` with your actual backend URL (e.g., `jewelry-backend.onrender.com`)

Then trigger a redeploy from Vercel dashboard.

## Step 5: Test the Complete Flow

1. Go to `https://jewelryeshop.vercel.app/`
2. Register or login
3. Add a product to cart
4. Remove a product from cart
5. Go to checkout and place an order
6. Verify in database:

```sql
SELECT * FROM activity_logs WHERE user_id = {your_user_id} ORDER BY created_at DESC;
```

You should see entries for:
- ADD_TO_CART
- REMOVE_FROM_CART  
- PURCHASE

## Step 6: Verify Cart/Order Flow

### Check Cart is Working
```bash
curl -X GET https://<backend>/api/cart \
  -H "Authorization: Bearer <your-token>"
```

Should return your cart items.

### Check Orders
```bash
curl -X GET https://<backend>/api/orders/my \
  -H "Authorization: Bearer <your-token>"
```

Should return your orders if you placed any.

### Check Activity Logs
```bash
curl -X GET https://<backend>/api/activity-logs/my \
  -H "Authorization: Bearer <your-token>"
```

Should return your activity log entries.

## Common Issues

### "Cannot connect to server" error on frontend
- Check `VITE_API_URL` in Vercel environment variables
- Ensure backend is actually deployed and running
- Verify CORS includes your Vercel URL in backend env

### "Add to cart" not working
- Check browser DevTools → Network tab
- Look for the POST request to `/api/cart/add`
- Check response status and error message
- Verify auth token is present (should be in Authorization header)

### Activity logs not appearing in database
- Check `activity_logs` table exists
- Verify foreign key to users table is correct
- Check backend logs for any exceptions

## Files to Deploy

### Backend (auto-deployed if in git)
- `backend/src/main/java/com/jewelryshop/entity/ActivityLog.java`
- `backend/src/main/java/com/jewelryshop/repository/ActivityLogRepository.java`
- `backend/src/main/java/com/jewelryshop/service/ActivityLogService.java`
- `backend/src/main/java/com/jewelryshop/service/impl/ActivityLogServiceImpl.java`
- `backend/src/main/java/com/jewelryshop/dto/ActivityLogResponse.java`
- `backend/src/main/java/com/jewelryshop/controller/ActivityLogController.java`
- Modified: `CartServiceImpl.java`, `OrderServiceImpl.java`

### Frontend (Vercel auto-builds on push)
- `frontend/.env.production` (cleared placeholder, needs Vercel env var)
- `frontend/src/services/apiClient.js` (production-safe API URL)
- `frontend/src/pages/Register.jsx` (fixed payload & error messages)
- `frontend/src/pages/Login.jsx` (improved errors)

---

**Expected Deployment Time**: 5-10 minutes (after code push)
