const express = require('express');
const router = express.Router();

const checkRequestAuthentication = require('../middlewares/checkRequestAuthentication');
const validate = require('../middlewares/validate');

const {
    createMilestonesValidation,
    submitMilestoneValidation,
    rejectMilestoneValidation,
    milestoneIdValidation,
    jobIdValidation,
    freelancerMilestonesValidation
} = require('../validations/milestoneValidation');

const createMilestonesController = require('../controllers/milestoneController/createMilestonesController');
const getMilestonesByJobController = require('../controllers/milestoneController/getMilestonesByJobController');
const getMilestoneByIdController = require('../controllers/milestoneController/getMilestoneByIdController');
const submitMilestoneController = require('../controllers/milestoneController/submitMilestoneController');
const approveMilestoneController = require('../controllers/milestoneController/approveMilestoneController');
const rejectMilestoneController = require('../controllers/milestoneController/rejectMilestoneController');
const deleteMilestoneController = require('../controllers/milestoneController/deleteMilestoneController');
const getFreelancerMilestonesController = require('../controllers/milestoneController/getFreelancerMilestonesController');

router.use(checkRequestAuthentication);

router
    .post('/:jobId', createMilestonesValidation, validate, createMilestonesController)
    .get('/job/:jobId', jobIdValidation, validate, getMilestonesByJobController)
    .get('/freelancer/:freelancerId', freelancerMilestonesValidation, validate, getFreelancerMilestonesController)
    .get('/:id', milestoneIdValidation, validate, getMilestoneByIdController)
    .patch('/:id/submit', submitMilestoneValidation, validate, submitMilestoneController)
    .patch('/:id/approve', milestoneIdValidation, validate, approveMilestoneController)
    .patch('/:id/reject', rejectMilestoneValidation, validate, rejectMilestoneController)
    .delete('/:id', milestoneIdValidation, validate, deleteMilestoneController);

module.exports = router;
