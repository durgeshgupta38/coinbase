//created this class to handle errors globally with a better format response
class AppError extends Error {
  //whenever an object of class is created it will call constructor automatically
  constructor(message, statusCode) {
    super(message); //we have to call super for its parent class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
