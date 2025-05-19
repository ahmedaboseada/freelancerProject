const Proposal = require('../../models/proposal');
const Job = require('../../models/job');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const getProposalsOfASpecificJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        // GET requests shouldn't use body parameters
        // The clientId should be in query params or headers
        const clientId = req.headers['x-client-id'] || req.query.clientId;

        console.log(`Client ID: ${clientId}, Job ID: ${jobId}`);

        if (!jobId) {
            return next(new ApiError('Job ID is required', responseTypes.BAD_REQUEST.code));
        }

        if (!clientId) {
            return next(new ApiError('Client ID is required', responseTypes.BAD_REQUEST.code));
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return next(new ApiError('Job not found', responseTypes.NOT_FOUND.code));
        }

        if (job.clientId.toString() !== clientId) {
            return next(new ApiError('You are not authorized to view proposals for this job', responseTypes.FORBIDDEN.code));
        }

        // Find proposals by job, not jobId (unless that's the field name in your schema)
        const proposals = await Proposal.find({ job: jobId });

        if (!proposals || proposals.length === 0) {
            return responseWrapper(res, responseTypes.SUCCESS, 'No proposals found for this job', []);
        }

        return responseWrapper(res, responseTypes.SUCCESS, 'Proposals fetched successfully', proposals);
    } catch (error) {
        console.error("Get proposals error:", error);
        return next(new ApiError('Error fetching proposals', responseTypes.SERVER_ERROR.code));
    }
};

module.exports = getProposalsOfASpecificJob;