const express = require('express');

const router = express.Router();

const register = require('../controllers/registrationController');
const checkRequestAuthentication = require('../middlewares/checkRequestAuthentication');
const login = require('../controllers/loginController');
const jwt = require("jsonwebtoken");
const responseWrapper = require("../utils/responseWrapper");
const responseTypes = require("../utils/responseTypes");
const ApiError = require("../utils/apiError");

router.use(checkRequestAuthentication);

router.post('/signup', register);
router.post('/login', login);




module.exports = router;
