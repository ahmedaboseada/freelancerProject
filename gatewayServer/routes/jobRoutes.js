const express = require('express');

const router = express.Router();

const createJobController = require('../controllers/jobServer/jobController/createJobController');
const getAllJobsController = require('../controllers/jobServer/jobController/getAllJobsController');
const getJobByIdController = require('../controllers/jobServer/jobController/getJobByIdController');
const updateJobByIdController = require('../controllers/jobServer/jobController/updateJobByIdController');
const deleteJobByIdController = require('../controllers/jobServer/jobController/deleteJobByIdController');
const getAllJobsForAClientController = require('../controllers/jobServer/jobController/getAllJobsForAClientController');
const setJobStatusController = require('../controllers/jobServer/jobController/setJobStatusController');

const verifyToken = require('../middlewares/jwtVerify');

router.use(verifyToken)

router
    .get('/',getAllJobsController)
    .get('/:id',getJobByIdController)
    .get('/client/:clientId', getAllJobsForAClientController)
    .post('/create/:id', createJobController)
    .put('/:id', updateJobByIdController)
    .put('/:id/status', setJobStatusController)
    .delete('/:id', deleteJobByIdController);

module.exports = router;
