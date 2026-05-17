# 在管理员PowerShell中执行此脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploy to GitHub Pages" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 进入前端目录
Set-Location D:\dakaAgentProject\物流声音游戏\frontend

# 步骤1：构建
Write-Host "[1/3] Building..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed, trying alternative..." -ForegroundColor Yellow
    # 清理缓存重试
    Remove-Item node_modules\.vite -Recurse -Force -ErrorAction SilentlyContinue
    npm run build
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
} else {
    Write-Host "Build still failed, checking dist..." -ForegroundColor Yellow
    if (Test-Path dist\index.html) {
        Write-Host "Using existing dist" -ForegroundColor Green
    } else {
        Write-Host "No dist available, aborting" -ForegroundColor Red
        exit 1
    }
}

# 步骤2：部署
Write-Host ""
Write-Host "[2/3] Deploying to GitHub Pages..." -ForegroundColor Yellow
npx gh-pages -d dist -b gh-pages
if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploy successful!" -ForegroundColor Green
} else {
    Write-Host "Deploy failed" -ForegroundColor Red
    exit 1
}

# 步骤3：完成
Write-Host ""
Write-Host "[3/3] Done!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Your game is now live at:" -ForegroundColor White
Write-Host "https://daka-agent.github.io/logistics-sound-game/" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
