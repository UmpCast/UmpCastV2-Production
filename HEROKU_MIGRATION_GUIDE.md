# Heroku Migration Guide: Heroku-20 to Heroku-24

This guide will help you migrate your UmpCast application from the deprecated Heroku-20 stack to Heroku-24.

## What's Changed

### Backend (Django)
- **Python version**: Updated from 3.9 to 3.13 (latest)
- **Removed**: `django-heroku` package (deprecated)
- **Added**: `whitenoise` for static file serving
- **Added**: `dj-database-url` for database configuration
- **Updated**: Security settings for production
- **Updated**: All dependencies to latest secure versions
  - Django: 3.1.7 → 4.2 LTS (security fixes, stable LTS)
  - Requests: 2.25.1 → 2.31+ (security fixes)
  - Pillow: 8.1.2 → 10.0+ (performance & security)
  - Celery: 5.0.5 → 5.3+ (features & stability)
  - Gunicorn: 20.0.4 → 21.0+ (performance)
  - psycopg2-binary: 2.8.6 → 2.9+ (Python 3.13 support)

### Frontend (React)
- **Node.js version**: Updated to 18
- **React Scripts**: Updated from 3.4.1 to 5.0.1
- **Added**: Static buildpack configuration

### Stack Upgrade
- **Heroku Stack**: Upgraded from Heroku-20 to Heroku-24 (latest)
- **Ubuntu Version**: Updated to Ubuntu 22.04 LTS
- **Long-term Support**: Extended support timeline

## Migration Steps

### 1. Update Dependencies

First, update your backend dependencies:

```bash
cd backend
pipenv install
```

This will install the new packages and update to Python 3.13.

### 2. Update Frontend Dependencies

```bash
cd frontend
npm install
```

This will update to the new React Scripts version.

### 3. Test Locally

Before deploying, test your application locally:

**Backend:**
```bash
cd backend
pipenv run python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm start
```

### 4. Deploy to Heroku

**Note**: The deployment process has been updated with monorepo best practices. See the "Complete Migration Workflow" section below for the recommended approach.

#### Option A: Using Heroku CLI (Legacy - Not Recommended)

1. **Set the stack to Heroku-24:**
```bash
heroku stack:set heroku-24 -a umpcastv2-backend-production
heroku stack:set heroku-24 -a umpcastv2-frontend-production
```

2. **Deploy the backend:**
```bash
cd backend
git add .
git commit -m "Migrate to Heroku-24"
git push heroku main
```

3. **Deploy the frontend:**
```bash
cd frontend
git add .
git commit -m "Migrate to Heroku-24"
git push heroku main
```

#### Option B: Using Heroku Dashboard

1. Go to your Heroku dashboard
2. Select your app
3. Go to Settings tab
4. Click "Change stack" and select "Heroku-24"

## Monorepo Deployment Best Practices

Since UmpCast uses a monorepo structure with separate backend and frontend apps, here are the recommended deployment practices:

### Repository Structure
```
UmpCastV2-Production/
├── backend/          # Django app
├── frontend/         # React app
├── .git/            # Single git repository
└── app.json files   # In both directories
```

### Setting Up Heroku Remotes (Optional - Only if GitHub Integration is Disabled)

**Note**: If you have GitHub integration enabled (recommended), you don't need Heroku remotes!

Only set up Heroku remotes if you need manual deployment control:

```bash
# Add Heroku remotes to your monorepo (only if needed)
git remote add heroku-backend https://git.heroku.com/umpcastv2-backend-production.git
git remote add heroku-frontend https://git.heroku.com/umpcastv2-frontend-production.git

# Verify remotes
git remote -v
```

### Deploying from Monorepo Root

**🎉 With GitHub Integration (Recommended):**
```bash
# From monorepo root directory - Heroku auto-deploys both apps!
git push origin main
```

**Manual Deployment (Only if GitHub integration is disabled):**
```bash
# Deploy backend
git subtree push --prefix=backend heroku-backend main

# Deploy frontend  
git subtree push --prefix=frontend heroku-frontend main
```

