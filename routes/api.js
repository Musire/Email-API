const { Router } = require('express');
const { sendEmail } = require('../controllers/emails');
const checkApiKey = require("../middleware/apiKey");
const validateEmailInput = require("../middleware/validateEmailInput");
const emailLimiter = require("../middleware/rateLimiter")

const router = Router();
const allowedTemplates = ['password-reset', 'welcome', 'verify', 'broken-template', 'store-order'];

router.post(
  '/email',
  checkApiKey,                         // 🔐 API key auth
  emailLimiter,                        // 🛡️ Rate limiter
  validateEmailInput(allowedTemplates),// ✅ Validation + sanitization
  sendEmail                            // 📤 Final handler
);

module.exports = router;
