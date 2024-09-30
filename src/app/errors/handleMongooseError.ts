import mongoose from "mongoose";
import { genericErrorReturn, TErrorSourece } from "./error.interface";

//validation error
export const handleMongooseError = (
  err: mongoose.Error.ValidationError
): genericErrorReturn => {
  const errorSource: TErrorSourece[] = Object.values(err.errors).map(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: value?.path,
        message: value?.message,
      };
    }
  );

  const statusCode = 400;
  return {
    statusCode,
    message: "Mongoose Error",
    errorSource,
  };
};

//cast error

export const handleMongooseCastError = (
  err: mongoose.Error.CastError
): genericErrorReturn => {
  const errorSource: TErrorSourece[] = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: "Mongoose Error",
    errorSource,
  };
};

//dpulicate error
export const handleMongooseDuplicateError = (err: any): genericErrorReturn => {
  const match =
    err.message.match(/"([^"]*)"/) ||
    err.erroData.errorResponse.errmsg.match(/"([^"]*)"/);
  const message = match && match[1];
  const errorSource: TErrorSourece[] = [
    {
      path: "",
      message: `${message} is duplicated`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Mongoose duplicate Error",
    errorSource,
  };
};
