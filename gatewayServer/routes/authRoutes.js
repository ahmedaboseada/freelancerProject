const express = require('express');

const router = express.Router();

const registrationController = require('../controllers/authServer/RegistrationController');
const loginController = require('../controllers/authServer/loginController');
const logoutController = require('../controllers/authServer/logoutController');
const googleAuthController = require('../controllers/authServer/googleAuthController');

const googleAuthCompleteController = require('../controllers/authServer/googleAuthCompleteController')

router.post('/signup', registrationController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get(
    "/google",
    googleAuthController
);

router.get('/googleAuthComplete',googleAuthCompleteController)

module.exports = router;
