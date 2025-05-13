const {fetchAnotherServer} = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const updateJobByIdController = async (req, res, next) => {
    try {
        if (!req.user) {
            console.log("not logged in")
            return next(new ApiError("You have to login first!", responseTypes.UNAUTHORIZED.code));
        }
        if (req.user.role !== 'client') {
            console.log("not client")
            return next(new ApiError("You are not authorized to update this job", responseTypes.UNAUTHORIZED.code));
        }
        const clientId = req.user.userId;
        const { title, description, skillsRequired, budget, timeline, category, attachments } = req.body;
        const data = {
            title,
            description,
            skillsRequired,
            budget,
            timeline,
            category,
            attachments,
            clientId
        };
        const jobId = req.params.id;
        const response = await fetchAnotherServer(`${process.env.JOB_SERVER}/api/job/${jobId}`, 'PUT', data);

        if (response.statusCode === 200) {
            responseWrapper(res, responseTypes.SUCCESS, "Job updated successfully", response.data);
        } else if (response.statusCode === 404) {
            return next(new ApiError("Job not found", responseTypes.NOT_FOUND.code));
        } else {
            return next(new ApiError(response.message || "Something went wrong", response.statusCode || responseTypes.BAD_REQUEST.code));
        }
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 401 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
}

module.exports = updateJobByIdController;