const express = require('express');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config/config');
const { errorHandler } = require('./middleware/errorHandler');
const { sanitizeMiddleware } = require('./middleware/sanitize');

const questionRoutes = require('./routes/questionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

app.use(cors(config.cors));
app.use(compression());
app.use(express.json());
app.use(sanitizeMiddleware);

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

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`物流之声API服务已启动`);
  console.log(`端口: ${PORT}`);
  console.log(`环境: ${config.env}`);
});

module.exports = app;
