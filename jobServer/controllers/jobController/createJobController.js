const Job = require('../../models/job');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const createJobController = async (req, res, next) => {
    const { title, description, skillsRequired, budget, timeline, category, attachments=[] } = req.body;
    const clientId = req.params.id;

    const job = {
        title,
        description,
        skillsRequired,
        budget,
        timeline,
        category,
        attachments,
        clientId
    };

    try {
        const newJob = await Job.create(job);
        responseWrapper(res, responseTypes.CREATED, "Job created successfully", newJob);
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
}

module.exports = createJobController;