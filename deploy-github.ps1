# 物流声音游戏 - GitHub Pages一键部署

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "物流声音游戏 - GitHub Pages部署" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Git
Write-Host "[1/7] 检查Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "Git已安装: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未安装Git" -ForegroundColor Red
    Write-Host "请先安装Git: https://git-scm.com/downloads" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

# 询问GitHub用户名
Write-Host ""
Write-Host "[2/7] GitHub配置" -ForegroundColor Yellow
$githubUser = Read-Host "请输入你的GitHub用户名"
$repoName = "logistics-sound-game"

if ([string]::IsNullOrWhiteSpace($githubUser)) {
    Write-Host "错误: 用户名不能为空" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 初始化Git仓库
Write-Host ""
Write-Host "[3/7] 初始化Git仓库..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    git add .
    git commit -m "Initial commit: Logistics Sound Game"
    Write-Host "Git仓库初始化完成" -ForegroundColor Green
} else {
    Write-Host "Git仓库已存在" -ForegroundColor Green
}

# 安装gh-pages
Write-Host ""
Write-Host "[4/7] 安装gh-pages..." -ForegroundColor Yellow
Set-Location frontend
if (-not (Test-Path "node_modules\gh-pages")) {
    npm install --save-dev gh-pages
    Write-Host "gh-pages安装完成" -ForegroundColor Green
} else {
    Write-Host "gh-pages已安装" -ForegroundColor Green
}

# 修改vite.config.js
Write-Host ""
Write-Host "[5/7] 配置GitHub Pages路径..." -ForegroundColor Yellow
$viteConfig = @"
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  base: '/$repoName/',
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
Write-Host "Vite配置已更新" -ForegroundColor Green

# 构建项目
Write-Host ""
Write-Host "[6/7] 构建项目..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "构建完成" -ForegroundColor Green

# 部署
Write-Host ""
Write-Host "[7/7] 部署到GitHub Pages..." -ForegroundColor Yellow
Write-Host ""
Write-Host "请按以下步骤操作：" -ForegroundColor Cyan
Write-Host "1. 在GitHub创建仓库: https://github.com/new" -ForegroundColor White
Write-Host "   仓库名: $repoName" -ForegroundColor Yellow
Write-Host "   设为Public" -ForegroundColor White
Write-Host ""
Write-Host "2. 创建完成后，执行以下命令：" -ForegroundColor Cyan
Write-Host "   git remote add origin https://github.com/$githubUser/$repoName.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host "   npm run deploy" -ForegroundColor White
Write-Host ""
Write-Host "3. 访问游戏：" -ForegroundColor Cyan
Write-Host "   https://$githubUser.github.io/$repoName/" -ForegroundColor Green
Write-Host ""

Read-Host "按回车键继续"
