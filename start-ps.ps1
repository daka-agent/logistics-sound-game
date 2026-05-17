# 物流声音猜题游戏 - PowerShell启动脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "物流声音猜题游戏 - 启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js
Write-Host "[1/5] 检查Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "Node.js已安装: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未安装Node.js，请先安装Node.js 18+" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 安装后端依赖
Write-Host ""
Write-Host "[2/5] 安装后端依赖..." -ForegroundColor Yellow
Set-Location backend
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "后端依赖安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
}
Write-Host "后端依赖已就绪" -ForegroundColor Green

# 安装前端依赖
Write-Host ""
Write-Host "[3/5] 安装前端依赖..." -ForegroundColor Yellow
Set-Location ..\frontend
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "前端依赖安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
}
Write-Host "前端依赖已就绪" -ForegroundColor Green

# 初始化数据库
Write-Host ""
Write-Host "[4/5] 初始化数据库..." -ForegroundColor Yellow
Set-Location ..\backend
if (-not (Test-Path "data\game.db")) {
    npm run init-db
    if ($LASTEXITCODE -ne 0) {
        Write-Host "数据库初始化失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
}
Write-Host "数据库已就绪" -ForegroundColor Green

# 启动服务
Write-Host ""
Write-Host "[5/5] 启动服务..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "服务地址:" -ForegroundColor Cyan
Write-Host "后端: http://localhost:3000" -ForegroundColor White
Write-Host "前端: http://localhost:5173" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "按Ctrl+C停止服务" -ForegroundColor Yellow
Write-Host ""

# 启动后端
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev; Write-Host '后端服务已停止' -ForegroundColor Red"
Start-Sleep -Seconds 2

# 启动前端
Set-Location ..\frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev; Write-Host '前端服务已停止' -ForegroundColor Red"

Write-Host ""
Write-Host "服务已启动！请访问 http://localhost:5173" -ForegroundColor Green
Write-Host ""
Read-Host "按回车键退出（服务将继续运行）"
