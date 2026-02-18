# Vercel Deployment Configuration

This file contains setup instructions for deploying the frontend to Vercel.

## Prerequisites

1. GitHub account with repository pushed
2. Vercel account (https://vercel.com)
3. Backend deployed on Render (get the backend URL first)

## Deployment Steps

### Step 1: Prepare Frontend

1. **Update Environment Variables**
   
   Copy `.env.production` and update with your values:
   ```bash
   # From frontend directory
   cp .env.production .env.production.local
   ```

   Update the backend URL:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

### Step 2: Deploy to Vercel

**Option A: Using Vercel Dashboard (Recommended)**

1. **Login to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_APP_NAME=Jewelry Store
   VITE_APP_VERSION=1.0.0
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   VITE_ENABLE_REVIEWS=true
   VITE_ENABLE_WISHLIST=true
   VITE_ENABLE_COUPONS=true
   VITE_DEFAULT_PAGE_SIZE=12
   VITE_MAX_PAGE_SIZE=100
   VITE_SITE_URL=https://your-app.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Get your deployment URL: `https://your-app.vercel.app`

**Option B: Using Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow prompts**
   - Link to existing project or create new
   - Confirm settings
   - Deploy

### Step 3: Update Backend CORS

After deployment, you need to update the backend to allow your Vercel domain:

1. **Go to Render Dashboard**
2. **Select your backend service**
3. **Environment Variables**
4. **Update CORS_ALLOWED_ORIGINS**:
   ```
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main-yourname.vercel.app
   ```
5. **Save and redeploy**

### Step 4: Configure Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to your project
   - Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Backend CORS** with new domain:
   ```
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://yourdomain.com,https://www.yourdomain.com
   ```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend.onrender.com/api` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key | `rzp_live_xxxxx` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application name | `Jewelry Store` |
| `VITE_ENABLE_REVIEWS` | Enable reviews feature | `true` |
| `VITE_ENABLE_WISHLIST` | Enable wishlist feature | `true` |
| `VITE_ENABLE_COUPONS` | Enable coupons feature | `true` |
| `VITE_DEFAULT_PAGE_SIZE` | Products per page | `12` |

## Vercel Configuration Files

### vercel.json
- Configures build settings
- Sets up SPA routing (rewrites)
- Already created in project

### .vercelignore (optional)
- Exclude files from deployment
- Similar to .gitignore

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches (PR previews)

## Troubleshooting

### Build Fails

**Check Node Version**
```json
// package.json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Common Issues**:
- Missing environment variables
- Build command errors
- Dependency issues

**Solution**: Check build logs in Vercel dashboard

### CORS Errors After Deployment

1. Verify `VITE_API_URL` is correct
2. Check backend `CORS_ALLOWED_ORIGINS` includes Vercel URL
3. No trailing slashes in URLs
4. Wait for backend redeploy to take effect

### Environment Variables Not Working

- Prefix must be `VITE_` for client-side variables
- Redeploy after adding new variables
- Check spelling and casing

### 404 on Page Refresh

- Ensure `vercel.json` has rewrites configuration
- SPA routing requires all routes to serve `index.html`

### API Calls Failing

1. **Check Network Tab** in browser DevTools
2. **Verify API URL** in deployed app
3. **Check CORS headers** in response
4. **Backend logs** in Render dashboard

## Performance Optimization

### Recommended Settings

1. **Enable Compression** (automatic in Vercel)
2. **Image Optimization**: Use Vercel Image Optimization
3. **Caching**: Configure in `vercel.json`

### Analytics

Enable Vercel Analytics:
1. Project Settings → Analytics
2. Enable Web Analytics
3. Free tier includes 100k requests/month

## Security

### Environment Variables

- Never commit `.env.production` to Git
- Use Vercel UI to manage sensitive variables
- Rotate keys regularly

### Headers

Add security headers in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Vercel URLs

After deployment:
- **Production**: `https://your-app.vercel.app`
- **Preview**: `https://your-app-git-branch.vercel.app`
- **Custom Domain**: `https://yourdomain.com`

## Quick Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Pull environment variables
vercel env pull

# Remove deployment
vercel rm [deployment-url]
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Support](https://vercel.com/support)
