const handleError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    data: err?.data,
    message: err.message,
    success: err?.success,
  });
};

export default handleError