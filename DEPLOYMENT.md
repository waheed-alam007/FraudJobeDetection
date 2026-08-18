# Deployment Guide

## Hugging Face Spaces (Backend)

### Step 1: Create Hugging Face Account
- Go to https://huggingface.co
- Sign up and verify email
- Create new Space

### Step 2: Create New Space
1. Click "Create new Space"
2. Name: `sentinel-api` (or your choice)
3. License: `mit`
4. Private/Public: `Public`
5. Space SDK: **Docker**
6. Click "Create Space"

### Step 3: Upload Files
Option A: GitHub Integration (Recommended)
```bash
# Push code to GitHub
git remote add origin <your-repo-url>
git push -u origin main
```
Then connect GitHub repo in Space settings.

Option B: Direct Upload
1. Clone Space repo: `git clone https://huggingface.co/spaces/<username>/sentinel-api`
2. Copy `Dockerfile`, `backend/` files
3. Push to HF: `git push`

### Step 4: Add Secrets
In Space settings > Repository secrets:
- `EMAIL_SENDER` = your-email@gmail.com
- `EMAIL_PASSWORD` = xxxx xxxx xxxx xxxx
- `REPORT_RECIPIENT` = admin@example.com

### Step 5: Deploy
- Space auto-deploys on push
- Check logs in Space runtime
- Access at: `https://huggingface.co/spaces/<username>/sentinel-api`

---

## Vercel (Frontend)

### Step 1: Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub
- Connect GitHub account

### Step 2: Import Project
1. Click "New Project"
2. Import GitHub repository
3. Select `frontend` as root directory
4. Click Import

### Step 3: Configure Build
- Build Command: `npm run build`
- Output Directory: `dist`
- Click Deploy

### Step 4: Add Environment Variables
In Project Settings > Environment Variables:
- Name: `VITE_API_URL`
- Value: `https://<username>-sentinel-api.hf.space`
- Add to: Production, Preview, Development

### Step 5: Deploy
- Vercel auto-deploys on push
- Check deployment status
- Access at: `https://sentinel-<random>.vercel.app`

---

## Netlify (Frontend - Alternative)

### Step 1: Create Netlify Account
- Go to https://netlify.com
- Sign up with GitHub

### Step 2: Connect Repository
1. Click "New site from Git"
2. Select GitHub
3. Choose your repository
4. Authorize Netlify

### Step 3: Configure Build
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

### Step 4: Add Environment Variables
- `VITE_API_URL` = `https://<username>-sentinel-api.hf.space`

### Step 5: Deploy
- Click "Deploy site"
- Wait for build to complete
- Access at: `https://sentinel-<random>.netlify.app`

---

## GitHub Actions (Optional CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Test Backend
        run: |
          cd backend
          pip install -r requirements.txt
          pytest
      
      - name: Build Frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Troubleshooting

### "Email not sending"
- Verify Gmail App Password is correct
- Check EMAIL_SENDER and EMAIL_PASSWORD in secrets
- Ensure 2FA is enabled on Gmail
- Check SMTP port is 587

### "CORS errors"
- Verify VITE_API_URL in frontend env
- Check backend CORS middleware
- Ensure frontend URL is in CORS allowlist

### "Cold starts too slow"
- Use Vercel Edge Functions for frontend
- Add caching headers
- Optimize Docker image size

### "500 errors from API"
- Check HF Space logs
- Verify all secrets are set
- Test locally first with `docker-compose up`

---

## Monitoring

### Hugging Face Spaces
- View logs: Space > Logs tab
- Check metrics: Space > Runtime usage

### Vercel
- View logs: Deployment > Logs
- Check analytics: Project > Analytics

### Netlify
- View logs: Deploy log > Logs
- Check performance: Analytics tab
