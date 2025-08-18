const pug = require('pug');
const fs = require('fs');
const path = require('path');

const templates = [
  {
    name: 'password-reset',
    data: {
      username: 'Juan',
      resetLink: 'https://example.com/reset-password?token=abc123',
      expirationHours: 24,
    },
  },
  {
    name: 'welcome',
    data: {
      username: 'Juan',
      welcomeMessage: 'Welcome to our platform!',
    },
  },
  {
    name: 'verify',
    data: {
      name: 'Juan'
    },
  },
];

templates.forEach(({ name, data }) => {
  const templatePath = path.join(__dirname, 'views', 'emails', `${name}.pug`);
  try {
    const html = pug.renderFile(templatePath, data);
    const outputPath = path.join(__dirname, `preview-${name}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Rendered ${name} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error rendering ${name}:`, error);
  }
});
