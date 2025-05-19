// In jobServer/controllers/jobController/setJobStatusController.js
const Job = require('../../models/job');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const setJobStatusController = async (req, res, next) => {
    try {
        const {id} = req.params;
        console.log(`id: ${id}`);

        const job = await Job.findById(id);
        if (!job) {
            return next(new ApiError('Job not found', responseTypes.NOT_FOUND.code));
        }
        const {clientId} = req.body;
        if (clientId !== job.clientId.toString()) {
            return next(new ApiError('You are not authorized to update this job', responseTypes.FORBIDDEN.code));
        }

        const statusFilter = ['open', 'in progress', 'completed'];
        const {status} = req.body;
        console.log(`status: ${status}`);

        if (!statusFilter.includes(status)) {
            return next(new ApiError('Invalid status', responseTypes.BAD_REQUEST.code));
        }

        job.status = status;
        await job.save();

        // Use responseTypes.SUCCESS instead of responseTypes.SUCCESS.code
        return responseWrapper(res, responseTypes.SUCCESS, 'Job status updated successfully', job);
    } catch (error) {
        console.error("Update job status error:", error);
        return next(new ApiError("Failed to update job status", responseTypes.SERVER_ERROR.code));
    }
}

module.exports = setJobStatusController;