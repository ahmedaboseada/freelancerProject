const express = require('express');

const router = express.Router();

const submitProposalController = require('../controllers/jobServer/proposalController/submitProposalController');
const getProposalsOfASpecificJob = require('../controllers/jobServer/proposalController/getProposalsOfASpecificJob');
const verifyToken = require('../middlewares/jwtVerify');

router.use(verifyToken)
router
    .get('/job/:jobId', getProposalsOfASpecificJob)
    .post('/', submitProposalController);

module.exports = router;