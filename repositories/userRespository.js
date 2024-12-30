const sequelize = require('../connectors/db/sequelize')
const bcrypt = require("bcryptjs");

async function getUserFromUserName(userName) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const user = await sequelizeConnection.user.findOne({
            where: { userName }
        });
        if (!user) {
            return null;
        }
        return user;
    }catch (error) {
        throw new Error(error);
    }
}

async function getUserFromEmail(email) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const user = await sequelizeConnection.user.findOne({
            where: { email }
        });
        if (!user) {
            return null;
        }
        return user;
    }catch (error) {
        throw new Error(error);
    }
}


async function createUser(userData) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const user = await sequelizeConnection.user.create({
            username: userData.userName,
            email: userData.email,
            password_hash: userData.passwordHash
        });
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

async function updateUserByEmail(email, data) {
    try {
        const updateObject = data;
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            updateObject.password_hash = await bcrypt.hash(data.password, salt);
        }
        const sequelizeConnection = await sequelize.dbConnection();
        const user = await sequelizeConnection.user.update(
                updateObject, {
            where: { email: data.email }
        });
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        throw new Error(error);
    }
}



module.exports = {
    getUserFromUserName,
    getUserFromEmail,
    createUser,
    updateUserByEmail
};