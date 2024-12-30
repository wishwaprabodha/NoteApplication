const healthService = require("../service/healthService");
const logger  = require("../utils/logger/logger");

async function healthCheck (req, res)  {
    try {
        await healthService.healthCheckSequelize();
        logger.info("Health check completed successfully.");
        return res.status(200).json({ success: true });

    } catch (error) {
        logger.error('sequelize Ping Failed with error: ', error);
        return res.status(400).json({ success: true, message: 'sequelize ping failed' });
    }
}

module.exports = { healthCheck };
