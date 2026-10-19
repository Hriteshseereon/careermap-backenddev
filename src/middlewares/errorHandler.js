// Central 404 + error handling. Every error leaves the API as JSON: { success: false, message }.

const isProduction = () => process.env.NODE_ENV === "production";

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl.split("?")[0]}`,
  });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let status = Number(err?.status || err?.statusCode) || 500;
  let message = err?.message || "Internal server error";

  // Prisma known request errors
  if (err?.code === "P2002") {
    status = 409;
    message = "A record with this value already exists.";
  } else if (err?.code === "P2025") {
    status = 404;
    message = "Record not found.";
  } else if (err?.code === "P2003") {
    status = 409;
    message = "This record is linked to other data and cannot be changed or deleted.";
  } else if (err?.name === "PrismaClientValidationError") {
    status = 400;
    message = "Invalid request data.";
  } else if (err?.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON in request body.";
  } else if (err?.type === "entity.too.large") {
    status = 413;
    message = "Request body is too large.";
  } else if (err?.name === "MulterError") {
    status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "File is too large." : err.message;
  } else if (err instanceof SyntaxError) {
    // e.g. JSON.parse of a malformed form field
    status = 400;
    message = "Invalid JSON in request.";
  } else if (message === "CORS not allowed for this origin") {
    status = 403;
  }

  if (status < 400 || status > 599) {
    status = 500;
  }

  if (status >= 500) {
    console.error(`❌ ${req.method} ${req.originalUrl}:`, err);
    if (isProduction()) {
      message = "Internal server error";
    }
  }

  res.status(status).json({ success: false, message });
};
