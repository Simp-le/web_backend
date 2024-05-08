class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
        this.isOperational = true; // if custom = true, if we get it from the other packages -> false/missing, and we can't print the error message
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
