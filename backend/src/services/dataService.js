const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const scoresFile = path.join(dataDir, 'scores.json');
const statsFile = path.join(dataDir, 'game-stats.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function readScores() {
  try {
    if (fs.existsSync(scoresFile)) {
      return JSON.parse(fs.readFileSync(scoresFile, 'utf8'));
    }
  } catch (error) {
    console.error('读取scores失败:', error);
  }
  return [];
}

function writeScores(scores) {
  fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2));
}

function readStats() {
  try {
    if (fs.existsSync(statsFile)) {
      return JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    }
  } catch (error) {
    console.error('读取stats失败:', error);
  }
  return { totalGames: 0, records: [] };
}

function writeStats(stats) {
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
}

class LeaderboardService {
  submitScore(userId, nickname, score, correctRate, timeUsed) {
    const scores = readScores();
    
    scores.push({
      id: Date.now(),
      userId,
      nickname,
      score,
      correctRate,
      timeUsed,
      createdAt: new Date().toISOString()
    });
    
    writeScores(scores);
    
    const sorted = scores.sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed);
    const rank = sorted.findIndex(s => s.userId === userId && s.score === score) + 1;
    
    const userScores = scores.filter(s => s.userId === userId);
    const highest = userScores.length > 0 ? Math.max(...userScores.map(s => s.score)) : 0;
    const isRecord = score >= highest;
    
    return { rank, isRecord };
  }
  
  getLeaderboard(type = 'weekly', limit = 10) {
    const scores = readScores();
    const now = new Date();
    
    let filtered = scores;
    
    if (type === 'weekly') {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      filtered = scores.filter(s => new Date(s.createdAt) >= weekAgo);
    } else if (type === 'monthly') {
      const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
      filtered = scores.filter(s => new Date(s.createdAt) >= monthAgo);
    }
    
    const sorted = filtered.sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed);
    
    return sorted.slice(0, limit).map((item, index) => ({
      rank: index + 1,
      nickname: item.nickname,
      score: item.score,
      correctRate: Math.round(item.correctRate * 100),
      timeUsed: item.timeUsed,
      createdAt: item.createdAt
    }));
  }
  
  getUserRank(targetScore) {
    const scores = readScores();
    const higher = scores.filter(s => s.score > targetScore).length;
    return higher + 1;
  }
  
  getUserHighestScore(userId) {
    const scores = readScores();
    const userScores = scores.filter(s => s.userId === userId);
    if (userScores.length === 0) return 0;
    return Math.max(...userScores.map(s => s.score));
  }
}

class StatsService {
  recordGame(userId, score, correctRate, timeUsed, completed = true) {
    const stats = readStats();
    
    stats.totalGames++;
    stats.records.push({
      userId,
      score,
      correctRate,
      timeUsed,
      completed,
      createdAt: new Date().toISOString()
    });
    
    writeStats(stats);
  }
  
  getOverview() {
    const stats = readStats();
    const scores = readScores();
    
    const today = new Date().toDateString();
    const activeUsers = new Set(
      stats.records
        .filter(r => new Date(r.createdAt).toDateString() === today)
        .map(r => r.userId)
    ).size;
    
    const completedRecords = stats.records.filter(r => r.completed);
    const avgScore = completedRecords.length > 0
      ? Math.round(completedRecords.reduce((sum, r) => sum + r.score, 0) / completedRecords.length)
      : 0;
    const avgCorrectRate = completedRecords.length > 0
      ? Math.round(completedRecords.reduce((sum, r) => sum + r.correctRate, 0) / completedRecords.length * 100)
      : 0;
    
    return {
      totalGames: stats.totalGames,
      avgScore,
      avgCorrectRate,
      activeUsers
    };
  }
}

module.exports = {
  leaderboardService: new LeaderboardService(),
  statsService: new StatsService()
};
