const requiredFields = {
  "welcome": ["name", "link"],
  "verify": ["name", "verificationLink"],
  "password-reset": ["username", "resetLink"],
  "store-order": ['contact', 'items']
};

module.exports = requiredFields