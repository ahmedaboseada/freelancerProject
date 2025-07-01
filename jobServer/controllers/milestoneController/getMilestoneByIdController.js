const Milestone = require('../../models/milestones');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const getMilestoneByIdController = async (req, res, next) => {
    const milestoneId = req.params.id;

    try {
        const milestone = await Milestone.findById(milestoneId)
            .populate('job', 'title budget timeline')
            .populate('freelancer', 'firstName lastName email')
            .populate('client', 'firstName lastName email');

        if (!milestone) {
            return next(new ApiError("Milestone not found", responseTypes.NOT_FOUND.code));
        }

        responseWrapper(res, responseTypes.SUCCESS, "Milestone retrieved successfully", milestone);
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = getMilestoneByIdController;
