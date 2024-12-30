const userRepository = require('../repositories/userRespository');
const authentication = require('../middleware/authentication');
const logger = require('../utils/logger/logger');
const { v4: uuidv4 } = require('uuid');

async function getUserByName(userName) {
    try {
        const response = await userRepository.getUserFromUserName(userName);
        logger.info('Get User from username response: ', response);
        delete response.password;
        return response;
    }catch (error) {
        throw error;
    }
}

async function getUserByEmail(email) {
    try {
        const response = await userRepository.getUserFromEmail(email);
        logger.info('Get User from email response: ', response);
        return response;
    }catch (error) {
        throw error;
    }
}

async function createUser(newUser) {
    try {
        const userExists = await userRepository.getUserFromEmail(newUser.email);
        logger.info('User already exists for the email: ', newUser.email);
        if (!userExists) {
            logger.info('Creating new user: ', JSON.stringify(newUser));
            return await userRepository.createUser(newUser);
        }
        return null;
    }catch (error) {
        logger.info('Error in User Creation: ', error);
        throw error;
    }
}

async function login(email, password) {
    try {
        const user = await userRepository.getUserFromEmail(email);
        const passwordVerified = await authentication.isPasswordVerified(password, user.password_hash)
        if (user && await passwordVerified) {
            logger.info('Authentication success user email: ', email);
            const accessToken = await authentication.generateToken(user.email, user.user_id, '1h');
            const refreshToken = await authentication.generateToken(user.email, user.user_id, '1d');
            return { accessToken, refreshToken }
        }
        logger.error('Authentication failed with user email: ', email);
        return null;
    }catch (error) {
        throw error;
    }
}

async function updateUserByEmail(email, userData) {
    try {
        logger.error('Updating user email: ', email);
        return await userRepository.updateUserByEmail(email, userData);
    }catch (error) {
        throw error;
    }
}

module.exports = {
    getUserByName,
    createUser,
    login,
    getUserByEmail,
    updateUserByEmail
}
