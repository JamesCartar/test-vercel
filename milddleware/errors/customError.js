class CustomApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        // this.statusCode = statusCode;
    }
};

// const createCusomError = (msg, code) => {
//     return new CustomApiError(msg, code);
// };

module.exports = { CustomApiError };