# Connect GitHub repo to Vercel for auto-deploy on push to main
# Run: powershell -ExecutionPolicy Bypass -File scripts/connect-vercel-github.ps1

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

Write-Host ""
Write-Host "=== Connect GitHub to Vercel ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Grant Vercel access to intelligen-lms on GitHub" -ForegroundColor Yellow
Write-Host "  Opening GitHub App installations..."
Start-Process "https://github.com/settings/installations"
Write-Host "  -> Configure Vercel -> add repository: intelligen-lms -> Save"
Write-Host ""

$ready = Read-Host "Done with GitHub repo access? (y/N)"
if ($ready -ne "y" -and $ready -ne "Y") {
  Write-Host "Complete step 1, then run this script again." -ForegroundColor Yellow
  exit 0
}

Write-Host ""
Write-Host "Step 2: Connect via Vercel CLI..."
npx vercel@latest git connect --yes 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "GitHub connected! Pushes to main will auto-deploy." -ForegroundColor Green
  exit 0
}

Write-Host ""
Write-Host "CLI connect failed — finish in the Vercel dashboard:" -ForegroundColor Yellow
Start-Process "https://vercel.com/akhileshshamra1305-8650s-projects/intelligen-lms/settings/git"
Write-Host "  -> Connect Git Repository -> akhilesh1305/intelligen-lms -> branch: main"
Write-Host ""
Write-Host "Fallback: add VERCEL_TOKEN to GitHub Actions secrets (see .github/workflows/vercel-deploy.yml)"
Write-Host ""
