const { fetchAnotherServer } = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const submitMilestoneController = async (req, res, next) => {
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

    if (req.user.role !== 'freelancer') {
      return next(
        new ApiError(
          'You are not authorized to submit milestones',
          responseTypes.UNAUTHORIZED.code
        )
      );
    }

    const { deliverableUrl } = req.body;
    const milestoneId = req.params.id;

    if (!deliverableUrl || !deliverableUrl.trim()) {
      return responseWrapper(
        res,
        responseTypes.BAD_REQUEST,
        'Deliverable URL is required'
      );
    }

    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(deliverableUrl)) {
      return responseWrapper(
        res,
        responseTypes.BAD_REQUEST,
        'Please provide a valid URL'
      );
    }

    const requestBody = { deliverableUrl };
    const response = await fetchAnotherServer(
      `${process.env.JOB_SERVER}/api/milestone/${milestoneId}/submit`,
      'PATCH',
      requestBody
    );

    if (response.statusCode === 200) {
      return responseWrapper(
        res,
        responseTypes.SUCCESS,
        'Milestone submitted successfully',
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

module.exports = submitMilestoneController;
