const express = require('express');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config/config');

const questionRoutes = require('./routes/questionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

app.use(cors(config.cors));
app.use(compression());
app.use(express.json());

app.use('/sounds', express.static(path.join(__dirname, '../public/sounds')));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED', message: '请求过于频繁,请稍后再试' }
  }
});
app.use('/api/', limiter);

app.use('/api/questions', questionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '服务正常' });
});

app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' }
  });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`物流声音猜题游戏API服务已启动`);
  console.log(`端口: ${PORT}`);
  console.log(`环境: ${config.env}`);
});

module.exports = app;
