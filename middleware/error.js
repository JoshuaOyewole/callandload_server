const err = (err, req, res, next) => {
  // Check if the error object exists
  if (!err) {
    return next(); // Pass control to the next middleware
  }

  console.error(err.stack);

  // Check if res is null or undefined
  if (!res) {
    // If res is not available, simply log the error
    console.error("Response object not available");
    next(); // Pass control to the next middleware
  }

  // Check if the error has a status property
  const statusCode = err.status || 500;
  // Send an appropriate error response
  res.status(statusCode).json({ msg: "Something went wrong!" });
};

module.exports = err;
