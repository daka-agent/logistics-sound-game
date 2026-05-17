@echo off
echo ========================================
echo 物流声音猜题游戏 - 启动脚本
echo ========================================
echo.

echo [1/4] 检查Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未安装Node.js，请先安装Node.js 18+
    pause
    exit /b 1
)
echo Node.js已安装

echo.
echo [2/4] 安装后端依赖...
cd backend
if not exist node_modules (
    call npm install
)
echo 后端依赖已就绪

echo.
echo [3/4] 安装前端依赖...
cd ..\frontend
if not exist node_modules (
    call npm install
)
echo 前端依赖已就绪

echo.
echo [4/4] 初始化数据库...
cd ..\backend
if not exist data\game.db (
    call npm run init-db
)
echo 数据库已就绪

echo.
echo ========================================
echo 启动服务...
echo ========================================
echo.
echo 后端服务: http://localhost:3000
echo 前端服务: http://localhost:5173
echo.
echo 按Ctrl+C停止服务
echo.

start "后端服务" cmd /k "cd backend && npm run dev"
timeout /t 2 >nul
start "前端服务" cmd /k "cd frontend && npm run dev"

echo.
echo 服务已启动，请访问 http://localhost:5173
pause
