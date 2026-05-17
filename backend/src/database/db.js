const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

let db = null;
let SQL = null;

async function initDatabase() {
  if (db) return db;
  
  SQL = await initSqlJs();
  
  const dbPath = config.db.path;
  const dbDir = path.dirname(dbPath);
  
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  
  return db;
}

function saveDatabase() {
  if (!db) return;
  
  const data = db.export();
  const buffer = Buffer.from(data);
  const dbPath = config.db.path;
  
  fs.writeFileSync(dbPath, buffer);
}

function run(sql, params = []) {
  if (!db) throw new Error('数据库未初始化');
  
  db.run(sql, params);
  saveDatabase();
}

function get(sql, params = []) {
  if (!db) throw new Error('数据库未初始化');
  
  const stmt = db.prepare(sql);
  stmt.bind(params);
  
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  
  stmt.free();
  return null;
}

function all(sql, params = []) {
  if (!db) throw new Error('数据库未初始化');
  
  const stmt = db.prepare(sql);
  stmt.bind(params);
  
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  
  stmt.free();
  return results;
}

function exec(sql) {
  if (!db) throw new Error('数据库未初始化');
  
  db.run(sql);
  saveDatabase();
}

function close() {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
  }
}

module.exports = {
  initDatabase,
  run,
  get,
  all,
  exec,
  close
};
