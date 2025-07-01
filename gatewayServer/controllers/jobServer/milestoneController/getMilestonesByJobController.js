const {
  fetchAnotherServerWithoutBody,
} = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const getMilestonesByJobController = async (req, res, next) => {
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

    const jobId = req.params.jobId;

    const response = await fetchAnotherServerWithoutBody(
      `${process.env.JOB_SERVER}/api/milestone/job/${jobId}`,
      'GET'
    );

    if (
      response.data.client !== req.user._id ||
      response.data.freelancer !== req.user._id
    ) {
      return next(
        new ApiError(
          "You are not authorized to access this job's milestones",
          responseTypes.FORBIDDEN.code
        )
      );
    }

    if (response.statusCode === 200) {
      return responseWrapper(
        res,
        responseTypes.SUCCESS,
        'Milestones retrieved successfully',
        {
          title: response.data.milestones.title,
          description: response.data.milestones.description,
          amount: response.data.milestones.amount,
          status: response.data.milestones.status,
          paymentStatus: response.data.milestones.paymentStatus,
          createdAt: response.data.milestones.createdAt,
          updatedAt: response.data.milestones.updatedAt,
          totalMilestones: response.data.totalMilestones,
          statusCounts: response.data.statusCounts,
        }
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

module.exports = getMilestonesByJobController;
