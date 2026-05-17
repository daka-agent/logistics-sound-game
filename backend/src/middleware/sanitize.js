const xss = require('xss');

const xssOptions = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style']
};

function sanitizeInput(input) {
  if (typeof input === 'string') {
    return xss(input, xssOptions);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }
  return input;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return xss(str, xssOptions);
}

function sanitizeMiddleware(req, res, next) {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  if (req.params) {
    req.params = sanitizeInput(req.params);
  }
  next();
}

module.exports = {
  sanitizeInput,
  sanitizeString,
  sanitizeMiddleware
};
