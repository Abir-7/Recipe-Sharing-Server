import e, { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { handleZodError } from "../errors/handleZodError";
import { TErrorSourece } from "../errors/error.interface";
import {
  handleMongooseCastError,
  handleMongooseError,
} from "../errors/handleMongooseError";
import AppError from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err.message, "gggg");
  let statusCode = 500;
  let message = "something went wrong";

  let errorSource: TErrorSourece[] = [
    {
      path: "",
      message: "something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleMongooseError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleMongooseCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err?.code === 11000 || err?.erroData?.code === 11000) {
    const simplifiedError = handleMongooseError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSource = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSource = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    ...(message !== "You have no access to this route" && {
      errorMessages: errorSource,
      stack: err?.stack,
    }), // config.node_env == 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
