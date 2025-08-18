const path = require("path");
const pug = require("pug");
const juice = require("juice");
const transporter = require("../config/nodemailer");
const subjects = require("../config/emailSubjects");
const logger = require("../utils/logger");
const retry = require("../utils/retry");
const requiredFields = require("../config/templateRequirements")

const MAX_EMAIL_SIZE = process.env.MAX_EMAIL_SIZE
  ? parseInt(process.env.MAX_EMAIL_SIZE, 10)
  : 1 * 1024 * 1024; // default 1 MB fallback

const sendEmail = async (req, res) => {
  try {
    const { to, template, variables } = req.body;
    logger.info(`Incoming email request to: ${to} with template: ${template}`);

    const missing = requiredFields[template]?.filter(field => !variables[field]);
    if (missing && missing.length > 0) {
      logger.warn(`Validation failed: Missing required variables for template "${template}": ${missing.join(', ')}`);
      return res.status(400).json({ error: `Missing required variables: ${missing.join(', ')}` });
    }

    const templatePath = path.join(__dirname, "..", "views", "emails", `${template}.pug`);

    const rawHtml = pug.renderFile(templatePath, variables);
    logger.info(`Template rendered successfully: ${template}`);

    const inlinedHtml = juice(rawHtml);
    logger.info(`Juice convereted to inline html for template: ${template}`);

    if (Buffer.byteLength(inlinedHtml, 'utf8') > MAX_EMAIL_SIZE) {
      const error = new Error("Email content too large");
      error.code = "EMAIL_SIZE_LIMIT";
      logger.warn(`Email content too large: ${Buffer.byteLength(inlinedHtml, 'utf8')} bytes`)
      throw error;
      
    }

    const subject = subjects[template] || subjects.default;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: inlinedHtml,
    };

    const info = await retry(
      () => transporter.sendMail(mailOptions),
      3, // maxAttempts
      1000 // delayMs
    );

    logger.info(`Email sent to ${to} (Message ID: ${info?.messageId})`);
    return res.status(200).json({ message: "Email sent", info });

  } catch (error) {
    logger.error(`Unhandled error: ${error.stack || error.message}`);
    if (error.code === "EMAIL_SIZE_LIMIT") {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to send email" });
    
  }
};

module.exports = { sendEmail };
