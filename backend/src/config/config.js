const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  
  db: {
    path: path.join(__dirname, '../../data/game.db')
  },
  
  rateLimit: {
    windowMs: 60 * 1000,
    max: 100
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  
  game: {
    questionsPerGame: 10,
    maxSubmitPerDay: 10
  }
};
