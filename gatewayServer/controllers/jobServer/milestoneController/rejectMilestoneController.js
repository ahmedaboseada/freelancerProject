const { fetchAnotherServer } = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const rejectMilestoneController = async (req, res, next) => {
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

    if (req.user.role !== 'client') {
      return next(
        new ApiError(
          'You are not authorized to reject milestones',
          responseTypes.UNAUTHORIZED.code
        )
      );
    }

    const { reason } = req.body;
    const milestoneId = req.params.id;

    const requestBody = { reason: reason || '' };
    const response = await fetchAnotherServer(
      `${process.env.JOB_SERVER}/api/milestone/${milestoneId}/reject`,
      'PATCH',
      requestBody
    );

    if (response.statusCode === 200) {
      return responseWrapper(
        res,
        responseTypes.SUCCESS,
        'Milestone rejected successfully',
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

module.exports = rejectMilestoneController;
