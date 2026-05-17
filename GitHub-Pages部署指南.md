# 🚀 GitHub Pages部署完整指南

## 📋 前置准备

### 1. 以管理员身份打开PowerShell
按 `Win + X`，选择 **"Windows PowerShell (管理员)"**

### 2. 进入项目目录
```powershell
cd D:\dakaAgentProject\物流声音游戏
```

---

## 🎯 部署方案选择

### 方案A：纯前端版本（推荐，最简单）

**优点：** 零成本、无需后端、立即可用  
**限制：** 排行榜仅存储在用户浏览器本地

#### 步骤1：创建纯前端版本

```powershell
# 创建部署目录
mkdir deploy-gh-pages -Force
cd deploy-gh-pages

# 复制前端文件
Copy-Item -Recurse ..\frontend\src .\src
Copy-Item -Recurse ..\frontend\public .\public
Copy-Item ..\frontend\index.html .
Copy-Item ..\frontend\package.json .

# 复制音频文件
Copy-Item -Recurse ..\backend\public\sounds .\public\sounds

# 复制题目数据
Copy-Item ..\backend\data\questions.json .\public\data\
```

#### 步骤2：修改package.json

创建新的 `package.json`：

```json
{
  "name": "logistics-sound-game",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.2",
    "vite": "^5.0.8",
    "gh-pages": "^6.1.0"
  }
}
```

#### 步骤3：创建vite.config.js

```javascript
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
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
```

#### 步骤4：修改数据服务为localStorage

创建 `src/utils/dataService.js`：

```javascript
import questions from '@/data/questions.json';

const LEADERBOARD_KEY = 'logistics_game_leaderboard';
const MY_SCORES_KEY = 'logistics_game_my_scores';

export const questionService = {
  getQuestions(count = 10) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(q => ({
      id: q.id,
      audioUrl: q.audio_url,
      options: this.shuffleOptions(q.options),
      difficulty: q.difficulty,
      category: q.category,
      correct_answer: q.correct_answer,
      description: q.description,
      scene: q.scene
    }));
  },
  
  shuffleOptions(options) {
    return [...options].sort(() => Math.random() - 0.5);
  },
  
  getQuestionById(id) {
    return questions.find(q => q.id === id);
  }
};

export const leaderboardService = {
  submitScore(nickname, score, correctRate, timeUsed) {
    const leaderboard = this.getLeaderboard('all');
    
    leaderboard.push({
      nickname,
      score,
      correctRate,
      timeUsed,
      createdAt: new Date().toISOString()
    });
    
    leaderboard.sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed);
    const trimmed = leaderboard.slice(0, 100);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
    
    const rank = trimmed.findIndex(item => 
      item.nickname === nickname && item.score === score
    ) + 1;
    
    return {
      rank,
      isRecord: this.checkRecord(score)
    };
  },
  
  getLeaderboard(type = 'weekly') {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    const all = data ? JSON.parse(data) : [];
    
    if (type === 'weekly') {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return all.filter(item => 
        new Date(item.createdAt).getTime() > weekAgo
      ).slice(0, 10);
    } else if (type === 'monthly') {
      const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      return all.filter(item => 
        new Date(item.createdAt).getTime() > monthAgo
      ).slice(0, 10);
    }
    
    return all.slice(0, 10);
  },
  
  checkRecord(newScore) {
    const myScores = this.getMyScores();
    return myScores.length === 0 || newScore > Math.max(...myScores.map(s => s.score));
  },
  
  getMyScores() {
    const data = localStorage.getItem(MY_SCORES_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveMyScore(score, correctRate, timeUsed) {
    const myScores = this.getMyScores();
    myScores.push({
      score,
      correctRate,
      timeUsed,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(MY_SCORES_KEY, JSON.stringify(myScores));
  },
  
  getHighestScore() {
    const myScores = this.getMyScores();
    return myScores.length > 0 ? Math.max(...myScores.map(s => s.score)) : 0;
  }
};

export const statsService = {
  recordGame(userId, score, correctRate, timeUsed, completed = true) {
    leaderboardService.saveMyScore(score, correctRate, timeUsed);
  },
  
  getOverview() {
    const myScores = leaderboardService.getMyScores();
    return {
      totalGames: myScores.length,
      avgScore: myScores.length > 0 
        ? Math.round(myScores.reduce((sum, s) => sum + s.score, 0) / myScores.length)
        : 0,
      avgCorrectRate: myScores.length > 0
        ? Math.round(myScores.reduce((sum, s) => sum + s.correctRate, 0) / myScores.length * 100)
        : 0,
      activeUsers: 1
    };
  }
};
```

