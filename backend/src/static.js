const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use('/sounds', express.static(path.join(__dirname, 'public/sounds')));

app.use((req, res, next) => {
  if (req.path.startsWith('/sounds')) {
    console.log(`音频请求: ${req.path}`);
  }
  next();
});

module.exports = app;
