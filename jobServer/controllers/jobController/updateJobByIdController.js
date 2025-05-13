const Job = require('../../models/job');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const updateJobByIdController = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return next(new ApiError("Job not found", responseTypes.NOT_FOUND.code));
        }
        if (existingJob.status !== 'open') {
            return next(new ApiError("Cannot update in-progress/completed job.", responseTypes.BAD_REQUEST.code));
        }
        const {
            title = existingJob.title,
            description = existingJob.description,
            skillsRequired = existingJob.skillsRequired,
            budget = existingJob.budget,
            timeline = existingJob.timeline,
            category = existingJob.category,
            attachments = existingJob.attachments,
            clientId
        } = req.body;
        console.log("asdasdasds")
        const existingJobClientId = existingJob.clientId.toString();
        if (existingJobClientId !== clientId) {
            return next(new ApiError("You are not authorized to update this job", responseTypes.UNAUTHORIZED.code));
        }
        const updatedJob = await Job.findByIdAndUpdate(jobId, {
            title,
            description,
            skillsRequired,
            budget,
            timeline,
            category,
            attachments
        }, { new: true });
        responseWrapper(res, responseTypes.SUCCESS, "Job updated successfully", updatedJob);
    } catch (error ){
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
}

module.exports = updateJobByIdController;