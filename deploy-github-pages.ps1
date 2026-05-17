# GitHub Pages Deployment Script
# Run this script as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Pages Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set location
$projectPath = "D:\dakaAgentProject\物流声音游戏"
Set-Location $projectPath

# Step 1: Configure Git
Write-Host "[1/6] Configuring Git..." -ForegroundColor Yellow
git config user.email "daka-agent@example.com"
git config user.name "daka-agent"
Write-Host "Git configured" -ForegroundColor Green

# Step 2: Update vite.config.js
Write-Host ""
Write-Host "[2/6] Updating vite.config.js..." -ForegroundColor Yellow
Set-Location frontend
$viteConfig = @"
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  base: '/logistics-sound-game/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
"@
Set-Content -Path "vite.config.js" -Value $viteConfig -Encoding UTF8
Write-Host "Vite config updated" -ForegroundColor Green

# Step 3: Install dependencies
Write-Host ""
Write-Host "[3/6] Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "Dependencies installed" -ForegroundColor Green

# Step 4: Install gh-pages
Write-Host ""
Write-Host "[4/6] Installing gh-pages..." -ForegroundColor Yellow
npm install --save-dev gh-pages
Write-Host "gh-pages installed" -ForegroundColor Green

# Step 5: Build project
Write-Host ""
Write-Host "[5/6] Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Build completed" -ForegroundColor Green

# Step 6: Deploy
Write-Host ""
Write-Host "[6/6] Deploying to GitHub Pages..." -ForegroundColor Yellow
npx gh-pages -d dist
if ($LASTEXITCODE -ne 0) {
    Write-Host "Deploy failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your game is now available at:" -ForegroundColor White
Write-Host "https://daka-agent.github.io/logistics-sound-game/" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Commit and push changes
Write-Host "Committing changes to GitHub..." -ForegroundColor Yellow
Set-Location $projectPath
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

Write-Host ""
Write-Host "All done! Your game is live!" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"
