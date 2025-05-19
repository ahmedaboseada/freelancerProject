const {fetchAnotherServer} = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const submitProposalController = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new ApiError('You have to login first!', responseTypes.UNAUTHORIZED.code));
        }

        if (req.user.role !== 'freelancer') {
            return next(new ApiError('User is not a freelancer', responseTypes.FORBIDDEN.code));
        }

        const {jobId, status, coverLetter, bidAmount, timeLineEstimate} = req.body;

        if (!jobId || !status || !coverLetter || !bidAmount || !timeLineEstimate) {
            return next(new ApiError('Please provide all required fields', responseTypes.BAD_REQUEST.code));
        }

        const freelancerId = req.user.userId;

        if (status !== 'open') {
            return next(new ApiError('Job status must be open', responseTypes.BAD_REQUEST.code));
        }

        const proposalData = {
            jobId,
            freelancerId,
            status,
            coverLetter,
            bidAmount,
            timeLineEstimate
        };

        console.log(proposalData);

        const response = await fetchAnotherServer(
            `${process.env.JOB_SERVER}/api/proposal`,
            'POST',
            proposalData
        );

        // Handle success case
        if (response.statusCode === responseTypes.CREATED.code) {
            return responseWrapper(res, responseTypes.CREATED, 'Proposal submitted successfully', response.data);
        }

        // Handle all error cases with appropriate messages
        const errorMessage = response.message || 'Error submitting proposal';
        const errorCode = response.statusCode || responseTypes.SERVER_ERROR.code;

        // Pass the actual error message from the job server to the client
        return next(new ApiError(errorMessage, errorCode));
    } catch (error) {
        console.error("Submit proposal error:", error);
        return next(new ApiError(error.message || 'Error submitting proposal', error.code || responseTypes.SERVER_ERROR.code));
    }
}

module.exports = submitProposalController;