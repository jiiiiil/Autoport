# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Create account at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Project should be on GitHub (already done: jiiiiil/Autoport)
3. **PostgreSQL Database**: You need a PostgreSQL database (use Vercel Postgres or Supabase)

## Step 1: Set up PostgreSQL Database

### Option A: Vercel Postgres (Recommended)
1. Go to Vercel Dashboard → Your Project → Storage
2. Click "Create Database" → "Postgres"
3. Select region (closest to your users)
4. Copy the `DATABASE_URL` from the database settings

### Option B: Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (use "URI" format)

## Step 2: Set up Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string | From Step 1 |
| `GROQ_API_KEY` | Your Groq API key | Get from [console.groq.com](https://console.groq.com) |
| `JWT_SECRET` | Random string (min 16 chars) | Generate: `openssl rand -base64 32` |
| `APP_URL` | Your Vercel domain | e.g., `https://your-app.vercel.app` |
| `GROQ_MODEL` | `openai/gpt-oss-120b` | Fixed value |
| `NODE_ENV` | `production` | Fixed value |

## Step 3: Deploy to Vercel

### Method A: Via Vercel Dashboard (Easiest)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `jiiiiil/Autoport`
3. Vercel will auto-detect Next.js
4. Configure environment variables (from Step 2)
5. Click "Deploy"

### Method B: Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

## Step 4: Run Database Migrations

After deployment, you need to set up the database schema:

```bash
# Install Vercel CLI if not installed
npm install -g vercel

# Run Prisma migrations
vercel env pull .env.local
npx prisma db push
```

Or use Vercel Postgres built-in migration tool.

## Step 5: Verify Deployment

1. Visit your Vercel URL
2. Test user registration
3. Test resume upload
4. Test portfolio generation
5. Test ZIP download

## Important Notes

- **Database**: The project uses PostgreSQL. Make sure your database is accessible from Vercel's network.
- **File Upload**: PDF parsing happens server-side. No additional configuration needed.
- **ZIP Generation**: Uses server-side file system operations. Works on Vercel serverless functions.
- **Groq API**: Make sure your API key has sufficient credits for production usage.

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Verify `DATABASE_URL` is valid
- Check Vercel build logs

### Database Connection Error
- Verify `DATABASE_URL` format
- Check database allows connections from Vercel's IP ranges
- Ensure database is not in sleep mode

### ZIP Download Fails
- Check server logs for file system errors
- Verify all component directories exist in the source
- Check export validation logs

## Local Production Build Test

Before deploying, test locally:

```bash
# Build for production
npm run build

# Start production server
npm start

# Test at http://localhost:3000
```
