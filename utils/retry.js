const logger = require('./logger');

const retry = async (fn, maxAttempts = 3, delayMs = 1000) => {
  let attempts = 0;
  let lastError;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      logger.info(`Attempt ${attempts}...`);
      return await fn();  // ✅ call the function (like transporter.sendMail)
    } catch (error) {
      lastError = error;
      logger.warn(`Attempt ${attempts} failed: ${error.message}`);
      if (attempts === maxAttempts) {
        logger.error(`All ${maxAttempts} attempts failed`);
        throw lastError;
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};

module.exports = retry;
