const express = require('express');

const router = express.Router();

const register = require('../controllers/registrationController');
const checkRequestAuthentication = require('../middlewares/checkRequestAuthentication');

router.use(checkRequestAuthentication);

router.post('/signup', register);

module.exports = router;
