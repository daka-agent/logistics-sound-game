# 部署到GitHub Pages指南

## 方案A：纯前端版本（推荐）

### 核心改动

1. **移除后端依赖**
   - 删除 `backend/` 目录
   - 移除所有 `/api` 接口调用

2. **数据存储改为localStorage**
   - 排行榜数据：`localStorage.getItem('leaderboard')`
   - 个人成绩：`localStorage.getItem('myScores')`
   - 统计数据：`localStorage.getItem('stats')`

3. **题目数据打包到前端**
   - 将 `backend/data/questions.json` 移到 `frontend/public/data/`
   - 音频文件移到 `frontend/public/sounds/`

### 改造步骤

#### 步骤1：修改数据服务

创建 `frontend/src/utils/dataService.js`：

```javascript
// 题目数据（内置）
import questions from '@/data/questions.json';

// 排行榜存储
const LEADERBOARD_KEY = 'logistics_game_leaderboard';
const MY_SCORES_KEY = 'logistics_game_my_scores';

export const questionService = {
  getQuestions(count = 10) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  },
  
  getQuestionById(id) {
    return questions.find(q => q.id === id);
  }
};

export const leaderboardService = {
  submitScore(nickname, score, correctRate, timeUsed) {
    const leaderboard = this.getLeaderboard();
    
    leaderboard.push({
      nickname,
      score,
      correctRate,
      timeUsed,
      createdAt: new Date().toISOString()
    });
    
    // 按分数排序，保留前100名
    leaderboard.sort((a, b) => b.score - a.score);
    const trimmed = leaderboard.slice(0, 100);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
    
    return {
      rank: trimmed.findIndex(item => item.nickname === nickname && item.score === score) + 1,
      isRecord: this.checkRecord(score)
    };
  },
  
  getLeaderboard(type = 'weekly') {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    const all = data ? JSON.parse(data) : [];
    
    if (type === 'weekly') {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return all.filter(item => new Date(item.createdAt).getTime() > weekAgo);
    }
    
    return all;
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
```

#### 步骤2：修改gameStore

`frontend/src/stores/gameStore.js` 中移除API调用：

```javascript
import { questionService, leaderboardService } from '@/utils/dataService';

// startGame 方法改为：
async function startGame() {
  status.value = 'loading';
  questions.value = questionService.getQuestions(10);
  currentIndex.value = 0;
  score.value = 0;
  correctCount.value = 0;
  answers.value = [];
  consecutiveCorrect.value = 0;
  startTime.value = Date.now();
  status.value = 'playing';
}

// answerQuestion 方法改为：
function answerQuestion(selectedOption) {
  const question = questions.value[currentIndex.value];
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
```

#### 步骤3：修改vite.config.js

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/logistics-sound-game/', // GitHub仓库路径
  build: {
    outDir: 'dist'
  }
});
```

#### 步骤4：添加部署脚本

`package.json`：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.1.0"
  }
}
```

### 部署流程

#### 1. 创建GitHub仓库

```bash
# 在GitHub创建仓库：logistics-sound-game
```

#### 2. 初始化Git

```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/logistics-sound-game.git
git push -u origin main
```

#### 3. 安装gh-pages

```bash
npm install --save-dev gh-pages
```

#### 4. 部署

```bash
npm run deploy
```

#### 5. 访问

游戏将部署到：
**https://你的用户名.github.io/logistics-sound-game/**

---

## 方案B：Vercel后端（可选）

如果想保留完整排行榜功能：

### 1. 部署后端到Vercel

```bash
# 安装Vercel CLI
npm i -g vercel

# 在backend目录
cd backend
vercel
```

### 2. 修改前端API地址

`frontend/src/api/index.js`：

```javascript
const api = axios.create({
  baseURL: 'https://你的vercel地址.vercel.app/api',
  timeout: 10000
});
```

### 3. 部署前端到GitHub Pages

同方案A的步骤3-5

---

## 文件结构

### 纯前端版本结构

```
frontend/
├── public/
│   ├── data/
│   │   └── questions.json      # 题目数据
│   └── sounds/
│       ├── truck-engine.mp3    # 音频文件
│       ├── forklift-reverse.mp3
│       └── ...
├── src/
│   ├── views/                  # 页面组件
│   ├── stores/                 # Pinia状态管理
│   ├── utils/
│   │   └── dataService.js      # 数据服务（localStorage）
│   ├── router/
│   ├── assets/
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```

---

## 注意事项

1. **音频文件大小**
   - 单个音频 ≤ 500KB
   - 总大小建议 ≤ 5MB
   - 可使用在线音频URL减少体积

2. **localStorage限制**
   - 单域名上限约5-10MB
   - 排行榜建议只保留前100名

3. **跨域问题**
   - 纯前端版本无跨域问题
   - 音频文件必须同源或使用CORS支持的CDN

4. **性能优化**
   - 音频预加载
   - 图片压缩
   - 代码分割（已在Vite中自动处理）

---

## 测试清单

- [ ] 本地运行 `npm run dev` 正常
- [ ] 构建成功 `npm run build`
- [ ] 预览正常 `npm run preview`
- [ ] 音频播放正常
- [ ] 排行榜保存正常
- [ ] 移动端适配正常
- [ ] 部署到GitHub Pages成功
- [ ] 线上访问正常
