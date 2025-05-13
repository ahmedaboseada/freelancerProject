const Job = require('../../models/job');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const getAllJobsForAClientController = async (req, res, next) => {
    try {
        const clientId = req.params.clientId;
        const jobs = await Job.find({ clientId });
        if (!jobs || jobs.length === 0) {
            return next(new ApiError("No jobs found for this client", responseTypes.NOT_FOUND.code));
        }
        responseWrapper(res, responseTypes.SUCCESS, "Jobs fetched successfully", jobs);
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
}

module.exports = getAllJobsForAClientController;