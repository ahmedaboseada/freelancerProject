const {fetchAnotherServerWithQuery} = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const getAllJobsController = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new ApiError("You have to login first!", responseTypes.UNAUTHORIZED.code));
        }
        if (req.user.role !== 'freelancer' && req.user.role !== 'admin') {
            return next(new ApiError("You are not authorized to view jobs", responseTypes.UNAUTHORIZED.code));
        }
        const { page, limit, category, keyword, minBudget, maxBudget, skillsRequired } = req.query;

        const data = {
            page,
            limit,
            category,
            keyword,
            minBudget,
            maxBudget,
            skillsRequired
        };

        const response = await fetchAnotherServerWithQuery(`${process.env.JOB_SERVER}/api/job/`, 'GET',data);
        if (response.statusCode === 200) {
            responseWrapper(res, responseTypes.SUCCESS, "Jobs fetched successfully", response.data);
        } else {
            return next(new ApiError(response.message || "Something went wrong", response.statusCode || responseTypes.BAD_REQUEST.code));
        }
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 401 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
}

module.exports = getAllJobsController;