require('dotenv').config();
const port = process.env.PORT || 5000
const logger = require('./utils/logger');

const app = require('./app')


app.listen(port, () => {
    logger.info(`Email API started on port ${port}`);
});
