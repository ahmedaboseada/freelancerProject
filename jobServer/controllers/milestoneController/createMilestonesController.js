const Milestone = require('../../models/milestones');
const Job = require('../../models/job');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const createMilestonesController = async (req, res, next) => {
    const { milestones } = req.body;
    const jobId = req.params.jobId;

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return next(new ApiError("Job not found", responseTypes.NOT_FOUND.code));
        }

        if (job.status !== "in progress") {
            return next(new ApiError("Milestones can only be created for jobs in progress", responseTypes.BAD_REQUEST.code));
        }

        if (!milestones || !Array.isArray(milestones) || milestones.length === 0) {
            return next(new ApiError("At least one milestone is required", responseTypes.BAD_REQUEST.code));
        }

        const totalMilestoneAmount = milestones.reduce((sum, milestone) => {
            return sum + (milestone.amount || 0);
        }, 0);

        if (totalMilestoneAmount > job.budget) {
            return next(new ApiError("Total milestone amount cannot exceed job budget", responseTypes.BAD_REQUEST.code));
        }

        const createdMilestones = [];
        for (const milestoneData of milestones) {
            const milestone = {
                job: jobId,
                freelancer: job.hiredFreelancer.freelancer,
                client: job.clientId,
                title: milestoneData.title,
                description: milestoneData.description,
                amount: milestoneData.amount,
                dueDate: milestoneData.dueDate,
                status: "pending",
                paymentStatus: "unpaid"
            };

            const newMilestone = await Milestone.create(milestone);
            createdMilestones.push(newMilestone);
        }

        job.milestones = job.milestones || [];
        job.milestones.push(...createdMilestones.map(m => m._id));
        await job.save();

        responseWrapper(res, responseTypes.CREATED, "Milestones created successfully", createdMilestones);
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = createMilestonesController;
