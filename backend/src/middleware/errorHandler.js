module.exports = function errorHandler(err, req, res, next) {
  console.error(err);

  // If the error comes from Zod validation
  if (err.name === "ZodError") {
    const firstError = err.errors[0];
    const message = `${firstError.path.join(".")}: ${firstError.message}`;
    return res.status(400).json({ message });
  }

  // If the error comes from the Database Trigger (RAISE EXCEPTION)
  if (err.code && err.code.startsWith('P')) { // PostgreSQL error codes
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Server error"
  });
};