function responseWrapper(res, typeObj, customMessage = null, data = undefined) {
    const { code, status, message } = typeObj;

    return res.status(code).json({
        code,
        status,
        message: customMessage || message,
        data
    });
}

module.exports = responseWrapper;
