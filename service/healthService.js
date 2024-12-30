const sequelize = require("../connectors/db/sequelize");

exports.healthCheckSequelize = async () => {
    try {
        return await sequelize.dbConnection();
    }catch (error) {
        throw error;
    }
}