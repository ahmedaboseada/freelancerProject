const fetch = require('node-fetch');

const fetchAnotherServer = async (url, method = 'POST', data = {}) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-internal-secret': process.env.INTERNAL_SECRET,
        },
        body: JSON.stringify(data),
    };

    let response;
    try {
        response = await fetch(url, options);
    } catch (fetchError) {
        const error = new Error('Failed to connect to internal server');
        error.code = 503; // Service Unavailable
        throw error;
    }

    let json;
    try {
        json = await response.json();
    } catch (parseError) {
        const error = new Error('Invalid response from internal server');
        error.code = response.status || 500;
        throw error;
    }

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


    let response;
    try {
        response = await fetch(url, options);
    } catch (fetchError) {
        const error = new Error('Failed to connect to internal server');
        error.code = 503; // Service Unavailable
        throw error;
    }

    let json;
    try {
        json = await response.json();
    } catch (parseError) {
        const error = new Error('Invalid response from internal server');
        error.code = response.status || 500;
        throw error;
    }

    return {
        statusCode: response.status,
        ...json,
    };
};



const fetchAnotherServerWithQuery = async (url, method = 'GET', data = {}) => {
    const queryParts = [];
    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
            queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
    }
    const queryString = queryParts.join('&');
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-internal-secret': process.env.INTERNAL_SECRET,
        },
    };

    let response;
    try {
        response = await fetch(fullUrl, options);
    } catch (fetchError) {
        const error = new Error('Failed to connect to internal server');
        error.code = 503; // Service Unavailable
        throw error;
    }

    let json;
    try {
        json = await response.json();
    } catch (parseError) {
        const error = new Error('Invalid response from internal server');
        error.code = response.status || 500;
        throw error;
    }

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


module.exports = {fetchAnotherServer, fetchAnotherServerWithoutBody, fetchAnotherServerWithQuery};
