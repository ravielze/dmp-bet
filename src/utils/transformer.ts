import { StandardError } from "../error";
import { StatusCodes } from "./http";
import { ValidationError } from "class-validator";

export enum ResponseStatus {
  OK = "ok",
  UNAUTHORIZED = "unauthorized",
  ERROR = "error",
}

interface BaseResponse {
  status_code: ResponseStatus;
  data: any;
}

interface ValidationErrorResponse {
  property: string;
  details: {
    [constraint: string]: string;
  };
}

export function CreateResponseError(error: any) {
  const response: BaseResponse = {
    status_code: ResponseStatus.ERROR,
    data: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    },
  };
  if (error instanceof Error) {
    response.data.details = error.message;
  } else {
    response.data.details = error;
  }
  return response;
}

export function CreateResponseStandardError(error: StandardError) {
  return {
    status_code: ResponseStatus.ERROR,
    data: {
      code: error.code,
      details: error.details,
    },
  };
}

export function CreateResponse(
  status: ResponseStatus,
  data?: any
): BaseResponse {
  if (!data) {
    data = "ok";
  }
  return {
    status_code: status,
    data: data,
  };
}

export function CreateValidationErrorResponse(
  errors: ValidationError[]
): ValidationErrorResponse[] {
  if (!errors || errors.length == 0) {
    return [];
  }
  const response: ValidationErrorResponse[] = errors.map((raw) => {
    return {
      property: raw.property,
      details: raw.constraints,
    } as ValidationErrorResponse;
  });
  return response;
}
