/**
 * Global error handler.
 * Must be registered AFTER all routes with app.use(errorHandler).
 */
function errorHandler(err, req, res, _next) {
  console.error('[ErrorHandler]', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
