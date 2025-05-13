const Job = require('../../models/job');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const getAllJobsController = async (req, res, next) => {
    try {
        const {page = 1, limit = 10} = req.query;
        const skip = (page - 1) * limit;
        const {category, skillsRequired, minBudget, maxBudget, keyword} = req.query;

        // Validate query parameters
        const query = {};
        if (category) query.category = category;
        if (skillsRequired && Array.isArray(skillsRequired)) query.skillsRequired = {$in: skillsRequired};
        if (minBudget || maxBudget) {
            query.budget = {};
            if (minBudget) query.budget.$gte = minBudget;
            if (maxBudget) query.budget.$lte = maxBudget;
        }
        if (keyword) query.title = {$regex: keyword, $options: 'i'};
        console.log(query)
        const jobs = await Job.find({status:'open'})
            .where({...query})
            .skip(skip)
            .limit(limit);

        if (!jobs) {
            return next(new ApiError("No jobs found", responseTypes.NOT_FOUND.code));
        }

        responseWrapper(res, responseTypes.SUCCESS, "Jobs fetched successfully", jobs);
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
}

module.exports = getAllJobsController;