const Milestone = require('../../models/milestones');
const Job = require('../../models/job');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const deleteMilestoneController = async (req, res, next) => {
    const milestoneId = req.params.id;

    try {
        const milestone = await Milestone.findById(milestoneId);
        if (!milestone) {
            return next(new ApiError("Milestone not found", responseTypes.NOT_FOUND.code));
        }

        if (milestone.status !== "pending") {
            return next(new ApiError("Only pending milestones can be deleted", responseTypes.BAD_REQUEST.code));
        }

        await Job.findByIdAndUpdate(
            milestone.job,
            { $pull: { milestones: milestoneId } }
        );

        milestone.deleted = true;
        milestone.deletedAt = new Date();
        await milestone.save();

        responseWrapper(res, responseTypes.SUCCESS, "Milestone deleted successfully", { milestoneId });
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = deleteMilestoneController;
