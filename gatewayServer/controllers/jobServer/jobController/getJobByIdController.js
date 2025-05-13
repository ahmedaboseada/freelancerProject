const {fetchAnotherServerWithoutBody} = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const getJobByIdController = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new ApiError("You have to login first!", responseTypes.UNAUTHORIZED.code));
        }

        const jobId = req.params.id;
        const response = await fetchAnotherServerWithoutBody(`${process.env.JOB_SERVER}/api/job/${jobId}`, 'GET');

        if (response.statusCode === 200) {
            if (!response.data) {
                return next(new ApiError("Job not found", responseTypes.NOT_FOUND.code));
            }
            responseWrapper(res, responseTypes.SUCCESS, "Job fetched successfully", response.data);
        } else if (response.statusCode === 404) {
            return next(new ApiError("Job not found", responseTypes.NOT_FOUND.code));
        } else {
            return next(new ApiError(response.message || "Something went wrong", response.statusCode || responseTypes.BAD_REQUEST.code));
        }
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 401 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = getJobByIdController;