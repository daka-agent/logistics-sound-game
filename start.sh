#!/bin/bash

echo "========================================"
echo "物流声音猜题游戏 - 启动脚本"
echo "========================================"
echo ""

echo "[1/4] 检查Node.js..."
if ! command -v node &> /dev/null; then
    echo "错误: 未安装Node.js，请先安装Node.js 18+"
    exit 1
fi
echo "Node.js已安装: $(node -v)"

echo ""
echo "[2/4] 安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
echo "后端依赖已就绪"

echo ""
echo "[3/4] 安装前端依赖..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
echo "前端依赖已就绪"

echo ""
echo "[4/4] 初始化数据库..."
cd ../backend
if [ ! -f "data/game.db" ]; then
    npm run init-db
fi
echo "数据库已就绪"

echo ""
echo "========================================"
echo "启动服务..."
echo "========================================"
echo ""
echo "后端服务: http://localhost:3000"
echo "前端服务: http://localhost:5173"
echo ""
echo "按Ctrl+C停止服务"
echo ""

npm run dev &
BACKEND_PID=$!
cd ../frontend
npm run dev &
FRONTEND_PID=$!

wait
