const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config({ path: '.env' });

async function validateToken(req, res, next) {
    try {
        await getUserFromToken(req);
        next();
    } catch (err) {
        return res.status(403).send({ success: false, message: err.message });
    }
}

async function validateRefreshToken(req, res) {
    try {
        if (req.cookies?.jwt) {
            const refreshToken = req.cookies.jwt;
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
            delete decoded.exp;
            decoded.jti = uuidv4();
            const newAccessToken = jwt.sign(decoded, process.env.JWT_SECRET, { expiresIn: '1h' });
            const newRefreshToken = jwt.sign(decoded, process.env.REFRESH_SECRET, { expiresIn: '1d' });
            res.cookie('jwt', newRefreshToken, {
                httpOnly: true,
                secure: !!process.env.PRODUCTION,
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000
            });
            const data = { accessToken: newAccessToken }
            return res.status(200).send({ success: true, message: 'Tokens Refreshed', data })
        }
        return res.status(401).send({ success: false, message: 'Refresh Token Not found' });
    } catch (err) {
        return res.status(403).send({ success: false, message: err.message });
    }
}

async function isPasswordVerified(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
}

async function generateToken(email, userId, expiry) {
    const payload = { email, userId };
    payload.jti = uuidv4();

    if (expiry === '1d') {
        return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: expiry });
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiry });
}

async function getUserFromToken(req) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
    } else {
        throw new Error('No token provided');
    }
}

module.exports = {
    validateToken,
    validateRefreshToken,
    isPasswordVerified,
    generateToken
};
