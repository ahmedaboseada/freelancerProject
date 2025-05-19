const express = require('express');

const router = express.Router();

const submitProposalController = require('../controllers/proposalController/submitProposalController');
const checkRequestAuthentication = require("../middlewares/checkRequestAuthentication");

router.use(checkRequestAuthentication);

router
    .post('/', submitProposalController);

module.exports = router;