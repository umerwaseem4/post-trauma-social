class ApiError extends Error {
    /**
     * Creates an instance of ApiError.
     * @param {number} statusCode - The HTTP status code of the response.
     * @param {string} [message='Error'] - The message to be sent in the response.
     */
    constructor(
        statusCode,
        message = 'Something went wrong!',
        errors = [],
        stack = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
