const express = require('express');

const router = express.Router();

const registrationController = require('../controllers/authServer/registrationController');
const loginController = require('../controllers/authServer/loginController');
const logoutController = require('../controllers/authServer/logoutController');

router.post('/signup', registrationController);
router.post('/login', loginController);
router.post('/logout', logoutController);

module.exports = router;
