const Proposal = require('../../models/proposal');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

// Fix the function name
const submitProposalController = async (req, res, next) => {
    try {
        // Frontend will send the jobId and status
        const {jobId, freelancerId, status, coverLetter, bidAmount, timeLineEstimate} = req.body;
        console.log(jobId, freelancerId, status, coverLetter, bidAmount, timeLineEstimate);

        if (!jobId || !freelancerId || !status || !coverLetter || !bidAmount || !timeLineEstimate) {
            return next(new ApiError('Please provide all required fields', 400));
        }

        if (status !== 'open') {
            return next(new ApiError('Job status must be open', 400));
        }

        const existingProposal = await Proposal.findOne({job: jobId, freelancer: freelancerId});

        if (existingProposal) {
            return next(new ApiError('You have already submitted a proposal for this job', 400));
        }

        const proposal = new Proposal({
            job: jobId,
            freelancer: freelancerId,
            coverLetter,
            bidAmount,
            timeLineEstimate
        });

        const savedProposal = await proposal.save();
        return responseWrapper(res, responseTypes.CREATED, 'Proposal submitted successfully', savedProposal);
    } catch (error) {
        console.error("Proposal submission error:", error);
        return next(new ApiError('Error submitting proposal', 500));
    }
}

// Fix the export to match the function name
module.exports = submitProposalController;