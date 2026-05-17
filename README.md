# 🎮 物流声音猜题游戏

一个有趣的Web游戏，通过听物流相关的声音来猜测场景，在娱乐中学习物流知识。

![游戏截图](screenshot.png)

## 🌟 特色功能

- ✅ **听声音猜场景** - 10道题目，涵盖运输车辆、装卸设备、仓储设施
- ✅ **积分系统** - 答对+10分，连续答对额外+5分奖励
- ✅ **实时排行榜** - 周榜/月榜，挑战自我
- ✅ **知识科普** - 每题附带声音描述和场景说明
- ✅ **键盘快捷键** - 支持1/2/3/4快速选择
- ✅ **移动端适配** - 完美支持手机、平板

## 🎯 在线体验

👉 **[立即游玩](https://daka-agent.github.io/logistics-sound-game/)**

## 📦 本地运行

### 前置要求

- Node.js 18+
- npm 或 yarn

### 快速启动

```bash
# 克隆仓库
git clone https://github.com/daka-agent/logistics-sound-game.git
cd logistics-sound-game

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问游戏
打开浏览器访问 http://localhost:5173
```

### 完整启动（含后端）

```bash
# 后端
cd backend
npm install
npm run init-db
npm run dev

# 前端（新终端）
cd frontend
npm install
npm run dev

# 访问
打开浏览器访问 http://localhost:5173
```

## 🎮 游戏玩法

1. 点击"播放声音"按钮，听物流设备的声音
2. 从4个选项中选择正确的答案
3. 查看答题反馈和知识科普
4. 完成10题，查看积分和排行榜

### 操作说明

- **鼠标点击** - 选择选项
- **键盘快捷键** - 按 `1` `2` `3` `4` 快速选择
- **重播按钮** - 再次播放当前题目音频

## 🎨 项目结构

```
logistics-sound-game/
├── backend/              # 后端API服务（Express + SQLite）
│   ├── src/
│   │   ├── app.js              # 应用入口
│   │   ├── routes/             # API路由
│   │   ├── controllers/        # 控制器
│   │   ├── services/           # 业务逻辑
│   │   └── database/           # 数据库初始化
│   ├── public/sounds/          # 音频素材
│   └── package.json
│
├── frontend/             # 前端Vue应用
│   ├── src/
│   │   ├── views/              # 页面组件
│   │   ├── stores/             # Pinia状态管理
│   │   ├── api/                # API接口
│   │   └── router/             # 路由配置
│   └── package.json
│
├── docs/                 # 项目文档
│   ├── PRD-物流声音猜题游戏.md
│   └── HLD-物流声音猜题游戏.md
│
└── README.md
```

## 🛠️ 技术栈

### 前端

- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 下一代前端构建工具
- **Pinia** - Vue状态管理
- **Vue Router** - 路由管理

### 后端

- **Node.js** - JavaScript运行时
- **Express** - Web应用框架
- **better-sqlite3** - SQLite数据库

## 📝 音频素材

游戏包含10个物流场景的音频：

### 运输车辆
- 🚛 卡车引擎启动
- 🚛 卡车气刹声
- 🚢 集装箱门开合声

### 装卸设备
- 🏗️ 叉车倒车提示音
- 🏗️ 叉车液压升降声
- 🏗️ 托盘碰撞声

### 仓储设施
- 📦 扫码枪滴声
- 📦 传送带运转声
- 📦 包裹滑落声
- 📦 胶带封箱声

音频来源：[Freesound.org](https://freesound.org) / [Pixabay](https://pixabay.com/sound-effects/)

## 🚀 部署

### 部署到GitHub Pages

```bash
# 构建
npm run build

# 部署
npm run deploy
```

详细部署指南请查看 [部署文档](docs/部署GitHub-Pages指南.md)

## 📊 项目文档

- [产品需求文档 (PRD)](docs/PRD-物流声音猜题游戏-202605171000.md)
- [技术设计文档 (HLD)](docs/HLD-物流声音猜题游戏-202605171000.md)
- [GitHub Pages部署指南](docs/部署GitHub-Pages指南.md)

## 🎯 路线图

- [x] 核心玩法实现
- [x] 积分系统
- [x] 排行榜
- [x] 音频播放
- [ ] 难度模式（简单/中等/困难）
- [ ] 限时挑战模式
- [ ] 每日挑战
- [ ] 成就系统
- [ ] PWA支持（离线可玩）
- [ ] 多语言支持

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 音频素材：Freesound.org, Pixabay
- 图标：Emoji
- 灵感来源：各类声音猜谜游戏

## 📮 联系方式

- 项目主页：https://github.com/daka-agent/logistics-sound-game
- 问题反馈：https://github.com/daka-agent/logistics-sound-game/issues

---

⭐ 如果这个项目对你有帮助，请给一个 Star！⭐
