const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const emailLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,              // limit each IP to 5 requests per windowMs
  message: 'Too many requests. Please try again later.',
  standardHeaders: true,  // return rate limit info in RateLimit-* headers
  legacyHeaders: false,   // disable X-RateLimit-* headers
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP ${req.ip}`);
    res.status(options.statusCode).json({ error: options.message });
  },
});

module.exports = emailLimiter;
