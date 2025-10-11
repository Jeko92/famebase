# Deployment Guide - Vercel

This guide walks you through deploying the Addfame Famebase platform to Vercel.

## Prerequisites

- GitHub account with this repository pushed
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (we'll set this up)

---

## Step 1: Database Setup

You have several options for PostgreSQL hosting:

### Option A: Vercel Postgres (Recommended for simplicity)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** tab
3. Click **Create Database** → Select **Postgres**
4. Name your database (e.g., `addfame-production`)
5. Select your region (choose closest to your users)
6. Click **Create**
7. Copy the `DATABASE_URL` from the connection string

### Option B: Neon (Recommended for production)

1. Go to [Neon](https://neon.tech) and sign up
2. Create a new project
3. Name it `addfame-production`
4. Copy the connection string (starts with `postgresql://`)
5. Neon provides connection pooling automatically

### Option C: Supabase

1. Go to [Supabase](https://supabase.com) and sign up
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the connection string under **Connection pooling**
5. Use the "Transaction" mode connection string

### Option D: Railway

1. Go to [Railway](https://railway.app) and sign up
2. Create a new project → Add PostgreSQL
3. Copy the `DATABASE_URL` from the variables tab

---

## Step 2: Generate Secrets

Generate secure secrets for authentication:

```bash
# Generate AUTH_SECRET (32+ characters)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Save this output - you'll need it for environment variables.

---

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm build --filter=web`
   - **Install Command**: `pnpm install`
   - **Output Directory**: `.next`

5. Add Environment Variables (click **Environment Variables**):

```env
# Database
DATABASE_URL=postgresql://[your-database-connection-string]

# NextAuth
AUTH_SECRET=[generated-secret-from-step-2]
NEXTAUTH_SECRET=[same-secret-as-AUTH_SECRET]
NEXTAUTH_URL=https://your-app-name.vercel.app

# App URL
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

6. Click **Deploy**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# Set up and deploy? [Y/n] y
# Which scope? [Select your account]
# Link to existing project? [N/y] n
# What's your project's name? addfame-famebase
# In which directory is your code located? ./
# Auto-detected Project Settings (Next.js)
```

---

## Step 4: Configure Environment Variables

After initial deployment, add environment variables:

```bash
# Set environment variables via CLI
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add NEXT_PUBLIC_APP_URL
```

Or add them via Vercel Dashboard:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add each variable for **Production**, **Preview**, and **Development**

---

## Step 5: Run Database Migrations

After deployment, you need to set up your database schema:

### Option A: Using Vercel CLI

```bash
# Connect to your production environment
vercel env pull .env.production

# Generate Prisma Client
pnpm --filter=database db:generate

# Push schema to database
DATABASE_URL="your-production-db-url" pnpm --filter=database db:push

# Seed database with sample data (optional)
DATABASE_URL="your-production-db-url" pnpm --filter=database db:seed
```

### Option B: Using a script

Create a temporary script to run migrations:

1. Create `scripts/migrate-production.ts`:
```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function migrate() {
  try {
    console.log('Generating Prisma Client...');
    await execAsync('pnpm --filter=database db:generate');

    console.log('Pushing schema to database...');
    await execAsync('pnpm --filter=database db:push');

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
```

2. Run it locally with production DATABASE_URL

---

## Step 6: Verify Deployment

1. Visit your deployed app: `https://your-app-name.vercel.app`
2. Try to sign up for a new account
3. Test login functionality
4. Search for influencers
5. Add favorites

---

## Step 7: Set Up Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update environment variables:
   - `NEXTAUTH_URL` → `https://yourdomain.com`
   - `NEXT_PUBLIC_APP_URL` → `https://yourdomain.com`

---

## Troubleshooting

### Build Fails

**Error**: `Cannot find module '@prisma/client'`

**Fix**: Add postinstall script to generate Prisma Client:

```json
// packages/database/package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

Then redeploy.

---

### Database Connection Fails

**Error**: `Can't reach database server`

**Fix**:
1. Verify DATABASE_URL is correct
2. Check if database allows connections from Vercel IPs
3. For Neon/Supabase, use the connection pooling URL
4. Ensure SSL is enabled (add `?sslmode=require` to connection string)

---

### Authentication Not Working

**Error**: `[auth][error] MissingSecret`

**Fix**:
1. Verify `AUTH_SECRET` and `NEXTAUTH_SECRET` are set
2. Ensure they're identical values
3. Verify `NEXTAUTH_URL` matches your deployment URL
4. Redeploy after adding variables

---

## Monorepo Considerations

This is a Turborepo monorepo. Vercel automatically detects this and:
- Installs dependencies at root level
- Builds packages in correct order
- Caches builds for faster deployments

### Build Configuration

Vercel uses these settings from `vercel.json`:
- **Build Command**: `pnpm build` (runs turbo build)
- **Output Directory**: `apps/web/.next`
- **Install Command**: `pnpm install`

---

## Performance Optimization

### Enable Edge Runtime (Optional)

For faster response times, enable Edge Runtime for API routes:

```typescript
// apps/web/src/app/api/route.ts
export const runtime = 'edge'; // or 'nodejs'
```

### Database Connection Pooling

For production, use connection pooling to avoid exhausting database connections:

1. **Neon**: Use the pooled connection string (includes `-pooler`)
2. **Supabase**: Use "Transaction" mode connection string
3. **Prisma Accelerate**: Consider using for additional caching

---

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

### Branch Protection

Recommended GitHub settings:
1. Protect `main` branch
2. Require pull request reviews
3. Require status checks (type-check, lint)
4. Vercel preview deployments will automatically run on PRs

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `AUTH_SECRET` | Secret for NextAuth JWT signing | `[32+ char random string]` |
| `NEXTAUTH_SECRET` | Same as AUTH_SECRET | `[same value]` |
| `NEXTAUTH_URL` | Your deployment URL | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL | `https://your-app.vercel.app` |

---

## Post-Deployment Checklist

- [ ] Database schema pushed successfully
- [ ] Sample data seeded (optional)
- [ ] Sign up page works
- [ ] Login page works
- [ ] Search functionality works
- [ ] Favorites can be added/removed
- [ ] All environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Error tracking set up (Sentry, etc.)

---

## Monitoring & Maintenance

### View Logs

```bash
# View real-time logs
vercel logs [deployment-url] --follow

# View production logs
vercel logs --prod
```

### Analytics

Vercel provides built-in analytics:
1. Go to your project dashboard
2. Navigate to **Analytics** tab
3. View page views, performance metrics, etc.

---

## Cost Considerations

### Vercel Pricing

- **Hobby Plan**: Free
  - 100GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS
  - Good for personal projects

- **Pro Plan**: $20/month
  - 1TB bandwidth
  - Advanced analytics
  - Better for production apps

### Database Pricing

- **Neon**: Free tier available (0.5GB storage, 1 project)
- **Supabase**: Free tier (500MB database, 2GB bandwidth)
- **Vercel Postgres**: Pay-as-you-go
- **Railway**: $5/month for 512MB database

---

## Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use different secrets for development and production
3. ✅ Enable database SSL connections
4. ✅ Set up monitoring and error tracking
5. ✅ Regularly update dependencies
6. ✅ Use environment variables for all sensitive data
7. ✅ Review Vercel security logs regularly

---

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **This Project**: [Your GitHub Issues URL]

---

## Quick Commands Reference

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# View deployments
vercel ls

# View logs
vercel logs --prod --follow

# Pull environment variables
vercel env pull

# Add environment variable
vercel env add DATABASE_URL production
```

---

**Deployment Time**: ~5-10 minutes for first deployment
**Build Time**: ~2-3 minutes
**Region**: Automatically optimized based on your settings