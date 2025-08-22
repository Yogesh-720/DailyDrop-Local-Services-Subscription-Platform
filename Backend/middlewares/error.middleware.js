const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.error(err);

        // Mongoose bad ObjectId
        if (err.name === "CastError") {
            error = new Error("Resource not found");
            error.statusCode = 404;
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            error = new Error("Duplicate field value entered");
            error.statusCode = 400;
        }

        // Mongoose validation error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map((e) => e.message);
            error = new Error(message.join(", "));
            error.statusCode = 400;
        }

        // JWT errors
        if (err.name === "JsonWebTokenError") {
            error = new Error("Invalid token. Please log in again.");
            error.statusCode = 401;
        }

        if (err.name === "TokenExpiredError") {
            error = new Error("Your token has expired. Please log in again.");
            error.statusCode = 401;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Server Error",
        });
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
