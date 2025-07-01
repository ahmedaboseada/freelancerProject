const Milestone = require('../../models/milestones');
const Job = require('../../models/job');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const getMilestonesByJobController = async (req, res, next) => {
    const jobId = req.params.jobId;

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return next(new ApiError("Job not found", responseTypes.NOT_FOUND.code));
        }

        const milestones = await Milestone.find({ job: jobId })
            .select('title description amount status paymentStatus createdAt updatedAt freelancer client')
            .populate('freelancer', 'firstName lastName email')
            .populate('client', 'firstName lastName email')
            .sort({ createdAt: 1 });

        const statusCounts = milestones.reduce((counts, milestone) => {
            counts[milestone.status] = (counts[milestone.status] || 0) + 1;
            return counts;
        }, {});

        const response = {
            milestones,
            statusCounts,
            totalMilestones: milestones.length
        };

        responseWrapper(res, responseTypes.SUCCESS, "Milestones retrieved successfully", response);
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = getMilestonesByJobController;
