const express = require('express');
const router = express.Router();

const jwtVerify = require('../middlewares/jwtVerify');

// Import milestone controllers
const createMilestonesController = require('../controllers/jobServer/milestoneController/createMilestonesController');
const getMilestonesByJobController = require('../controllers/jobServer/milestoneController/getMilestonesByJobController');
const getMilestoneByIdController = require('../controllers/jobServer/milestoneController/getMilestoneByIdController');
const submitMilestoneController = require('../controllers/jobServer/milestoneController/submitMilestoneController');
const approveMilestoneController = require('../controllers/jobServer/milestoneController/approveMilestoneController');
const rejectMilestoneController = require('../controllers/jobServer/milestoneController/rejectMilestoneController');
const deleteMilestoneController = require('../controllers/jobServer/milestoneController/deleteMilestoneController');
const getFreelancerMilestonesController = require('../controllers/jobServer/milestoneController/getFreelancerMilestonesController');

// Apply JWT verification middleware to all routes
router.use(jwtVerify);

// Milestone routes
router
    .post('/:jobId', createMilestonesController)
    .get('/job/:jobId', getMilestonesByJobController)
    .get('/freelancer/:freelancerId', getFreelancerMilestonesController)
    .get('/:id', getMilestoneByIdController)
    .patch('/:id/submit', submitMilestoneController)
    .patch('/:id/approve', approveMilestoneController)
    .patch('/:id/reject', rejectMilestoneController)
    .delete('/:id', deleteMilestoneController);

module.exports = router;
