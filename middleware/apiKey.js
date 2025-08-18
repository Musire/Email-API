const logger = require('../utils/logger')

 const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    logger.warn(`Missing API key on ${req.method} ${req.originalUrl} from IP ${req.ip}`)
    return res.status(401).json({ error: "Unauthorized: Invalid or missing API key" });
  }

  if (apiKey !== process.env.EMAIL_API_KEY) {
    logger.warn(`Invalid API key attempt from IP ${req.ip}`)
    return res.status(401).json({ error: "Unauthorized: Invalid or missing API key" });
  }

  next();
};

module.exports = checkApiKey