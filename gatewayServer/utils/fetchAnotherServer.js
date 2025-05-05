const fetchAnotherServer = async (url, method = 'POST', data = {}) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-internal-secret': process.env.INTERNAL_SECRET,
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(url, options);

    const json = await response.json();

    if (!response.ok) {
        const error = new Error(json.message || 'Request to internal server failed');
        error.code = response.status;
        throw error;
    }

    return {
        statusCode: response.status,
        ...json,
    };
};

const fetchAnotherServerWithoutBody = async (url, method = 'GET') => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-internal-secret': process.env.INTERNAL_SECRET,
        },
    };

    const response = await fetch(url, options);
    const json = await response.json();

    if (!response.ok) {
        const error = new Error(json.message || 'Request to internal server failed');
        error.code = response.status;
        throw error;
    }

    return {
        statusCode: response.status,
        ...json,
    };
};

module.exports = { fetchAnotherServer, fetchAnotherServerWithoutBody };
