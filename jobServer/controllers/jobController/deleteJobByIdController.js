const Job = require('../../models/job');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const deleteJobByIdController = async (req, res, next) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findOne({ _id: jobId });

        if (!job) {
            return next(new ApiError("Job not found", responseTypes.NOT_FOUND.code));
        }

        const { clientId } = req.body;
        const existingJobClientId = job.clientId.toString();
        if (existingJobClientId !== clientId) {
            return next(new ApiError("You are not authorized to update this job", responseTypes.UNAUTHORIZED.code));
        }

        if (job.status === 'in progress') {
            return next(new ApiError("Cannot delete in-progress.", responseTypes.BAD_REQUEST.code));
        }

        await Job.deleteOne({ _id: jobId });

        responseWrapper(res, responseTypes.SUCCESS, "Job deleted successfully");
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 401 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
}

module.exports = deleteJobByIdController;