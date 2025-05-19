const {fetchAnotherServerWithQuery} = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const getProposalsOfASpecificJob = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new ApiError("You have to login first!", responseTypes.UNAUTHORIZED.code));
        }

        if (req.user.role !== 'client') {
            return next(new ApiError("You are not authorized to access this resource", responseTypes.FORBIDDEN.code));
        }

        const { jobId } = req.params;
        const clientId = req.user.userId;

        console.log(`Client ID: ${clientId}, Job ID: ${jobId}`);

        if (!jobId) {
            return next(new ApiError('Job ID is required', responseTypes.BAD_REQUEST.code));
        }

        if (!clientId) {
            return next(new ApiError('Client ID is required', responseTypes.BAD_REQUEST.code));
        }

        // Use fetchAnotherServerWithQuery to send data in query params
        const response = await fetchAnotherServerWithQuery(
            `${process.env.JOB_SERVER}/api/proposal/job/${jobId}`,
            'GET',
            { clientId }
        );

        if (response.statusCode === 200) {
            return responseWrapper(res, responseTypes.SUCCESS, "Proposals fetched successfully", response.data);
        } else {
            const message = response.message || "Failed to fetch proposals";
            const code = response.statusCode || responseTypes.SERVER_ERROR.code;
            return next(new ApiError(message, code));
        }
    } catch (error) {
        console.error("Get proposals error:", error);
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode < 500 ? error.message : "Internal server error";
        return next(new ApiError(message, statusCode));
    }
};

module.exports = getProposalsOfASpecificJob;