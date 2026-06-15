# IntelliGen LMS — one-command Railway deploy
# Run: powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

Write-Host ""
Write-Host "=== IntelliGen LMS Railway Deploy ===" -ForegroundColor Cyan
Write-Host ""

# 1. Railway CLI
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
  Write-Host "Installing Railway CLI..."
  npm install -g @railway/cli
}

# 2. Login
$loggedIn = $false
try {
  $whoami = railway whoami 2>&1
  if ($LASTEXITCODE -eq 0) {
    $loggedIn = $true
    Write-Host "Railway: logged in as $whoami"
  }
} catch {
  $loggedIn = $false
}

if (-not $loggedIn) {
  Write-Host ""
  Write-Host 'Opening Railway login - complete sign-in in your browser...' -ForegroundColor Yellow
  Write-Host ""
  railway login
}

# 3. Git (optional — skip if git user identity is not configured)
if (-not (Test-Path .git)) {
  Write-Host "Initializing git repository..."
  git init
  git branch -M main
  git add -A
  git -c user.email="deploy@intelligen.lms" -c user.name="IntelliGen Deploy" commit -m "Initial commit - IntelliGen LMS production" 2>$null
}

# 4. Link or create project
if (-not (Test-Path .railway)) {
  Write-Host ""
  Write-Host "Creating Railway project intelligen-lms..."
  railway init --name intelligen-lms
}

# 5. PostgreSQL
Write-Host ""
Write-Host "Adding PostgreSQL database (safe to skip if already added)..."
railway add --database postgres 2>$null

# 6. Environment variables
$secret = [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
Write-Host "Setting production environment variables..."
railway variables --set "SESSION_SECRET=$secret" --skip-deploys
railway variables --set "NODE_ENV=production" --skip-deploys
railway variables --set "AVATAR_STORAGE=database" --skip-deploys

# Railway service reference for Postgres URL
$dbRef = '$' + '{{Postgres.DATABASE_URL}}'
railway variables --set "DATABASE_URL=$dbRef" --skip-deploys 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Note: Link DATABASE_URL in Railway dashboard if deploy fails." -ForegroundColor Yellow
  Write-Host "  Web service -> Variables -> Add Reference -> Postgres -> DATABASE_URL"
}

# 7. Deploy
Write-Host ""
Write-Host "Deploying to Railway (may take a few minutes)..."
railway up --detach

# 8. Public domain
Write-Host ""
Write-Host "Generating public domain..."
railway domain 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Add domain: Railway -> Web service -> Settings -> Networking -> Generate Domain"
}

Write-Host ""
Write-Host '=== Deploy started ===' -ForegroundColor Green
Write-Host ""
Write-Host 'Dashboard: https://railway.app/dashboard'
Write-Host 'Demo login: admin@intelligen.lms / password123'
Write-Host 'Change passwords before sharing publicly.'
Write-Host ""
