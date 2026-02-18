# ✅ Pre-Deployment Checklist

Use this checklist to ensure everything is ready before deploying to production.

## 📋 Code Preparation

### Backend
- [ ] All API endpoints tested locally
- [ ] Database migrations ready
- [ ] Admin user SQL script verified
- [ ] Environment variables documented
- [ ] CORS configuration set for production
- [ ] JWT secret generated (min 256 bits)
- [ ] Health check endpoint works (`/api/health`)
- [ ] No hardcoded credentials in code
- [ ] Logging configured for production
- [ ] Error handling implemented
- [ ] File upload limits set appropriately

### Frontend
- [ ] All pages tested locally
- [ ] API integration working
- [ ] Environment variables configured
- [ ] Build runs without errors (`npm run build`)
- [ ] No console errors or warnings
- [ ] Images optimized
- [ ] Favicon updated
- [ ] Meta tags and SEO configured
- [ ] Mobile responsive tested
- [ ] Loading states implemented
- [ ] Error boundaries in place

## 🔐 Security

- [ ] All `.env` files in `.gitignore`
- [ ] Different secrets for dev/production
- [ ] API endpoints authenticated properly
- [ ] SQL injection protection (using JPA)
- [ ] XSS protection enabled
- [ ] HTTPS enforced in production
- [ ] Password hashing implemented (BCrypt)
- [ ] Rate limiting considered
- [ ] Input validation on all forms
- [ ] Admin routes protected

## 🗄️ Database

- [ ] Database provider chosen (Railway/PlanetScale)
- [ ] Database created
- [ ] Connection string obtained
- [ ] SSL enabled for connections
- [ ] Backup strategy planned
- [ ] Migration scripts ready:
  - [ ] `insert_admin_user.sql`
  - [ ] `fix_roles.sql`
  - [ ] `add_category_description.sql`
- [ ] Test data prepared (optional)

## 🔑 Third-Party Services

### Razorpay
- [ ] Account created
- [ ] Test keys obtained
- [ ] Production keys obtained
- [ ] Webhook configured (if needed)
- [ ] Payment flow tested

### Email Service (if implemented)
- [ ] Email service configured
- [ ] Templates ready
- [ ] SMTP credentials secured

### File Storage
- [ ] Local storage OR cloud storage decided
- [ ] Upload directory configured
- [ ] File size limits set
- [ ] Allowed file types defined

## 📦 Deployment Accounts

- [ ] GitHub account with repo pushed
- [ ] Vercel account created
- [ ] Render account created
- [ ] Database service account created
- [ ] Domain registrar (if custom domain)

## 🚀 Deployment Configuration

### Backend (Render)
- [ ] `backend/.env.example` created
- [ ] `backend/render.yaml` created
- [ ] Build command verified
- [ ] Start command verified
- [ ] Java 17 runtime confirmed
- [ ] All environment variables listed

### Frontend (Vercel)  
- [ ] `frontend/.env.production` created
- [ ] `frontend/vercel.json` created
- [ ] Build settings configured
- [ ] Output directory confirmed (dist)
- [ ] All environment variables listed

## 📄 Documentation

- [ ] README.md updated
- [ ] DEPLOYMENT_GUIDE.md reviewed
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Setup instructions clear
- [ ] Troubleshooting guide available

## 🧪 Testing

### Local Testing
- [ ] Backend runs on local MySQL
- [ ] Frontend connects to local backend
- [ ] User registration works
- [ ] User login works
- [ ] Product listing works
- [ ] Product detail works
- [ ] Add to cart works
- [ ] Checkout flow works
- [ ] Payment integration works (test mode)
- [ ] Admin panel accessible
- [ ] Admin can add products
- [ ] Admin can manage orders
- [ ] Image upload works

### Pre-Production Testing Plan
- [ ] Test on staging/preview URLs first
- [ ] CORS working between frontend/backend
- [ ] Database connection working
- [ ] All API endpoints responding
- [ ] Authentication working
- [ ] File uploads working
- [ ] Error pages displaying correctly

## 💾 Backup & Recovery

- [ ] Database backup strategy defined
- [ ] Code pushed to GitHub (version control)
- [ ] Environment variables backed up securely
- [ ] Recovery plan documented
- [ ] Rollback strategy planned

## 📊 Monitoring

- [ ] Error tracking set up (optional)
- [ ] Analytics configured (optional)
- [ ] Health check endpoint created
- [ ] Logging strategy defined
- [ ] Alert system considered

## 🎯 Post-Deployment

- [ ] Change default admin password
- [ ] Test all critical user flows
- [ ] Monitor logs for errors
- [ ] Check performance metrics
- [ ] Test from different devices
- [ ] Test from different locations
- [ ] Verify SSL certificate
- [ ] Set up uptime monitoring
- [ ] Configure CDN (optional)
- [ ] Set up custom domain (optional)

## 📱 Final Verification

After deployment, verify:

- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Backend health: `https://your-backend.onrender.com/api/health`
- [ ] API responds: Test any public endpoint
- [ ] Login works
- [ ] Admin panel accessible
- [ ] No CORS errors in browser console
- [ ] No 404s in network tab
- [ ] Images loading correctly
- [ ] Favicon showing
- [ ] Meta tags correct (view source)

## 🎉 Launch Preparation

- [ ] Soft launch to test users
- [ ] Monitor for issues
- [ ] Gather feedback
- [ ] Fix critical bugs
- [ ] Public announcement ready
- [ ] Social media accounts set up
- [ ] Marketing materials prepared
- [ ] Support email set up

## 📞 Emergency Contacts

Have these ready:
- [ ] Hosting support (Vercel, Render)
- [ ] Database provider support
- [ ] Payment gateway support
- [ ] Domain registrar support

## 🔄 Continuous Integration

- [ ] Auto-deploy on git push configured
- [ ] Branch protection set up
- [ ] PR previews enabled (Vercel)
- [ ] Testing pipeline (optional)

---

## ⚡ Quick Deploy Command

Once everything is checked:

```bash
# 1. Commit and push
git add .
git commit -m "Ready for production deployment"
git push origin main

# 2. Deploy backend (Render auto-deploys from GitHub)
# 3. Deploy frontend (Vercel auto-deploys from GitHub)
# 4. Monitor deployment logs
# 5. Test thoroughly
```

---

**When all items are checked, you're ready to deploy! 🚀**

Refer to [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions.
