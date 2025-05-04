const express = require('express');
const register = require('../controllers/registration');



const router = express.Router();

router.post('/signup', register);

module.exports = router;
