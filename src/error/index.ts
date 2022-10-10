import { StatusCodes } from "../utils/http";
import { ValidationError as rawValidationError } from "class-validator";

export class StandardError extends Error {
  constructor(public details: any, public code: StatusCodes) {
    super();
    if (code < 400 || code > 599) {
      throw new Error("😱 Non-error HTTP Codes returned");
    }
  }
}

export class ValidationError extends Error {
  constructor(public validationErrors: rawValidationError[]) {
    super();
  }
}
