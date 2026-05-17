# 贡献指南

感谢你对物流之声项目的关注！欢迎提交 Issue 和 Pull Request。

## 开发流程

### 1. Fork 仓库

点击右上角 Fork 按钮，将项目 Fork 到你的账号下。

### 2. 克隆到本地

```bash
git clone https://github.com/你的用户名/logistics-sound-game.git
cd logistics-sound-game
```

### 3. 安装依赖

```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../frontend
npm install
```

### 4. 创建分支

```bash
git checkout -b feature/你的功能名称
```

### 5. 开发和测试

```bash
# 启动后端
cd backend
npm run dev

# 启动前端（新终端）
cd frontend
npm run dev
```

### 6. 提交代码

```bash
git add .
git commit -m "feat: 添加某功能"
```

提交信息规范：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具链相关

### 7. 推送和创建PR

```bash
git push origin feature/你的功能名称
```

然后在 GitHub 上创建 Pull Request。

## 代码规范

### JavaScript/Vue
- 使用 2 空格缩进
- 使用单引号字符串
- 变量命名使用驼峰式
- 函数命名使用驼峰式
- 常量使用大写下划线

### 提交要求
- 确保代码能正常运行
- 添加必要的注释
- 更新相关文档
- 遵循现有代码风格

## 测试

```bash
# 运行后端测试
cd backend
npm test

# 运行前端测试（如有）
cd frontend
npm test
```

## 目录结构

```
物流声音游戏/
├── backend/          # 后端代码
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── services/      # 服务层
│   │   ├── routes/        # 路由
│   │   └── middleware/    # 中间件
│   └── tests/             # 测试
│
├── frontend/         # 前端代码
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── stores/        # 状态管理
│   │   └── api/           # API接口
│   └── public/            # 静态资源
│
└── README.md         # 项目说明
```

## 问题反馈

如果发现问题或有建议，请：
1. 先搜索是否已有相关 Issue
2. 如果没有，创建新 Issue
3. 详细描述问题和复现步骤
4. 添加相关截图或日志

再次感谢你的贡献！🎉
