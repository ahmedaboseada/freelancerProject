const { fetchAnotherServer } = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const createMilestonesController = async (req, res, next) => {
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
          'You are not authorized to create milestones',
          responseTypes.UNAUTHORIZED.code
        )
      );
    }

    const { milestones } = req.body;
    const jobId = req.params.jobId;

    if (!milestones || !Array.isArray(milestones) || milestones.length === 0) {
      return responseWrapper(
        res,
        responseTypes.BAD_REQUEST,
        'At least one milestone is required'
      );
    }

    for (const milestone of milestones) {
      if (!milestone.title || !milestone.description || !milestone.dueDate) {
        return responseWrapper(
          res,
          responseTypes.BAD_REQUEST,
          'Each milestone must have title, description, and dueDate'
        );
      }

      if (milestone.title.length < 20) {
        return responseWrapper(
          res,
          responseTypes.BAD_REQUEST,
          'Milestone title must be at least 20 characters long'
        );
      }

      if (milestone.description.length < 50) {
        return responseWrapper(
          res,
          responseTypes.BAD_REQUEST,
          'Milestone description must be at least 50 characters long'
        );
      }

      if (milestone.amount && milestone.amount < 1) {
        return responseWrapper(
          res,
          responseTypes.BAD_REQUEST,
          'Milestone amount must be at least 1'
        );
      }
    }

    const requestBody = { milestones };
    const response = await fetchAnotherServer(
      `${process.env.JOB_SERVER}/api/milestone/${jobId}`,
      'POST',
      requestBody
    );

    if (response.statusCode === 201) {
      return responseWrapper(
        res,
        responseTypes.CREATED,
        'Milestones created successfully',
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

module.exports = createMilestonesController;
