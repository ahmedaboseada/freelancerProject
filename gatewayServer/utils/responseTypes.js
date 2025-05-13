const ResponseTypes = {
    SUCCESS: {
        code: 200,
        status: "success",
        message: "Operation completed successfully"
    },
    CREATED: {
        code: 201,
        status: "success",
        message: "Resource created successfully"
    },
    ACCEPTED: {
        code: 202,
        status: "success",
        message: "Request accepted, but processing not complete"
    },
    BAD_REQUEST: {
        code: 400,
        status: "error",
        message: "Bad request"
    },
    UNAUTHORIZED: {
        code: 401,
        status: "error",
        message: "Unauthorized"
    },
    FORBIDDEN: {
        code: 403,
        status: "error",
        message: "Forbidden"
    },
    NOT_FOUND: {
        code: 404,
        status: "error",
        message: "Resource not found"
    },
    METHOD_NOT_ALLOWED: {
        code: 405,
        status: "error",
        message: "Method Not Allowed"
    },
    CONFLICT: {
        code: 409,
        status: "error",
        message: "Conflict: The request could not be completed due to a conflict with the current state of the resource"
    },
    GONE: {
        code: 410,
        status: "error",
        message: "Gone: The resource is no longer available and will not be available again"
    },
    TOO_MANY_REQUESTS: {
        code: 429,
        status: "error",
        message: "Too many requests: You have sent too many requests in a given amount of time"
    },
    SERVER_ERROR: {
        code: 500,
        status: "error",
        message: "Internal server error"
    },
    SERVICE_UNAVAILABLE: {
        code: 503,
        status: "error",
        message: "Service unavailable: The server is currently unable to handle the request due to temporary overloading or maintenance"
    }
};

module.exports = ResponseTypes;


// const ResponseTypes = {
//     SUCCESS: {
//         code: 200,
//         status: "success",
//         message: "Operation completed successfully"
//     },
//     CREATED: {
//         code: 201,
//         status: "success",
//         message: "Resource created successfully"
//     },
//     BAD_REQUEST: {
//         code: 400,
//         status: "error",
//         message: "Bad request"
//     },
//     UNAUTHORIZED: {
//         code: 401,
//         status: "error",
//         message: "Unauthorized"
//     },
//     FORBIDDEN: {
//         code: 403,
//         status: "error",
//         message: "Forbidden"
//     },
//     NOT_FOUND: {
//         code: 404,
//         status: "error",
//         message: "Resource not found"
//     },
//     SERVER_ERROR: {
//         code: 500,
//         status: "error",
//         message: "Internal server error"
//     }
// };
//
// module.exports = ResponseTypes;
