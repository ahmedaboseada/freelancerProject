const {fetchAnotherServer} = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');

const createJobController = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new ApiError("You have to login first!", responseTypes.UNAUTHORIZED.code));
        }
        if (req.user.role !== 'client') {
            return next(new ApiError("You are not authorized to create a job", responseTypes.UNAUTHORIZED.code));
        }
        const {title, description, skillsRequired, budget, timeline, category, attachments = []} = req.body;
        const clientId = req.params.id;

        // Validate required fields
        if (!title || !description || !skillsRequired || !budget || !timeline || !category || !clientId) {
            return responseWrapper(res, responseTypes.BAD_REQUEST, "All required fields (title, description, skillsRequired, budget, timeline, category, clientId) must be provided");
        }

        if (req.user.userId !== clientId) {
            return next(new ApiError("You are not authorized to create a job for this client", responseTypes.UNAUTHORIZED.code));
        }

        const job = {title, description, skillsRequired, budget, timeline, category, attachments};

        const response = await fetchAnotherServer(`${process.env.JOB_SERVER}/api/job/create/${clientId}`, 'POST', job);

        if (response.statusCode === 201) {
            return responseWrapper(res, responseTypes.CREATED, "Job created successfully", response.data);
        } else {
            return next(new ApiError(response.message || "Something went wrong", response.statusCode || responseTypes.BAD_REQUEST.code));
        }
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = createJobController;