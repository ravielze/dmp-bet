import { Service } from "typedi";
import { BaseController, Controller } from "./base";
import UserService from "../service/user";
import { Request, Response } from "express";
import { AuthValidator } from "../validator/user";
import { validate } from "../validator";
import AsyncHandler from "express-async-handler";
import { CreateResponse, ResponseStatus } from "../utils/transformer";
import TokenService from "../service/token";
import AuthMiddleware from "../middleware/auth";

@Service()
class UserController extends BaseController implements Controller {
  constructor(
    private readonly service: UserService,
    private readonly tokenService: TokenService,
    private readonly authMiddleware: AuthMiddleware
  ) {
    super("/auth");
    this.router.post("/register", AsyncHandler(this.register.bind(this)));
    this.router.post("/login", AsyncHandler(this.login.bind(this)));
    this.router.get(
      "/",
      this.authMiddleware.isAuthorized(),
      AsyncHandler(this.me.bind(this))
    );
  }

  async register(req: Request, res: Response) {
    if (!req.body) {
      req.body = {};
    }
    const item = new AuthValidator(req.body);
    await validate(item);

    const result: any = await this.service.register(item);
    result.token = this.tokenService.createToken(result.id, result);
    res.return(CreateResponse(ResponseStatus.OK, result));
  }

  async login(req: Request, res: Response) {
    if (!req.body) {
      req.body = {};
    }
    const item = new AuthValidator(req.body);
    await validate(item);

    const result: any = await this.service.login(item);
    if (result === null) {
      res.return(
        CreateResponse(ResponseStatus.OK, "username or password is invalid")
      );
      return;
    }
    result.token = this.tokenService.createToken(result.id, result);
    res.return(CreateResponse(ResponseStatus.OK, result));
  }

  async me(req: Request, res: Response) {
    res.return(CreateResponse(ResponseStatus.OK, req.loggedUser));
  }
}

export default UserController;
