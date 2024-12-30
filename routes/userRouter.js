const express = require('express');
const { register, login, getUserDetails, updateUser } = require('../controllers/userController');
const { validateToken, validateRefreshToken } = require('../middleware/authentication');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', validateToken, getUserDetails);
router.put('/update-user', validateToken, updateUser);
router.post('/refresh', validateRefreshToken);


module.exports = router;
