import { Service } from "typedi";
import { NextFunction, Request, Response } from "express";
import { getHeaderToken } from "../utils/http-header";
import UserService from "../service/user";
import TokenService from "../service/token";

@Service()
class AuthMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  isAuthorized(): (req: Request, res: Response, next: NextFunction) => void {
    const self = this;
    return async (req: Request, res: Response, next: NextFunction) => {
      req.loggedUser = null;
      try {
        const jwtToken: string = getHeaderToken(req);
        const authData: any = self.tokenService.validateToken(jwtToken);
        req.loggedUser = await self.userService.findById(authData.id);
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

export default AuthMiddleware;
