const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const scoresFile = path.join(dataDir, 'scores.json');
const statsFile = path.join(dataDir, 'game-stats.json');

if (!require('fs').existsSync(dataDir)) {
  require('fs').mkdirSync(dataDir, { recursive: true });
}

let scoresCache = null;
let statsCache = null;
let scoresCacheTime = 0;
let statsCacheTime = 0;
const CACHE_TTL = 30000;

let scoresWriteLock = false;
let statsWriteLock = false;

async function readScores() {
  const now = Date.now();
  if (scoresCache && (now - scoresCacheTime) < CACHE_TTL) {
    return scoresCache;
  }
  
  try {
    const fsSync = require('fs');
    if (fsSync.existsSync(scoresFile)) {
      const data = await fs.readFile(scoresFile, 'utf8');
      scoresCache = JSON.parse(data);
      scoresCacheTime = now;
      return scoresCache;
    }
  } catch (error) {
    console.error('读取scores失败:', error);
  }
  return [];
}

async function writeScores(scores) {
  while (scoresWriteLock) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  scoresWriteLock = true;
  try {
    await fs.writeFile(scoresFile, JSON.stringify(scores, null, 2));
    scoresCache = scores;
    scoresCacheTime = Date.now();
  } catch (error) {
    console.error('写入scores失败:', error);
    throw error;
  } finally {
    scoresWriteLock = false;
  }
}

async function readStats() {
  const now = Date.now();
  if (statsCache && (now - statsCacheTime) < CACHE_TTL) {
    return statsCache;
  }
  
  try {
    const fsSync = require('fs');
    if (fsSync.existsSync(statsFile)) {
      const data = await fs.readFile(statsFile, 'utf8');
      statsCache = JSON.parse(data);
      statsCacheTime = now;
      return statsCache;
    }
  } catch (error) {
    console.error('读取stats失败:', error);
  }
  return { totalGames: 0, records: [] };
}

async function writeStats(stats) {
  while (statsWriteLock) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  statsWriteLock = true;
  try {
    await fs.writeFile(statsFile, JSON.stringify(stats, null, 2));
    statsCache = stats;
    statsCacheTime = Date.now();
  } catch (error) {
    console.error('写入stats失败:', error);
    throw error;
  } finally {
    statsWriteLock = false;
  }
}

class LeaderboardService {
  async submitScore(userId, nickname, score, correctRate, timeUsed) {
    const scores = await readScores();
    
    const recordId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    scores.push({
      id: recordId,
      userId,
      nickname,
      score,
      correctRate,
      timeUsed,
      createdAt: new Date().toISOString()
    });
    
    await writeScores(scores);
    
    const sorted = scores.sort((a, b) => b.score - a.score || a.timeUsed - b.timeUsed);
    const rank = sorted.findIndex(s => s.id === recordId) + 1;
    
    const userScores = scores.filter(s => s.userId === userId);
    const highest = userScores.length > 0 ? Math.max(...userScores.map(s => s.score)) : 0;
    const isRecord = score >= highest;
    
    return { rank, isRecord };
  }
  
  async getLeaderboard(type = 'weekly', limit = 10) {
    const scores = await readScores();
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
  
  async getUserRank(targetScore) {
    const scores = await readScores();
    const higher = scores.filter(s => s.score > targetScore).length;
    return higher + 1;
  }
  
  async getUserHighestScore(userId) {
    const scores = await readScores();
    const userScores = scores.filter(s => s.userId === userId);
    if (userScores.length === 0) return 0;
    return Math.max(...userScores.map(s => s.score));
  }
}

class StatsService {
  async recordGame(userId, score, correctRate, timeUsed, completed = true) {
    const stats = await readStats();
    
    stats.totalGames++;
    stats.records.push({
      userId,
      score,
      correctRate,
      timeUsed,
      completed,
      createdAt: new Date().toISOString()
    });
    
    await writeStats(stats);
  }
  
  async getOverview() {
    const stats = await readStats();
    const scores = await readScores();
    
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
