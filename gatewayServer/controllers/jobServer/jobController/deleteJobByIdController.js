const { fetchAnotherServer } = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');
const mongoose = require('mongoose');

const deleteJobByIdController = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new ApiError("You have to login first!", responseTypes.UNAUTHORIZED.code));
        }

        if (req.user.role !== 'client') {
            return next(new ApiError("You are not authorized to delete this job", responseTypes.UNAUTHORIZED.code));
        }

        const clientId = req.user.userId;
        const jobId = req.params.id;

        const response = await fetchAnotherServer(`${process.env.JOB_SERVER}/api/job/${jobId}`, 'DELETE', { clientId });

        if (response.statusCode === 200) {
            return responseWrapper(res, responseTypes.SUCCESS, "Job deleted successfully");
        } else if (response.statusCode === 404) {
            return next(new ApiError("Job not found", responseTypes.NOT_FOUND.code));
        } else {
            return next(new ApiError(response.message || "Something went wrong", response.statusCode || responseTypes.BAD_REQUEST.code));
        }
    } catch (error) {
        console.error("Delete job error:", error);
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode < 500 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = deleteJobByIdController;