const express = require('express');

const router = express.Router();

const submitProposalController = require('../controllers/proposalController/submitProposalController');
const getProposalsOfASpecificJob = require('../controllers/proposalController/getProposalsOfASpecificJob');
const checkRequestAuthentication = require("../middlewares/checkRequestAuthentication");

router.use(checkRequestAuthentication);

router
    .get('/job/:jobId', getProposalsOfASpecificJob)
    .post('/', submitProposalController);

module.exports = router;