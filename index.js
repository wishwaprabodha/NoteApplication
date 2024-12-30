const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mysql = require('./connectors/db/sequelize');
const redis = require('./connectors/cache/redis');

dotenv.config({ path: '.env' });

const userRoutes = require('./routes/userRouter');
const noteRoutes = require('./routes/noteRouter');
const shareNoteRoutes = require('./routes/sharedNoteRouter');
const healthRoutes = require('./routes/healthRouter');
const logger = require('./utils/logger/logger');

async function start() {
    try {
        const app = express();
        app.use(cors())
        app.use(bodyParser.json());
        app.use(cookieParser());

        app.use('/api/user', userRoutes);
        app.use('/api/note', noteRoutes);
        app.use('/api/share-note', shareNoteRoutes);
        app.use('/api', healthRoutes);

        const PORT = process.env.APP_PORT;
        await redis.getRedisClient();
        await mysql.dbConnection();
        app.listen(PORT, () => logger.info(`Note App running on port ${PORT}`));
    } catch (error) {
       logger.error('Error Starting Application');
    }
}

start()
    .then(() => logger.info('Starting Application'))
    .catch((error) => { logger.error(error) });