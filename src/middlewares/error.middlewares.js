import logger from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  const status = err.status || 500
  res.setHeader('Content-Type', 'application/json');
  res.status(status);
  res.send({
    'status': status,
    'message': err.message,
  });
}

export function errorLogger(err, request, response, next) {
  logger.error( `Error: ${err.message}`) 
  next(err) 
}