const express = require('express');

const router = express.Router();

const register = require('../controllers/authServer/registrationController');

router.post('/signup', register);

module.exports = router;
