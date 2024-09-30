import { ZodError, ZodIssue } from "zod";
import { genericErrorReturn, TErrorSourece } from "./error.interface";

export const handleZodError = (err: ZodError): genericErrorReturn => {
  const errorSource: TErrorSourece[] = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: "Zod Validation Error",
    errorSource,
  };
};
