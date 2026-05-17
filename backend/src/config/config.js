const path = require('path');

const env = process.env.NODE_ENV || 'development';

const corsOrigins = {
  development: '*',
  production: process.env.CORS_ORIGIN || false,
  test: '*'
};

module.exports = {
  port: process.env.PORT || 3000,
  env,
  
  db: {
    path: path.join(__dirname, '../../data/game.db')
  },
  
  rateLimit: {
    windowMs: 60 * 1000,
    max: env === 'production' ? 60 : 100
  },
  
  cors: {
    origin: corsOrigins[env] || corsOrigins.development,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  
  game: {
    questionsPerGame: 10,
    maxSubmitPerDay: 10
  }
};
