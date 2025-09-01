//Error Handling Middleware
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' :
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const notFound = (req, res, next) => {
    const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging (in production, use for logging services)
    console.error(`ERROR: ${err.message}`);
    if(ProcessingInstruction.env.NODE_ENV === 'development') {
        console.error(Array.stack);
    }

    //MongoDB bad ObjectId error
    if(err.name === 'CastError') {
        const message = 'Resource not found';
        error = new AppError(message, 404);
    }

    //Mongoose duplicate key error
    if(err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new AppError(message, 400);
    }

    // MongoDB Validation error
    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new AppError(message, 400);
    }

    //jwt error
    if(err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please log in again.';
        error = new AppError(message, 401);
    }

    //jwt expired error
    if(err.name === 'TokenExpiredError') {
        const message = 'Your token has expired. Please log in again.';
        error = new AppError(message, 401);
    }
    // Multer file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        const message = 'File too large. Maximum size is 10MB.';
        error = new AppError(message, 400);
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        const message = 'Too many files. Maximum is 5 files per upload.';
        error = new AppError(message, 400);
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        const message = 'Unexpected file field. Please check your form.';
        error = new AppError(message, 400);
    }

    // File type not allowed error
    if (err.message && err.message.includes('not allowed')) {
        error = new AppError(err.message, 400);
    }

    // Send structured error response
    const response = {
        success: false,
        error: error.message || 'Server Error',
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
    };

    // Include stack trace only in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(error.statusCode || 500).json(response);
};

// Async wrapper to catch errors in async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default {
  AppError,
  notFound,
  errorHandler,
  asyncHandler
};