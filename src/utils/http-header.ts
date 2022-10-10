import { Request } from "express";
import { StandardError } from "../error";
import { StatusCodes } from "./http";

export function getHeaderToken(req: Request) {
  if (!req.headers.authorization) {
    throw new StandardError("no authorization", StatusCodes.FORBIDDEN);
  }

  const authString: string = req.headers.authorization;

  if (!(authString.startsWith("Bearer") || authString.trim().length > 0)) {
    throw new StandardError("invalid bearer token", StatusCodes.FORBIDDEN);
  }

  const splitBearer: string[] = authString.split("Bearer ");
  let token: string | undefined = undefined;
  if (splitBearer.length == 2) {
    token = splitBearer[1];
  } else if (authString.startsWith("eyJh")) {
    token = authString;
  }

  if (token) {
    return token.trim();
  } else {
    throw new StandardError("invalid bearer token", StatusCodes.FORBIDDEN);
  }
}