### Benefits of Monorepo Deployment

- ✅ **Deploy from root directory** (no cd needed)
- ✅ **Single git repository** management
- ✅ **Clear separation** of backend/frontend deployments
- ✅ **Easier CI/CD** setup
- ✅ **Better monorepo practices**
- 🚀 **Automatic deployment** with GitHub integration
- 🎯 **Single command** deployment: `git push origin main`

### Alternative: Traditional Directory-Based Deployment

If you prefer the traditional approach:

```bash
# Backend deployment
cd backend
git push heroku main

# Frontend deployment
cd frontend
git push heroku main
```

**Note**: The monorepo approach is recommended for better workflow consistency.

## Package Manager Best Practices

### Frontend Dependencies (npm)

**Important**: UmpCast uses npm, not yarn. Keep these files tracked in Git:

- ✅ **`package.json`** - Dependencies and scripts
- ✅ **`package-lock.json`** - Exact dependency versions (CRITICAL for consistency)
- ❌ **`yarn.lock`** - Not used (excluded from Git)

**Why package-lock.json matters:**
- **Exact dependency versions** - Everyone gets identical packages
- **Reproducible builds** - Same versions in dev and production
- **Faster installs** - npm doesn't need to resolve dependencies
- **Security consistency** - Same vulnerability status across environments

### Backend Dependencies (pipenv)

**Keep these files tracked in Git:**
- ✅ **`Pipfile`** - Dependencies and Python version
- ✅ **`Pipfile.lock`** - Exact dependency versions

### Files to Exclude from Git

**Never track these build artifacts:**
```gitignore
# Frontend build files
frontend/build/
frontend/dist/
frontend/out/

# Backend static files
backend/staticfiles/
backend/static/

# Dependencies
*/node_modules
frontend/yarn.lock

# Temporary scripts
frontend/fix_*.py
frontend/revert_*.py
backend/update_*.sh
```

## Complete Migration Workflow

### 1. Source Control (GitHub)
```bash
# Stage and commit your changes
git add .
git commit -m "Migrate to Heroku-24: Add whitenoise, update dependencies, clean up social OAuth"

# Push to GitHub
git push origin main
```

### 2. Stack Migration (Heroku)
```bash
# Change backend stack
heroku stack:set heroku-24 -a umpcastv2-backend-production

# Change frontend stack
heroku stack:set heroku-24 -a umpcastv2-frontend-production
```

### 3. Production Deployment (Heroku)

**🎉 GitHub Integration Enabled - Deployment is Automatic!**

Since you have GitHub integration enabled on both Heroku apps, deployment happens automatically:

```bash
# Just push to GitHub - Heroku auto-deploys both apps!
git push origin main
```

**What happens automatically:**
1. ✅ **Backend deploys** from `backend/` subdirectory (PROJECT_PATH: backend)
2. ✅ **Frontend deploys** from `frontend/` subdirectory (PROJECT_PATH: frontend)
3. ✅ **No manual Heroku commands** needed
4. ✅ **Builds happen automatically** on every push to main

**Alternative: Manual deployment (not needed with GitHub integration):**
```bash
# Only if you need manual control
git remote add heroku-backend https://git.heroku.com/umpcastv2-backend-production.git
git remote add heroku-frontend https://git.heroku.com/umpcastv2-frontend-production.git

git push heroku-backend main
git push heroku-frontend main
```

**Note**: With GitHub integration, you only need `git push origin main`!

### 4. Verify Deployment
```bash
# Check backend status
heroku logs --tail -a umpcastv2-backend-production

# Check frontend status
heroku logs --tail -a umpcastv2-frontend-production
```

## Troubleshooting Common Issues

### Frontend Build Errors

**Issue**: Module resolution errors with React
**Solution**: Ensure `"type": "module"` is removed from package.json

**Issue**: Missing react-scripts
**Solution**: Run `npm install` to reinstall dependencies

### Backend Static File Issues

