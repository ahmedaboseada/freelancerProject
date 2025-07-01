const Milestone = require('../../models/milestones');
const Job = require('../../models/job');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const approveMilestoneController = async (req, res, next) => {
    const milestoneId = req.params.id;

    try {
        const milestone = await Milestone.findById(milestoneId);
        if (!milestone) {
            return next(new ApiError("Milestone not found", responseTypes.NOT_FOUND.code));
        }

        if (milestone.status !== "submitted") {
            return next(new ApiError("Only submitted milestones can be approved", responseTypes.BAD_REQUEST.code));
        }

        milestone.status = "approved";
        milestone.paymentStatus = "released";
        await milestone.save();

        const allMilestones = await Milestone.find({ job: milestone.job });
        const allApproved = allMilestones.every(m => m.status === "approved");

        if (allApproved && allMilestones.length > 0) {
            await Job.findByIdAndUpdate(milestone.job, { status: "completed" });
        }


        responseWrapper(res, responseTypes.SUCCESS, "Milestone approved successfully", milestone);
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = approveMilestoneController;
