var validator = require('validator');
var sanitizeHtml = require('sanitize-html');
const logger = require('../utils/logger');

const MAX_SUBJECT_LENGTH = 150; // chars, adjust as needed
const MAX_VARIABLE_LENGTH = 2000; // max length per string variable

const validateEmailInput = (allowedTemplates) => (req, res, next) => {
  const { to, template, variables, subject } = req.body;

  if (!to) {
    logger.warn(`Validation failed: "to" field is missing in request body`)
    return res.status(400).json({ error: "'to' must be a valid email" });
  }

  if (!validator.isEmail(to)) {
    logger.warn(`Validation failed: Invalid email format (${to})`);
    return res.status(400).json({ error: "'to' must be a valid email" });
  }

  if (!template || !allowedTemplates.includes(template)) {
    logger.warn(`Validation failed: Template "${template}" is not allowed`)
    return res.status(400).json({ error: "'template' is invalid" });
  }

  if (!variables || typeof variables !== 'object') {
    logger.warn(`Validation failed: "variables" must be an object`)
    return res.status(400).json({ error: "'variables' must be an object" });
  }

  // Optional: if subject comes separately, validate it too
  if (subject && subject.length > MAX_SUBJECT_LENGTH) {
    return res.status(400).json({ error: `'subject' must be less than ${MAX_SUBJECT_LENGTH} characters` });
  }

  const sanitizedVariables = {};
  for (const key in variables) {
    const value = variables[key];
    if (typeof value === 'string') {
      if (value.length > MAX_VARIABLE_LENGTH) {
        return res.status(400).json({ error: `'${key}' is too long, max ${MAX_VARIABLE_LENGTH} characters` });
      }
      sanitizedVariables[key] = sanitizeHtml(value, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li'],
        allowedAttributes: { a: ['href', 'name', 'target'] },
      });
    } else {
      sanitizedVariables[key] = value;
    }
  }

  req.body.variables = sanitizedVariables;
  next();
};


module.exports = validateEmailInput