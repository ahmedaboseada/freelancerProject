const express = require('express');

const router = express.Router();

const register = require('../controllers/registrationController');
const checkRequestAuthentication = require('../middlewares/checkRequestAuthentication');
const login = require('../controllers/loginController');
const logout = require('../controllers/logoutControllers');

router.use(checkRequestAuthentication);

router.post('/signup', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
