const express = require('express');

const router = express.Router();

const checkRequestAuthentication = require('../middlewares/checkRequestAuthentication');
const createJobController = require('../controllers/jobController/createJobController');
const getAllJobsController = require('../controllers/jobController/getAllJobsController');
const getJobByIdController = require('../controllers/jobController/getJobByIdController');
const updateJobByIdController = require('../controllers/jobController/updateJobByIdController');
const deleteJobByIdController = require('../controllers/jobController/deleteJobByIdController');
const getAllJobsForAClientController = require('../controllers/jobController/getAllJobsForAClientController');
const setJobStatusController = require('../controllers/jobController/setJobStatusController');

router.use(checkRequestAuthentication);

router
    .get('/',getAllJobsController)
    .get('/:id',getJobByIdController)
    .get('/client/:clientId', getAllJobsForAClientController)
    .post('/create/:id', createJobController)
    .put('/:id', updateJobByIdController)
    .put('/:id/status', setJobStatusController)
    .delete('/:id', deleteJobByIdController);


module.exports = router;
