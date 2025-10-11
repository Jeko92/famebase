# Vercel Deployment - Quick Start Guide

**Total Time**: ~15 minutes

## Step 1: Database (5 mins)

Choose one and create a database:

**Neon (Recommended):**
1. Visit https://neon.tech
2. Sign up → Create project → Copy `DATABASE_URL`

**Supabase:**
1. Visit https://supabase.com
2. New project → Settings → Database → Copy pooled connection string

**Vercel Postgres:**
1. Visit https://vercel.com/dashboard
2. Storage → Create Database → Postgres → Copy connection string

## Step 2: Generate Secret (1 min)

Run in terminal:
```bash
openssl rand -base64 32
```

Copy the output - this is your `AUTH_SECRET`

## Step 3: Deploy to Vercel (5 mins)

### Option A: Vercel Dashboard (Easier)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm build --filter=web`
   - **Install Command**: `pnpm install`

4. Add environment variables:
```env
DATABASE_URL=postgresql://[your-connection-string]
AUTH_SECRET=[generated-from-step-2]
NEXTAUTH_SECRET=[same-as-AUTH_SECRET]
NEXTAUTH_URL=https://[your-app].vercel.app
NEXT_PUBLIC_APP_URL=https://[your-app].vercel.app
```

5. Click **Deploy**

### Option B: Vercel CLI (Faster)

```bash
# Install CLI
pnpm add -g vercel

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add NEXT_PUBLIC_APP_URL

# Deploy to production
vercel --prod
```

## Step 4: Database Setup (4 mins)

After deployment, set up your database schema:

```bash
# Pull production environment variables
vercel env pull .env.production

# Generate Prisma Client
pnpm --filter=database db:generate

# Push schema to production database
DATABASE_URL="[your-production-db-url]" pnpm --filter=database db:push

# Optional: Seed with sample data
DATABASE_URL="[your-production-db-url]" pnpm --filter=database db:seed
```

## Step 5: Test (1 min)

Visit `https://[your-app].vercel.app` and test:
- [ ] Sign up page loads
- [ ] Create an account
- [ ] Login works
- [ ] Search influencers
- [ ] Add favorites

## Done! 🎉

Your app is now live at `https://[your-app].vercel.app`

---

## Common Issues

### Build Error: "Cannot find @prisma/client"
Already fixed! The `postinstall` script in `packages/database/package.json` handles this.

### Database Connection Error
- Verify `DATABASE_URL` is correct
- For Neon/Supabase, use connection pooling URL
- Add `?sslmode=require` to connection string if needed

### Auth Not Working
- Ensure `NEXTAUTH_URL` matches your actual deployment URL
- Verify `AUTH_SECRET` and `NEXTAUTH_SECRET` are identical
- Redeploy after adding variables

---

## Next Steps

- [ ] Set up custom domain (Project Settings → Domains)
- [ ] Enable Vercel Analytics (Project Settings → Analytics)
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure branch previews (automatic with PRs)
- [ ] Set up database backups

---

## Environment Variables Checklist

Copy-paste this template when adding variables to Vercel:

```
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_APP_URL=
```

**Note**: `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` should be your deployment URL, not localhost!

---

## Useful Commands

```bash
# View logs
vercel logs --prod --follow

# List deployments
vercel ls

# Deploy specific branch
vercel --prod

# Pull env variables locally
vercel env pull
```

---

For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)