# 手动部署到GitHub Pages（解决网络问题）

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Manual GitHub Pages Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "D:\dakaAgentProject\物流声音游戏"
Set-Location $projectPath\frontend

# Step 1: Build
Write-Host "[1/4] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Build completed" -ForegroundColor Green

# Step 2: Create gh-pages branch
Write-Host ""
Write-Host "[2/4] Preparing gh-pages branch..." -ForegroundColor Yellow
Set-Location $projectPath

# Check if gh-pages branch exists
$branchExists = git branch --list "gh-pages"
if ($branchExists) {
    git branch -D gh-pages
}

# Create new gh-pages branch from dist
Set-Location frontend
git --git-dir=../.git --work-tree=dist checkout --orphan gh-pages
git --git-dir=../.git --work-tree=dist add -A
git --git-dir=../.git --work-tree=dist commit -m "Deploy to GitHub Pages"

Write-Host "gh-pages branch created" -ForegroundColor Green

# Step 3: Push
Write-Host ""
Write-Host "[3/4] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Please push the gh-pages branch manually if network fails:" -ForegroundColor Yellow
Write-Host "  git push origin gh-pages" -ForegroundColor Cyan

try {
    git --git-dir=../.git push origin gh-pages --force
    Write-Host "Push successful!" -ForegroundColor Green
} catch {
    Write-Host "Push failed (network issue)" -ForegroundColor Red
    Write-Host "Please push manually or use GitHub Desktop" -ForegroundColor Yellow
}

# Step 4: Instructions
Write-Host ""
Write-Host "[4/4] Enable GitHub Pages" -ForegroundColor Yellow
Write-Host ""
Write-Host "Please complete these steps manually:" -ForegroundColor Cyan
Write-Host "1. Visit: https://github.com/daka-agent/logistics-sound-game/settings/pages"
Write-Host "2. Source: Deploy from a branch"
Write-Host "3. Branch: gh-pages / (root)"
Write-Host "4. Click Save"
Write-Host ""
Write-Host "Your game will be available at:" -ForegroundColor Green
Write-Host "https://daka-agent.github.io/logistics-sound-game/" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
