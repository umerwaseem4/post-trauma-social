class ApiResponse {
    /**
     * Creates an instance of ApiResponse.
     * @param {number} statusCode - The HTTP status code of the response.
     * @param {*} data - The data to be sent in the response.
     * @param {string} [message='Success'] - The message to be sent in the response.
     */
    constructor(statusCode, data, message = 'Success') {
        if (typeof statusCode !== 'number') {
            throw new TypeError('statusCode must be a number');
        }

        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
