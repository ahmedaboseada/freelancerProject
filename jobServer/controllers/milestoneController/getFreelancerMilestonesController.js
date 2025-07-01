const Milestone = require('../../models/milestones');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const getFreelancerMilestonesController = async (req, res, next) => {
    const freelancerId = req.params.freelancerId;
    const { status, jobId, sort = 'dueDate' } = req.query;

    try {
        const query = { freelancer: freelancerId, deleted: { $ne: true } };
        
        if (status) {
            query.status = status;
        }
        
        if (jobId) {
            query.job = jobId;
        }

        const sortOptions = {};
        if (sort === 'dueDate') {
            sortOptions.dueDate = 1; 
        } else if (sort === 'createdAt') {
            sortOptions.createdAt = -1; 
        } else if (sort === 'amount') {
            sortOptions.amount = -1; 
        } else {
            sortOptions.dueDate = 1; 
        }

        const milestones = await Milestone.find(query)
            .populate('job', 'title budget timeline clientId')
            .populate('client', 'firstName lastName email')
            .sort(sortOptions);

        const statusCounts = milestones.reduce((counts, milestone) => {
            counts[milestone.status] = (counts[milestone.status] || 0) + 1;
            return counts;
        }, {});

        const totalEarnings = milestones
            .filter(m => m.status === 'approved')
            .reduce((sum, m) => sum + (m.amount || 0), 0);

        const response = {
            milestones,
            statusCounts,
            totalMilestones: milestones.length,
            totalEarnings
        };

        responseWrapper(res, responseTypes.SUCCESS, "Freelancer milestones retrieved successfully", response);
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = getFreelancerMilestonesController;
