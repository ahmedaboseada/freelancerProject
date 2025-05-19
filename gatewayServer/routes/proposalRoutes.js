const express = require('express');

const router = express.Router();

const submitProposalController = require('../controllers/jobServer/proposalController/submitProposalController');

const verifyToken = require('../middlewares/jwtVerify');

router.use(verifyToken)
router
    .post('/', submitProposalController);

module.exports = router;