const {
  fetchAnotherServerWithoutBody,
} = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const getMilestoneByIdController = async (req, res, next) => {
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

    const milestoneId = req.params.id;

    const response = await fetchAnotherServerWithoutBody(
      `${process.env.JOB_SERVER}/api/milestone/${milestoneId}`,
      'GET'
    );

    if (response.statusCode === 200) {
      return responseWrapper(
        res,
        responseTypes.SUCCESS,
        'Milestone retrieved successfully',
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

module.exports = getMilestoneByIdController;