**Issue**: Profile pictures not loading after migration
**Solution**: Profile pictures are served from S3, not affected by whitenoise migration

**Issue**: Static files not found
**Solution**: Ensure `python manage.py collectstatic` runs during Heroku build

### Package Manager Conflicts

**Issue**: Mixed npm/yarn artifacts
**Solution**: 
- Use only npm (remove yarn.lock)
- Keep package-lock.json in Git
- Exclude node_modules from Git

### Monorepo Deployment Issues

**Issue**: Heroku can't find app files
**Solution**: Use `git subtree push --prefix=backend` and `git subtree push --prefix=frontend`

**Issue**: Wrong buildpack detected
**Solution**: Ensure app.json files are in correct directories

## Support and Resources

- **Heroku Documentation**: https://devcenter.heroku.com/
- **Django Deployment**: https://docs.djangoproject.com/en/4.2/howto/deployment/
- **React Build**: https://create-react-app.dev/docs/deployment/
- **Monorepo Best Practices**: https://monorepo.tools/
5. Deploy your updated code

### 5. Verify Deployment

After deployment, verify that:

1. **Backend is working:**
   - Check logs: `heroku logs --tail -a your-backend-app-name`
   - Test API endpoints
   - Verify database connections

2. **Frontend is working:**
   - Check logs: `heroku logs --tail -a your-frontend-app-name`
   - Test the application in browser
   - Verify static files are serving correctly

### 6. Environment Variables

Make sure all your environment variables are still set correctly:

```bash
heroku config -a your-backend-app-name
heroku config -a your-frontend-app-name
```

### 7. Database Migration

If you have any pending migrations:

```bash
heroku run python manage.py migrate -a your-backend-app-name
```

## Troubleshooting

### Common Issues

1. **Build failures:**
   - Check that all dependencies are properly specified
   - Verify Python/Node.js versions are correct

2. **Static files not loading:**
   - Ensure whitenoise is properly configured
   - Check STATIC_ROOT and STATIC_URL settings

3. **Database connection issues:**
   - Verify DATABASE_URL is set correctly
   - Check that dj-database-url is installed

4. **CORS issues:**
   - Update ALLOWED_HOSTS and CORS_ORIGIN_WHITELIST if needed

### Rollback Plan

If something goes wrong, you can rollback:

```bash
heroku rollback -a your-app-name
```

## Benefits of Heroku-24

- **Security**: Latest security patches and updates
- **Performance**: Improved performance and reliability
- **Support**: Continued support from Heroku
- **Compatibility**: Better compatibility with modern packages

## Benefits of Python 3.13

- **Performance**: Up to 5-10% faster than Python 3.11
- **Memory Efficiency**: Better memory management and reduced memory usage
- **New Features**: Latest language features and improvements
- **Security**: Latest security updates and patches
- **Future-Proof**: Long-term support and compatibility
- **Type System**: Enhanced type checking and annotations
- **Error Handling**: Improved error messages and debugging

## Security Improvements

- **Django 4.2 LTS**: Latest LTS version with security fixes and long-term support
- **Requests 2.31+**: Patches for multiple security vulnerabilities
- **Pillow 10.0+**: Security fixes for image processing
- **Updated SSL/TLS**: Latest certificate bundles and protocols
- **Dependency Scanning**: All packages updated to secure versions

## Why Django 4.2 LTS Instead of 5.x?

- **Stability**: 4.2 LTS is more stable and battle-tested
- **Compatibility**: Better compatibility with existing OAuth packages
- **Support**: Long-term support until April 2026
- **Migration Path**: Easier migration from Django 3.1.7
- **Future-Proof**: Can upgrade to Django 5.x later after modernizing authentication

## Next Steps

After successful migration:

1. Monitor your application for any issues
2. Update your CI/CD pipelines if applicable
3. You're now on the latest stack with long-term support

## Support

If you encounter any issues during migration:

1. Check Heroku's official migration guide
2. Review the Heroku logs for specific error messages
3. Contact Heroku support if needed
