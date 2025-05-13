const {fetchAnotherServerWithoutBody} = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const getAllJobsForAClientController = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new ApiError("You have to login first!", responseTypes.UNAUTHORIZED.code));
        }

        if (req.user.role === 'freelancer') {
            return next(new ApiError("You are not authorized to view this resource", responseTypes.UNAUTHORIZED.code));
        }

        const clientId = req.params.clientId;
        const response = await fetchAnotherServerWithoutBody(`${process.env.JOB_SERVER}/api/job/client/${clientId}`, 'GET');

        if (response.statusCode === 200) {
            if (!response.data || response.data.length === 0) {
                return next(new ApiError("No jobs found for this client", responseTypes.NOT_FOUND.code));
            }
            responseWrapper(res, responseTypes.SUCCESS, "Jobs fetched successfully", response.data);
        } else if (response.statusCode === 404) {
            return next(new ApiError("No jobs found for this client", responseTypes.NOT_FOUND.code));
        } else {
            return next(new ApiError(response.message || "Something went wrong", response.statusCode || responseTypes.BAD_REQUEST.code));
        }
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 401 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
}

module.exports = getAllJobsForAClientController;