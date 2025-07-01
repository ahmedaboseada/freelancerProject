const {
  fetchAnotherServerWithoutBody,
} = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const getFreelancerMilestonesController = async (req, res, next) => {
  try {
    if (!req.session.refreshToken) {
      return next(
        new ApiError(
          'You have to login first!',
          responseTypes.UNAUTHORIZED.code
        )
      );
    }

    if (!req.user) {
      return next(
        new ApiError(
          'You have to login first!',
          responseTypes.UNAUTHORIZED.code
        )
      );
    }

    const freelancerId = req.params.freelancerId;
    const { status, jobId, sort } = req.query;

    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    if (jobId) queryParams.append('jobId', jobId);
    if (sort) queryParams.append('sort', sort);

    const queryString = queryParams.toString();
    const url = `${process.env.JOB_SERVER}/api/milestone/freelancer/${freelancerId}${queryString ? `?${queryString}` : ''}`;

    const response = await fetchAnotherServerWithoutBody(url, 'GET');

    if (response.statusCode === 200) {
      return responseWrapper(
        res,
        responseTypes.SUCCESS,
        'Freelancer milestones retrieved successfully',
        response.data
      );
    } else {
      return next(
        new ApiError(
          response.message || 'Something went wrong',
          response.statusCode || responseTypes.BAD_REQUEST.code
        )
      );
    }
  } catch (error) {
    const statusCode = error.code || responseTypes.SERVER_ERROR.code;
    const message =
      statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
    return next(new ApiError(message, statusCode));
  }
};

module.exports = getFreelancerMilestonesController;
