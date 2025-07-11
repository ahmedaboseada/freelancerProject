const Milestone = require('../../models/milestones');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const rejectMilestoneController = async (req, res, next) => {
    const milestoneId = req.params.id;
    const { reason } = req.body;

    try {
        const milestone = await Milestone.findById(milestoneId);
        if (!milestone) {
            return next(new ApiError("Milestone not found", responseTypes.NOT_FOUND.code));
        }

        if (milestone.status !== "submitted") {
            return next(new ApiError("Only submitted milestones can be rejected", responseTypes.BAD_REQUEST.code));
        }

        milestone.status = "pending";
        milestone.deliverableUrl = null; 
        
        if (reason && reason.trim()) {
            milestone.rejectionReason = reason.trim();
        }

        await milestone.save();


        responseWrapper(res, responseTypes.SUCCESS, "Milestone rejected successfully", milestone);
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = rejectMilestoneController;
