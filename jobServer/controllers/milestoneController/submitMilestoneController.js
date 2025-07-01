const Milestone = require('../../models/milestones');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const submitMilestoneController = async (req, res, next) => {
    const milestoneId = req.params.id;
    const { deliverableUrl } = req.body;

    try {
        if (!deliverableUrl || !deliverableUrl.trim()) {
            return next(new ApiError("Deliverable URL is required", responseTypes.BAD_REQUEST.code));
        }

        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(deliverableUrl)) {
            return next(new ApiError("Please provide a valid URL", responseTypes.BAD_REQUEST.code));
        }

        const milestone = await Milestone.findById(milestoneId);
        if (!milestone) {
            return next(new ApiError("Milestone not found", responseTypes.NOT_FOUND.code));
        }

        if (milestone.status !== "pending") {
            return next(new ApiError("Only pending milestones can be submitted", responseTypes.BAD_REQUEST.code));
        }

        milestone.status = "submitted";
        milestone.deliverableUrl = deliverableUrl;
        await milestone.save();

        responseWrapper(res, responseTypes.SUCCESS, "Milestone submitted successfully", milestone);
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = submitMilestoneController;
