# 🚀 Complete Deployment Guide
## Jewelry E-Commerce Platform

This guide will walk you through deploying your complete e-commerce platform with:
- **Frontend** → Vercel
- **Backend** → Render
- **Database** → Railway/PlanetScale (MySQL)

---

## 📋 Pre-Deployment Checklist

### ✅ Before You Start

- [ ] Code pushed to GitHub repository
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] Payment gateway credentials (Razorpay)

### 🔑 Required Accounts

1. [GitHub](https://github.com) - Source code hosting
2. [Vercel](https://vercel.com) - Frontend hosting (Free tier available)
3. [Render](https://render.com) - Backend hosting (Free tier available)
4. [Railway](https://railway.app) or [PlanetScale](https://planetscale.com) - Database (Free tier available)
5. [Razorpay](https://razorpay.com) - Payment gateway

---

## 🗄️ Step 1: Database Setup

### Option A: Railway MySQL (Recommended)

1. **Create Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Provision MySQL"

3. **Get Connection Details**
   - Click on MySQL service
   - Go to "Connect" tab
   - Copy these values:
     ```
     MYSQL_HOST
     MYSQL_PORT
     MYSQL_USER
     MYSQL_PASSWORD
     MYSQL_DATABASE
     ```

4. **Format DATABASE_URL**
   ```
   jdbc:mysql://MYSQL_HOST:MYSQL_PORT/MYSQL_DATABASE?useSSL=true&serverTimezone=UTC
   ```

### Option B: PlanetScale (Serverless MySQL)

1. **Create Account** at https://planetscale.com
2. **Create Database**: `jewelry-ecommerce`
3. **Create Password**: Save the connection string
4. **Get Connection URL** in Java format

### 🔧 Initialize Database

1. **Connect to Database** using MySQL Workbench or CLI:
   ```bash
   mysql -h YOUR_HOST -P YOUR_PORT -u YOUR_USER -p
   ```

2. **Create Database** (if not exists):
   ```sql
   CREATE DATABASE jewelry_ecommerce;
   USE jewelry_ecommerce;
   ```

3. **Run Migration Scripts** (in order):
   ```bash
   # From backend directory
   mysql -h HOST -P PORT -u USER -p jewelry_ecommerce < insert_admin_user.sql
   mysql -h HOST -P PORT -u USER -p jewelry_ecommerce < fix_roles.sql
   mysql -h HOST -P PORT -u USER -p jewelry_ecommerce < add_category_description.sql
   ```

---

## 🎯 Step 2: Backend Deployment (Render)

### 2.1 Prepare Backend

1. **Generate JWT Secret**
   ```bash
   # On Mac/Linux
   openssl rand -base64 64
   
   # On Windows (PowerShell)
   [Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
   ```

2. **Verify Files Exist**
   - ✅ `backend/.env.example`
   - ✅ `backend/render.yaml`
   - ✅ `backend/RENDER_DEPLOYMENT.md`

### 2.2 Deploy to Render

1. **Login to Render**
   - Go to https://dashboard.render.com
   - Sign in with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select your repository

3. **Configure Build**
   ```
   Name: jewelry-ecommerce-backend
   Region: Choose closest to users (e.g., Oregon, Frankfurt)
   Branch: main
   Root Directory: backend
   Runtime: Java
   Build Command: mvn clean package -DskipTests
   Start Command: java -Dspring.profiles.active=prod -jar target/jewelry-ecommerce-1.0.0.jar
   ```

4. **Instance Type**
   - Select: Starter ($7/month) or Free tier
   - Free tier sleeps after inactivity

5. **Environment Variables**
   
   Add these in Render Dashboard → Environment:
   
   ```bash
   # Spring Profile
   SPRING_PROFILES_ACTIVE=prod
   
   # Database (from Step 1)
   DATABASE_URL=jdbc:mysql://YOUR_MYSQL_HOST:3306/jewelry_ecommerce?useSSL=true&serverTimezone=UTC
   DATABASE_USERNAME=your_db_username
   DATABASE_PASSWORD=your_db_password
   
   # JWT (generated above)
   JWT_SECRET=your_very_long_secure_jwt_secret_here
   JWT_EXPIRATION=86400000
   
   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # CORS (update after frontend deployment)
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   
   # Server
   SERVER_PORT=8080
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for build
   - Note your backend URL: `https://jewelry-backend-xxxx.onrender.com`

7. **Verify Deployment**
   - Open: `https://your-backend.onrender.com/api/health`
   - Should return success message

---

## 🌐 Step 3: Frontend Deployment (Vercel)

### 3.1 Prepare Frontend

1. **Update Environment File**
   
   Edit `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   VITE_APP_NAME=Jewelry Store
   ```

2. **Verify Files Exist**
   - ✅ `frontend/vercel.json`
   - ✅ `frontend/.env.production`
   - ✅ `frontend/VERCEL_DEPLOYMENT.md`

### 3.2 Deploy to Vercel

1. **Login to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Vite (auto-detected)
   Root Directory: frontend
   Build Command: npm run build (default)
   Output Directory: dist (default)
   Install Command: npm install (default)
   ```

4. **Environment Variables**
   
   Add in Vercel → Settings → Environment Variables:
   
   ```bash
   # API
   VITE_API_URL=https://your-backend.onrender.com/api
   
   # App
   VITE_APP_NAME=Jewelry Store
   VITE_APP_VERSION=1.0.0
   
   # Features
   VITE_ENABLE_REVIEWS=true
   VITE_ENABLE_WISHLIST=true
   VITE_ENABLE_COUPONS=true
   
   # Payment
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   
   # Pagination
   VITE_DEFAULT_PAGE_SIZE=12
   VITE_MAX_PAGE_SIZE=100
   
   # Site
   VITE_SITE_URL=https://your-app.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Note your URL: `https://your-app.vercel.app`

6. **Test Frontend**
   - Open your Vercel URL
   - Check if homepage loads

---

## 🔗 Step 4: Connect Frontend & Backend (CORS)

### 4.1 Update Backend CORS

1. **Go to Render Dashboard**
2. **Select your backend service**
3. **Environment → Edit**
4. **Update CORS_ALLOWED_ORIGINS**:
   ```
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
   ```
5. **Save Changes** (triggers automatic redeploy)

### 4.2 Test API Connection

1. **Open Frontend** in browser
2. **Open Developer Tools** (F12)
3. **Try to login** or view products
4. **Check Console** for errors
5. **Check Network tab** - API calls should succeed

---

## ✅ Step 5: Final Testing

### Test Checklist

- [ ] Homepage loads correctly
- [ ] Products display with images
- [ ] User can register
- [ ] User can login
- [ ] Add to cart works
- [ ] Checkout flow works
- [ ] Admin panel accessible
- [ ] Payment integration works (test mode)
- [ ] No CORS errors in console

### Common Issues & Solutions

#### CORS Errors
```
Access to fetch has been blocked by CORS policy
```
**Solution**: 
- Verify CORS_ALLOWED_ORIGINS in Render includes exact Vercel URL
- No trailing slashes
- Wait for Render redeploy (2-3 min)

#### API 404 Errors
```
POST http://... 404 Not Found
```
**Solution**:
- Check VITE_API_URL has `/api` suffix
- Verify backend is running on Render
- Check backend logs in Render dashboard

#### Build Failures

**Backend Build Fails**:
- Check Java version is 17
- Verify all dependencies in pom.xml
- Check Render build logs

**Frontend Build Fails**:
- Check Node version >= 18
- Verify all npm packages installed
- Check Vercel build logs

---

## 🎨 Step 6: Custom Domain (Optional)

### Backend (Render)

1. Render Dashboard → Service → Settings → Custom Domain
2. Add your domain: `api.yourdomain.com`
3. Update DNS with provided CNAME
4. Update CORS in backend and VITE_API_URL in frontend

### Frontend (Vercel)

1. Vercel → Project → Settings → Domains
2. Add your domain: `www.yourdomain.com` or `yourdomain.com`
3. Update DNS as instructed
4. Update CORS_ALLOWED_ORIGINS in backend

---

## 📊 Step 7: Monitoring & Maintenance

### Render (Backend)

- **Logs**: Dashboard → Logs
- **Metrics**: Dashboard → Metrics
- **Health Check**: Automatic via `/api/health`
- **Auto-deploy**: Enabled on git push

### Vercel (Frontend)

- **Deployments**: Dashboard → Deployments
- **Analytics**: Settings → Analytics
- **Logs**: Deployment → Build Logs
- **Auto-deploy**: Enabled on git push

### Database

- **Backups**: Enable in Railway/PlanetScale settings
- **Monitoring**: Check connection metrics
- **Scale**: Upgrade plan as needed

---

## 🔐 Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use different secrets for dev/prod
- ✅ Rotate JWT secret periodically
- ✅ Keep Razorpay secrets secure

### CORS

- ✅ Only allow specific origins (not `*`)
- ✅ Include all Vercel preview URLs for testing
- ✅ Update when adding custom domains

### Database

- ✅ Use strong passwords
- ✅ Enable SSL connections
- ✅ Regular backups
- ✅ Monitor for unusual activity

---

## 💰 Pricing Summary

### Free Tier Options

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Vercel | ✅ Yes | 100 GB bandwidth/month |
| Render | ✅ Yes | Sleeps after 15min inactivity |
| Railway | ✅ Yes | $5 credit/month |
| PlanetScale | ✅ Yes | 5 GB storage, 1 billion reads |

### Recommended Paid Setup (Small scale)

- **Vercel Pro**: $20/month (better performance)
- **Render Starter**: $7/month (no sleep)
- **Railway**: ~$5-10/month (pay for usage)
- **Total**: ~$32-37/month

---

## 📝 Environment Variables Reference

### Backend (.env)

```bash
# Required
DATABASE_URL=jdbc:mysql://...
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
JWT_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
CORS_ALLOWED_ORIGINS=https://...

# Optional
JWT_EXPIRATION=86400000
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### Frontend (.env.production)

```bash
# Required
VITE_API_URL=https://backend.onrender.com/api
VITE_RAZORPAY_KEY_ID=...

# Optional
VITE_APP_NAME=Jewelry Store
VITE_ENABLE_REVIEWS=true
VITE_ENABLE_WISHLIST=true
VITE_ENABLE_COUPONS=true
VITE_DEFAULT_PAGE_SIZE=12
```

---

## 🆘 Troubleshooting

### Backend Not Responding

1. Check Render logs
2. Verify database connection
3. Check environment variables
4. Restart service manually

### Frontend Shows Old Version

1. Clear browser cache
2. Trigger Vercel redeploy
3. Check build logs
4. Verify environment variables

### Database Connection Failed

1. Verify credentials
2. Check database is running
3. Verify SSL settings
4. Check IP whitelist (if any)

---

## 📚 Additional Resources

- [Backend Deployment Guide](./backend/RENDER_DEPLOYMENT.md)
- [Frontend Deployment Guide](./frontend/VERCEL_DEPLOYMENT.md)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Spring Boot on Render](https://render.com/docs/deploy-spring-boot)

---

## 🎉 Success!

Your e-commerce platform should now be live! 

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Admin Panel**: `https://your-app.vercel.app/admin`

### Default Admin Credentials
```
Email: admin@jewelryshop.com
Password: admin123
```

**⚠️ IMPORTANT**: Change admin password immediately after first login!

---

## 🔄 Continuous Deployment

Both Vercel and Render are configured for automatic deployment:

1. **Push to GitHub** → Automatically triggers deployment
2. **Pull Request** → Creates preview deployment (Vercel)
3. **Merge to main** → Deploys to production

### Workflow

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main

# Vercel and Render automatically deploy
# Check deployment status in dashboards
```

---

## 📧 Support

If you encounter issues:

1. Check logs in respective dashboards
2. Review this guide
3. Check platform-specific docs
4. Verify environment variables
5. Test locally first

---

**Happy Deploying! 🚀**