#### 步骤5：修改API调用

修改 `src/stores/gameStore.js`：

```javascript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { questionService, leaderboardService, statsService } from '@/utils/dataService';

export const useGameStore = defineStore('game', () => {
  // ... 其他代码保持不变 ...
  
  async function startGame() {
    try {
      status.value = 'loading';
      questions.value = questionService.getQuestions(10);
      currentIndex.value = 0;
      score.value = 0;
      correctCount.value = 0;
      answers.value = [];
      consecutiveCorrect.value = 0;
      startTime.value = Date.now();
      status.value = 'playing';
    } catch (error) {
      console.error('开始游戏失败:', error);
      status.value = 'error';
    }
  }
  
  function answerQuestion(selectedOption) {
    if (!currentQuestion.value) return;
    
    const question = currentQuestion.value;
    const isCorrect = selectedOption === question.correct_answer;
    
    if (isCorrect) {
      correctCount.value++;
      consecutiveCorrect.value++;
      const bonus = consecutiveCorrect.value > 1 ? 5 : 0;
      score.value += 10 + bonus;
    } else {
      consecutiveCorrect.value = 0;
    }
    
    answers.value.push({
      questionId: question.id,
      selectedOption,
      correctAnswer: question.correct_answer,
      isCorrect,
      description: question.description,
      scene: question.scene
    });
    
    return {
      isCorrect,
      correctAnswer: question.correct_answer,
      description: question.description,
      scene: question.scene
    };
  }
  
  // ... 其他方法 ...
});
```

#### 步骤6：安装依赖并部署

```powershell
# 安装依赖
npm install

# 本地测试
npm run dev
# 访问 http://localhost:5173 确认正常

# 构建
npm run build

# 部署到GitHub Pages
npx gh-pages -d dist
```

---

## 🔄 方案B：Vercel + GitHub Pages（保留完整功能）

### 步骤1：部署后端到Vercel

```powershell
# 安装Vercel CLI
npm i -g vercel

# 部署后端
cd backend
vercel

# 记下分配的URL，如：https://logistics-sound-api.vercel.app
```

### 步骤2：修改前端API地址

编辑 `frontend/src/api/index.js`：

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://logistics-sound-api.vercel.app/api',
  timeout: 10000
});

// ... 其他代码 ...
```

### 步骤3：部署前端到GitHub Pages

```powershell
cd frontend
npm install --save-dev gh-pages

# 修改vite.config.js，添加base
# base: '/logistics-sound-game/'

npm run build
npx gh-pages -d dist
```

---

## ✅ 部署完成检查清单

部署完成后，访问 `https://daka-agent.github.io/logistics-sound-game/`，检查：

- [ ] 页面能正常打开
- [ ] 音频能正常播放
- [ ] 游戏流程完整（答题→反馈→下一题）
- [ ] 积分计算正确
- [ ] 排行榜显示正常
- [ ] 移动端显示正常

---

## 🐛 常见问题

### Q1: 页面空白
**原因：** base路径配置错误  
**解决：** 检查 `vite.config.js` 的 `base` 是否为 `/logistics-sound-game/`

### Q2: 音频无法播放
**原因：** 音频文件未正确部署  
**解决：** 
- 检查 `public/sounds/` 目录是否存在
- 检查音频文件名是否与代码中路径匹配
- 查看浏览器控制台Network面板

### Q3: 排行榜不显示
**原因：** localStorage未正确工作  
**解决：** 
- 检查浏览器是否禁用了localStorage
- 检查 `dataService.js` 是否正确引入

### Q4: 样式丢失
**原因：** CSS文件路径错误  
**解决：** 
- 检查构建后的 `dist/` 目录结构
- 确认 `vite.config.js` 的 `assetsDir` 配置

---

## 📊 部署后维护

### 更新游戏

```powershell
# 修改代码后重新部署
npm run build
npx gh-pages -d dist
```

### 查看部署日志

访问：https://github.com/daka-agent/logistics-sound-game/deployments

### 自定义域名（可选）

1. 在仓库Settings → Pages → Custom domain
2. 输入你的域名
3. 在域名DNS添加CNAME记录指向 `daka-agent.github.io`

---

## 🎉 部署成功！

游戏将可通过以下地址访问：

**https://daka-agent.github.io/logistics-sound-game/**

分享给朋友一起玩吧！🎮
