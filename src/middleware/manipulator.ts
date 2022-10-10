import {
  HttpStatusFormat,
  MethodFormat,
  StringPadding,
} from "../utils/formatter";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "../utils/http";

export const RequestResponseManipulator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = new Date();
  const base = () => {
    const end = new Date();
    const httpStatus = StringPadding(
      18,
      HttpStatusFormat(req.statusCode !== undefined ? res.statusCode : 100),
      " "
    );
    const method = StringPadding(12, MethodFormat(req.method), " ");
    const timeInMS = StringPadding(
      8,
      `${end.getTime() - start.getTime()}ms`,
      " "
    );
    const prefix = `📦 | ${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      second: "numeric",
    })} | ${httpStatus} | ${method} | ${timeInMS}`;
    console.info(`${prefix} | ${req.path}`);
  };

  res.return = (responseBody: any) => {
    res.status(StatusCodes.OK).json(responseBody);
    base();
    return res;
  };

  res.returnError = (code: StatusCodes, responseBody: any) => {
    res.status(code).json(responseBody);
    base();
    return res;
  };
  next();
};
