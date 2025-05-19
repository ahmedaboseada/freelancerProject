const {fetchAnotherServer} = require('../../../utils/fetchAnotherServer');
const responseWrapper = require('../../../utils/responseWrapper');
const responseTypes = require('../../../utils/responseTypes');
const ApiError = require('../../../utils/apiError');
const mongoose = require('mongoose');

const setJobStatusController = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new ApiError('You have to login first!', responseTypes.UNAUTHORIZED.code));
        }

        if (req.user.role !== 'admin' && req.user.role !== 'client') {
            return next(new ApiError('User not authorized', responseTypes.FORBIDDEN.code));
        }

        const {id} = req.params;
        const {status} = req.body;

        // Validate job ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError("Invalid job ID format", responseTypes.BAD_REQUEST.code));
        }

        // Validate status
        const statusFilter = ['open', 'in progress', 'completed'];
        if (!statusFilter.includes(status)) {
            return next(new ApiError('Invalid status', responseTypes.BAD_REQUEST.code));
        }

        // Fetch job from another server
        const response = await fetchAnotherServer(
            `${process.env.JOB_SERVER}/api/job/${id}/status`,
            'PUT',
            {status, clientId: req.user.userId},
        );

        if (response.statusCode === 200) {
            return responseWrapper(res, responseTypes.SUCCESS, response.message || "Status updated successfully", response.data);
        } else {
            return next(new ApiError(response.message || "Failed to update job status", response.statusCode || responseTypes.BAD_REQUEST.code));
        }
    } catch (error) {
        console.error("Set job status error:", error);
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode < 500 ? error.message : "Internal server error";
        return next(new ApiError(message, statusCode));
    }
};

module.exports = setJobStatusController;