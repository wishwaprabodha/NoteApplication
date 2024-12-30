const userService = require('../service/userService');
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

async function register (req, res)  {
    try {
        const { email, password, userName } = req.body;
        const user = await userService.getUserByEmail(email)
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            email,
            userName,
            passwordHash: hashedPassword
        };
        await userService.createUser(newUser);
        res.status(201).json({ success: true, message: 'User successfully created!' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'User Creation Failed: ', error: error.message });
    }
}

async function login(req, res){
    try {
        const { email, password } = req.body;
        const response = await userService.login(email, password);
        if (!response) {
            return res.status(400).json({ success: false, message: 'Invalid credentials', token: null });
        }
        res.cookie('jwt', response.refreshToken, {
            httpOnly: true,
            secure: !!process.env.PRODUCTION,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ success: true, message: 'authenticated', token: response.accessToken });
    } catch (error) {
        res.status(400).json({ success: false, message: 'User Login Failed', error: error.message });
    }
}

async function getUserDetails(req, res) {
    try {
        const user = await userService.getUserByName(req.query.userName);
        if (user) {
            return res.status(200).json({ success: true, message: 'user found',user });
        }
        return res.status(400).json({ success: true, message: 'user not found' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Get User Failed: ', error: error.message });
    }
}


async function updateUser(req, res){
    try {
        const [userUpdated] = await userService.updateUserByEmail(req.user.email, req.body);
        if (userUpdated) {
            return res.status(200).json({ success: true, message: 'user updated' });
        }
        return res.status(400).json({ success: true, message: 'user update failed' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Update User Failed: ', error: error.message });
    }
}

module.exports = {
    register,
    login,
    getUserDetails,
    updateUser
};
