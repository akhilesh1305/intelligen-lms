# IntelliGen LMS — deploy to Vercel (frontend) + existing PostgreSQL
# Run: powershell -ExecutionPolicy Bypass -File scripts/deploy-vercel.ps1

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

Write-Host ""
Write-Host "=== IntelliGen LMS Vercel Deploy ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
  throw "Node.js / npm is required."
}

# Vercel CLI via npx (no global install required)
Write-Host "Checking Vercel CLI..."
npx --yes vercel@latest --version | Out-Host

if (-not $env:VERCEL_TOKEN) {
  Write-Host ""
  Write-Host "Sign in to Vercel (browser will open if needed)..." -ForegroundColor Yellow
  npx vercel@latest login
}

Write-Host ""
Write-Host "Linking project (create intelligen-lms if prompted)..."
npx vercel@latest link --yes 2>$null
if ($LASTEXITCODE -ne 0) {
  npx vercel@latest link
}

Write-Host ""
Write-Host "Required Vercel environment variables (Production):" -ForegroundColor Yellow
Write-Host "  DATABASE_URL          — from Railway Postgres or Vercel/Neon Postgres"
Write-Host "  SESSION_SECRET        — openssl rand -base64 32"
Write-Host "  AVATAR_STORAGE        — database"
Write-Host "  NEXT_PUBLIC_APP_URL   — https://your-vercel-domain.vercel.app"
Write-Host "  CRON_SECRET           — random string (for scheduled quiz generation)"
Write-Host ""
Write-Host "Set in dashboard: https://vercel.com/dashboard -> Project -> Settings -> Environment Variables"
Write-Host "Or run: npx vercel env add DATABASE_URL production"
Write-Host ""

$pullEnv = Read-Host "Pull env from Vercel now? (y/N)"
if ($pullEnv -eq "y" -or $pullEnv -eq "Y") {
  npx vercel@latest env pull .env.vercel --environment=production
}

Write-Host ""
Write-Host "Deploying to production..."
npx vercel@latest deploy --prod

Write-Host ""
Write-Host "=== Deploy complete ===" -ForegroundColor Green
Write-Host "Dashboard: https://vercel.com/dashboard"
Write-Host "Connect GitHub: Project -> Settings -> Git for auto-deploy on push to main"
Write-Host ""
