import { Request, Response, NextFunction } from "express";
import { StandardError, ValidationError } from "../error";
import {
  CreateResponseError,
  CreateResponseStandardError,
  CreateValidationErrorResponse,
} from "../utils/transformer";
import { StatusCodes } from "../utils/http";

export const ErrorMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error) {
    if (error instanceof StandardError) {
      res.returnError(error.code, CreateResponseStandardError(error));
    } else if (error instanceof ValidationError) {
      res.returnError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        CreateResponseStandardError(
          new StandardError(
            CreateValidationErrorResponse(error.validationErrors),
            StatusCodes.UNPROCESSABLE_ENTITY
          )
        )
      );
    } else if (
      error instanceof SyntaxError &&
      error.message.includes("JSON at position")
    ) {
      res.returnError(
        StatusCodes.BAD_REQUEST,
        CreateResponseStandardError(
          new StandardError(error.message, StatusCodes.BAD_REQUEST)
        )
      );
    } else {
      console.error(error);
      res.returnError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        CreateResponseError(error)
      );
    }
    return;
  }
  next();
};
